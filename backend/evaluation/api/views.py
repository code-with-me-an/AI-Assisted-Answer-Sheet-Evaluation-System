from decimal import Decimal
import statistics

from django.db import transaction
from django.db.models import Count, Q, Sum
from rest_framework import status
from rest_framework.exceptions import NotFound, PermissionDenied
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from ..models import (
    Evaluation, Examination, ExamStudent, Question,
    ReferenceAnswer, ReferenceFact, Result, Student, StudentAnswer, Teacher,
)
from ..services.asag import evaluate_answer, generate_candidate_facts
from .serializers import (
    EvaluationCreateSerializer, EvaluationRequestSerializer, EvaluationReviewSerializer,
    EvaluationSerializer, ExaminationListSerializer, ExaminationUpdateSerializer,
    ExaminationWriteSerializer, GenerateFactsRequestSerializer,
    ReferenceAnswerSerializer, ReferenceFactSerializer, ResultSerializer,
    StudentSerializer, TeacherProfileSerializer,
)


class TeacherRequiredAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def teacher(self):
        if self.request.user.teacher is not None:
            return self.request.user.teacher

        # Auto-provision or link teacher if authenticated with Supabase user
        user_id = self.request.user.supabase_user_id
        email = self.request.user.email
        if user_id and email:
            name = (
                self.request.user.claims.get('user_metadata', {}).get('name')
                or email.split('@')[0]
            )
            teacher, _ = Teacher.objects.get_or_create(
                supabase_user_id=user_id,
                defaults={'email': email, 'name': name},
            )
            self.request.user.teacher = teacher
            return teacher

        raise PermissionDenied('Create a teacher profile before using this endpoint.')

    def exam(self, examination_id):
        try:
            return Examination.objects.get(examination_id=examination_id, teacher=self.teacher())
        except Examination.DoesNotExist:
            raise NotFound('Exam not found.')


class GenerateCandidateFactsView(TeacherRequiredAPIView):
    """Generate candidate atomic reference facts from a reference answer text."""

    def post(self, request):
        serializer = GenerateFactsRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        ref_text = serializer.validated_data['reference_answer']
        facts = generate_candidate_facts(ref_text)
        return Response({'facts': facts})


class ReferenceAnswerFactsView(TeacherRequiredAPIView):
    """List or add reference facts for a question's reference answer."""

    def get_reference(self, reference_id):
        ref = ReferenceAnswer.objects.filter(
            reference_id=reference_id,
            question__examination__teacher=self.teacher(),
        ).first()
        if not ref:
            raise NotFound('Reference answer not found.')
        return ref

    def get(self, request, reference_id):
        ref = self.get_reference(reference_id)
        facts = ref.facts.all().order_by('order_index', 'fact_id')
        return Response({
            'reference_id': ref.reference_id,
            'is_approved': ref.is_approved,
            'facts': ReferenceFactSerializer(facts, many=True).data,
        })

    def post(self, request, reference_id):
        ref = self.get_reference(reference_id)
        fact_text = request.data.get('fact_text', '').strip()
        if not fact_text:
            return Response({'fact_text': ['Fact text is required.']}, status=status.HTTP_400_BAD_REQUEST)
        order_index = int(request.data.get('order_index', ref.facts.count()))
        is_approved = bool(request.data.get('is_approved', True))
        fact = ReferenceFact.objects.create(
            reference_answer=ref,
            fact_text=fact_text,
            order_index=order_index,
            is_approved=is_approved,
        )
        return Response(ReferenceFactSerializer(fact).data, status=status.HTTP_201_CREATED)


class ReferenceFactDetailView(TeacherRequiredAPIView):
    """Edit or delete an individual reference fact."""

    def get_fact(self, fact_id):
        fact = ReferenceFact.objects.filter(
            fact_id=fact_id,
            reference_answer__question__examination__teacher=self.teacher(),
        ).first()
        if not fact:
            raise NotFound('Reference fact not found.')
        return fact

    def patch(self, request, fact_id):
        fact = self.get_fact(fact_id)
        if 'fact_text' in request.data:
            text = request.data['fact_text'].strip()
            if not text:
                return Response({'fact_text': ['Fact text cannot be empty.']}, status=status.HTTP_400_BAD_REQUEST)
            fact.fact_text = text
        if 'order_index' in request.data:
            fact.order_index = int(request.data['order_index'])
        if 'is_approved' in request.data:
            fact.is_approved = bool(request.data['is_approved'])
        fact.save()
        return Response(ReferenceFactSerializer(fact).data)

    def delete(self, request, fact_id):
        fact = self.get_fact(fact_id)
        fact.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class ReferenceAnswerApproveFactsView(TeacherRequiredAPIView):
    """Approve and optionally synchronize all reference facts for a reference answer."""

    @transaction.atomic
    def post(self, request, reference_id):
        ref = ReferenceAnswer.objects.filter(
            reference_id=reference_id,
            question__examination__teacher=self.teacher(),
        ).first()
        if not ref:
            raise NotFound('Reference answer not found.')

        facts_payload = request.data.get('facts')
        if facts_payload is not None and isinstance(facts_payload, list):
            ref.facts.all().delete()
            for idx, item in enumerate(facts_payload):
                text = item.get('fact_text') if isinstance(item, dict) else str(item)
                text = text.strip() if text else ''
                if text:
                    ReferenceFact.objects.create(
                        reference_answer=ref,
                        fact_text=text,
                        order_index=idx,
                        is_approved=True,
                    )
        else:
            ref.facts.all().update(is_approved=True)

        ref.is_approved = True
        ref.save(update_fields=['is_approved'])

        facts = ref.facts.all().order_by('order_index', 'fact_id')
        return Response({
            'message': 'Reference facts approved successfully.',
            'reference_id': ref.reference_id,
            'is_approved': True,
            'facts': ReferenceFactSerializer(facts, many=True).data,
        })


class EvaluationView(TeacherRequiredAPIView):
    """Payload validation endpoint for ASAG evaluate request."""

    def post(self, request):
        serializer = EvaluationRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data
        ref_text = " ".join(data.get('reference_answers', []))
        ref_facts = data.get('reference_facts', [])
        eval_result = evaluate_answer(
            reference_answer=ref_text,
            student_answer=data['student_answer'],
            reference_facts=ref_facts if ref_facts else None,
            max_marks=float(data['max_marks']),
        )
        return Response({'message': 'Evaluation completed successfully.', 'data': eval_result})


class TeacherProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user_id = request.user.supabase_user_id
        email = request.user.email
        teacher = request.user.teacher or Teacher.objects.filter(supabase_user_id=user_id).first()
        if teacher is None and user_id and email:
            name = (
                request.user.claims.get('user_metadata', {}).get('name')
                or email.split('@')[0]
            )
            teacher, _ = Teacher.objects.get_or_create(
                supabase_user_id=user_id,
                defaults={'email': email, 'name': name},
            )
            request.user.teacher = teacher

        if teacher is None:
            return Response({'detail': 'Teacher profile not found.'}, status=status.HTTP_404_NOT_FOUND)
        return Response(self._representation(teacher))

    def post(self, request):
        serializer = TeacherProfileSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user_id, email = request.user.supabase_user_id, request.user.email
        if not email:
            return Response({'detail': 'Supabase account does not include an email address.'}, status=status.HTTP_400_BAD_REQUEST)
        name = serializer.validated_data.get('name') or request.user.claims.get('user_metadata', {}).get('name') or email.split('@')[0]
        teacher = request.user.teacher or Teacher.objects.filter(supabase_user_id=user_id).first()
        if teacher is None:
            teacher = Teacher.objects.filter(email__iexact=email, supabase_user_id__isnull=True).first()
            if teacher:
                teacher.supabase_user_id = user_id
                teacher.name = name
                teacher.save(update_fields=['supabase_user_id', 'name'])
            else:
                teacher = Teacher.objects.create(supabase_user_id=user_id, email=email, name=name)
        elif 'name' in serializer.validated_data:
            teacher.name = name
            teacher.save(update_fields=['name'])
        request.user.teacher = teacher
        return Response(self._representation(teacher))

    patch = post

    @staticmethod
    def _representation(teacher):
        exams_count = Examination.objects.filter(teacher=teacher).count()
        students_count = Student.objects.filter(teacher=teacher).count()
        evaluations_count = Evaluation.objects.filter(
            student_answer__exam_student__examination__teacher=teacher
        ).count()
        return {
            'teacher_id': teacher.teacher_id,
            'supabase_user_id': str(teacher.supabase_user_id),
            'name': teacher.name,
            'email': teacher.email,
            'created_at': teacher.created_at,
            'exams_count': exams_count,
            'students_count': students_count,
            'evaluations_count': evaluations_count,
        }


class DashboardView(TeacherRequiredAPIView):
    def get(self, request):
        teacher = self.teacher()
        exams = Examination.objects.filter(teacher=teacher).prefetch_related(
            'questions', 'assignments__student', 'assignments__student_answers__evaluation', 'assignments__result',
        ).order_by('-created_at')

        recent_exams_data = [ExaminationListCreateView._compute_exam_stats(exam) for exam in exams[:5]]

        all_evaluations = Evaluation.objects.filter(
            student_answer__exam_student__examination__teacher=teacher
        ).distinct()
        all_results = Result.objects.filter(
            exam_student__examination__teacher=teacher
        ).distinct()
        total_students = Student.objects.filter(teacher=teacher).count()

        activities = []
        for exam in exams[:3]:
            activities.append({
                'title': f'Exam created: {exam.exam_name}',
                'description': f'{exam.subject} · {exam.assignments.count()} students assigned',
                'time': exam.created_at.strftime('%b %d, %I:%M %p'),
            })
        for res in all_results.select_related('exam_student__student', 'exam_student__examination').order_by('-generated_at')[:3]:
            st_name = res.exam_student.student.full_name if res.exam_student else "Student"
            ex_name = res.exam_student.examination.exam_name if res.exam_student else "Exam"
            activities.append({
                'title': f'Result finalized: {st_name}',
                'description': f'{ex_name} · Score: {res.total_marks}/{res.maximum_marks} ({res.percentage}%)',
                'time': res.generated_at.strftime('%b %d, %I:%M %p'),
            })

        activities = activities[:5]

        return Response({
            'teacher': TeacherProfileView._representation(teacher),
            'statistics': {
                'total_exams': exams.count(),
                'total_students': total_students,
                'evaluations': all_evaluations.count(),
                'pending_review': all_evaluations.filter(is_reviewed=False).count(),
            },
            'recent_exams': recent_exams_data,
            'recent_activity': activities,
        })


class ExaminationListCreateView(TeacherRequiredAPIView):
    @staticmethod
    def _compute_exam_stats(exam):
        questions = list(exam.questions.all())
        question_count = len(questions)
        total_marks = sum(q.max_marks for q in questions) if questions else Decimal('0.00')

        assignments = list(exam.assignments.select_related('student').prefetch_related('student_answers__evaluation', 'result'))
        student_count = len(assignments)

        evaluated_students = 0
        scores_pct = []

        for assignment in assignments:
            has_result = hasattr(assignment, 'result') and assignment.result
            evals = [sa.evaluation for sa in assignment.student_answers.all() if hasattr(sa, 'evaluation') and sa.evaluation]

            if has_result:
                evaluated_students += 1
                scores_pct.append(float(assignment.result.percentage))
            elif evals:
                evaluated_students += 1
                if total_marks > 0:
                    eval_sum = sum(e.awarded_marks for e in evals)
                    scores_pct.append(float((eval_sum / total_marks) * 100))

        pending_students = max(0, student_count - evaluated_students)

        if scores_pct:
            avg_score = round(statistics.mean(scores_pct), 1)
            highest_score = round(max(scores_pct), 1)
            lowest_score = round(min(scores_pct), 1)
            median_score = round(statistics.median(scores_pct), 1)
            passed = sum(1 for s in scores_pct if s >= 40.0)
            pass_rate = round((passed / len(scores_pct)) * 100, 1)
        else:
            avg_score = 0.0
            highest_score = 0.0
            lowest_score = 0.0
            median_score = 0.0
            pass_rate = 0.0

        if evaluated_students == 0:
            exam_status = 'pending'
        elif evaluated_students >= student_count and student_count > 0:
            exam_status = 'completed'
        else:
            exam_status = 'partial'

        return {
            'examination_id': exam.examination_id,
            'exam_name': exam.exam_name,
            'subject': exam.subject,
            'exam_date': exam.exam_date,
            'created_at': exam.created_at,
            'question_count': question_count,
            'student_count': student_count,
            'total_marks': str(total_marks),
            'evaluated_count': evaluated_students,
            'pending_count': pending_students,
            'average_score': avg_score,
            'highest_score': highest_score,
            'lowest_score': lowest_score,
            'median_score': median_score,
            'pass_rate': pass_rate,
            'status': exam_status,
        }

    def get(self, request):
        exams = Examination.objects.filter(teacher=self.teacher()).prefetch_related(
            'questions', 'assignments__student', 'assignments__student_answers__evaluation', 'assignments__result',
        ).order_by('-created_at')
        return Response([self._compute_exam_stats(exam) for exam in exams])

    @transaction.atomic
    def post(self, request):
        serializer = ExaminationWriteSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data, teacher = serializer.validated_data, self.teacher()
        draft_id = data.get('draft_id')
        is_draft = data.get('is_draft', False)

        if draft_id:
            exam = Examination.objects.filter(examination_id=draft_id, teacher=teacher).first()
            if not exam:
                raise NotFound('Draft exam not found.')
            exam.exam_name = data['exam_name']
            exam.subject = data['subject']
            exam.exam_date = data['exam_date']
            exam.is_draft = is_draft
            exam.save()
            exam.questions.all().delete()
            exam.assignments.all().delete()
        else:
            exam = Examination.objects.create(
                teacher=teacher,
                exam_name=data['exam_name'],
                subject=data['subject'],
                exam_date=data['exam_date'],
                is_draft=is_draft,
            )

        for question_data in data.get('questions', []):
            question = Question.objects.create(
                examination=exam,
                question_number=question_data['question_number'],
                question_text=question_data['question_text'],
                max_marks=question_data['max_marks'],
                question_type=question_data.get('question_type', 'descriptive'),
            )
            answer_text = question_data.get('reference_answer', '').strip()
            if answer_text:
                ref_ans = ReferenceAnswer.objects.create(
                    question=question,
                    reference_number=1,
                    answer_text=answer_text,
                    is_approved=question_data.get('is_approved', True),
                )
                facts_list = question_data.get('reference_facts', [])
                if not facts_list:
                    facts_list = generate_candidate_facts(answer_text)

                for idx, fact_item in enumerate(facts_list):
                    fact_str = fact_item.strip() if isinstance(fact_item, str) else str(fact_item).strip()
                    if fact_str:
                        ReferenceFact.objects.create(
                            reference_answer=ref_ans,
                            fact_text=fact_str,
                            order_index=idx,
                            is_approved=True,
                        )

        for student_data in data.get('students', []):
            roll = student_data.get('roll_number', '').strip()
            if roll:
                student, _ = Student.objects.update_or_create(
                    teacher=teacher,
                    roll_number=roll,
                    defaults={
                        'full_name': student_data.get('full_name', '').strip() or roll,
                        'email': student_data.get('email', '').strip(),
                    },
                )
                ExamStudent.objects.get_or_create(examination=exam, student=student)

        return Response(self._detail(exam), status=status.HTTP_201_CREATED)

    @staticmethod
    def _detail(exam):
        questions_data = []
        total_marks = Decimal('0.00')

        questions = list(
            exam.questions.prefetch_related('reference_answers__facts', 'evaluations')
            .order_by('question_number')
        )

        for question in questions:
            total_marks += question.max_marks
            reference = question.reference_answers.first()
            evals = list(question.evaluations.all())
            if evals:
                avg_val = round(float(sum(e.awarded_marks for e in evals) / len(evals)), 2)
                pct = (avg_val / float(question.max_marks)) * 100 if question.max_marks > 0 else 0
                diff = 'high' if pct >= 80 else ('moderate' if pct >= 60 else 'low')
            else:
                avg_val = 0.0
                diff = 'moderate'

            questions_data.append({
                'question_id': question.question_id,
                'question_number': question.question_number,
                'question_text': question.question_text,
                'max_marks': str(question.max_marks),
                'question_type': question.question_type,
                'avg_score': avg_val,
                'difficulty': diff,
                'reference_answer': ReferenceAnswerSerializer(reference).data if reference else None,
            })

        students_data = []
        assignments = list(exam.assignments.select_related('student').prefetch_related('student_answers__evaluation', 'result').order_by('student__full_name'))

        for assignment in assignments:
            st = assignment.student
            has_result = hasattr(assignment, 'result') and assignment.result
            evals = [sa.evaluation for sa in assignment.student_answers.all() if hasattr(sa, 'evaluation') and sa.evaluation]

            if has_result:
                st_status = 'reviewed'
                score = float(assignment.result.total_marks)
                pct = float(assignment.result.percentage)
                grade = assignment.result.grade
                has_evals = True
                is_final = True
            elif evals:
                st_status = 'evaluated'
                eval_sum = sum(e.awarded_marks for e in evals)
                score = float(eval_sum)
                pct = round((score / float(total_marks or 1)) * 100, 1)
                grade = ''
                has_evals = True
                is_final = False
            else:
                st_status = 'pending'
                score = None
                pct = None
                grade = ''
                has_evals = False
                is_final = False

            students_data.append({
                'student_id': st.student_id,
                'full_name': st.full_name,
                'roll_number': st.roll_number,
                'email': st.email,
                'status': st_status,
                'score': score,
                'final_score': score,
                'pct': pct,
                'grade': grade,
                'has_evaluations': has_evals,
                'is_finalized': is_final,
            })

        stats = ExaminationListCreateView._compute_exam_stats(exam)

        return {
            'examination_id': exam.examination_id,
            'exam_name': exam.exam_name,
            'subject': exam.subject,
            'exam_date': exam.exam_date,
            'total_marks': str(total_marks),
            'question_count': len(questions_data),
            'student_count': len(students_data),
            'evaluated_count': stats['evaluated_count'],
            'pending_count': stats['pending_count'],
            'average_score': stats['average_score'],
            'highest_score': stats['highest_score'],
            'lowest_score': stats['lowest_score'],
            'median_score': stats['median_score'],
            'pass_rate': stats['pass_rate'],
            'is_draft': exam.is_draft,
            'status': stats['status'],
            'questions': questions_data,
            'students': students_data,
        }


class ExaminationDetailView(TeacherRequiredAPIView):
    def get(self, request, examination_id):
        exam = self.exam(examination_id)
        return Response(ExaminationListCreateView._detail(exam))

    def patch(self, request, examination_id):
        exam = self.exam(examination_id)
        serializer = ExaminationUpdateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        if 'exam_name' in serializer.validated_data:
            exam.exam_name = serializer.validated_data['exam_name']
        if 'subject' in serializer.validated_data:
            exam.subject = serializer.validated_data['subject']
        if 'exam_date' in serializer.validated_data:
            exam.exam_date = serializer.validated_data['exam_date']
        exam.save()
        return Response(ExaminationListCreateView._detail(exam))

    def delete(self, request, examination_id):
        exam = self.exam(examination_id)
        exam.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class StudentListView(TeacherRequiredAPIView):
    def get(self, request):
        teacher = self.teacher()
        students = Student.objects.filter(teacher=teacher).prefetch_related(
            'exam_assignments__examination__questions',
            'exam_assignments__student_answers__evaluation',
            'exam_assignments__result',
        ).order_by('full_name')

        results_data = []
        for student in students:
            exams_info = []
            scores = []
            assignments = list(student.exam_assignments.all())
            assignments.sort(key=lambda a: (a.examination.exam_date, a.assigned_at), reverse=True)

            for assignment in assignments:
                exam = assignment.examination
                has_result = hasattr(assignment, 'result') and assignment.result
                evals = [sa.evaluation for sa in assignment.student_answers.all() if hasattr(sa, 'evaluation') and sa.evaluation]
                total_max = sum(q.max_marks for q in exam.questions.all()) or Decimal('1.00')

                if has_result:
                    score = float(assignment.result.total_marks)
                    total = float(assignment.result.maximum_marks or total_max)
                    pct = float(assignment.result.percentage)
                    st_status = 'completed'
                    grade = assignment.result.grade or ''
                    is_finalized = True
                    scores.append(pct)
                elif evals:
                    eval_sum = sum(e.awarded_marks for e in evals)
                    score = float(eval_sum)
                    total = float(total_max)
                    pct = round((score / total) * 100, 1)
                    st_status = 'evaluated'
                    grade = ''
                    is_finalized = False
                    scores.append(pct)
                else:
                    score = 0
                    total = float(total_max)
                    pct = 0
                    st_status = 'pending'
                    grade = ''
                    is_finalized = False

                exams_info.append({
                    'exam_id': exam.examination_id,
                    'code': exam.subject,
                    'title': exam.exam_name,
                    'score': score,
                    'total': total,
                    'pct': pct,
                    'grade': grade,
                    'status': st_status,
                    'is_finalized': is_finalized,
                    'date': exam.exam_date.strftime('%b %d, %Y'),
                })

            avg_score = round(statistics.mean(scores), 1) if scores else 0
            results_data.append({
                'student_id': student.student_id,
                'full_name': student.full_name,
                'roll_number': student.roll_number,
                'email': student.email,
                'created_at': student.created_at,
                'status': 'active' if exams_info else 'pending',
                'exams': exams_info,
                'average_score': avg_score,
            })

        return Response(results_data)

    def post(self, request):
        teacher = self.teacher()
        serializer = StudentSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        student, _ = Student.objects.update_or_create(
            teacher=teacher,
            roll_number=serializer.validated_data['roll_number'].strip(),
            defaults={
                'full_name': serializer.validated_data['full_name'].strip(),
                'email': serializer.validated_data.get('email', '').strip(),
            },
        )
        return Response(StudentSerializer(student).data, status=status.HTTP_201_CREATED)


class StudentDetailView(TeacherRequiredAPIView):
    def get(self, request, student_id):
        teacher = self.teacher()
        student = Student.objects.filter(student_id=student_id, teacher=teacher).prefetch_related(
            'exam_assignments__examination__questions',
            'exam_assignments__student_answers__evaluation',
            'exam_assignments__result',
        ).first()
        if not student:
            raise NotFound('Student not found.')

        assignments = list(student.exam_assignments.all())
        assignments.sort(key=lambda a: (a.examination.exam_date, a.assigned_at), reverse=True)
        exams_info = []
        scores = []
        for assignment in assignments:
            exam = assignment.examination
            has_result = hasattr(assignment, 'result') and assignment.result
            evals = [sa.evaluation for sa in assignment.student_answers.all() if hasattr(sa, 'evaluation') and sa.evaluation]
            total_max = sum(q.max_marks for q in exam.questions.all()) or Decimal('1.00')

            if has_result:
                score = float(assignment.result.total_marks)
                total = float(assignment.result.maximum_marks or total_max)
                pct = float(assignment.result.percentage)
                st_status = 'completed'
                grade = assignment.result.grade or ''
                is_finalized = True
                scores.append(pct)
            elif evals:
                eval_sum = sum(e.awarded_marks for e in evals)
                score = float(eval_sum)
                total = float(total_max)
                pct = round((score / total) * 100, 1)
                st_status = 'evaluated'
                grade = ''
                is_finalized = False
                scores.append(pct)
            else:
                score = 0
                total = float(total_max)
                pct = 0
                st_status = 'pending'
                grade = ''
                is_finalized = False

            exams_info.append({
                'exam_id': exam.examination_id,
                'code': exam.subject,
                'title': exam.exam_name,
                'score': score,
                'total': total,
                'pct': pct,
                'grade': grade,
                'status': st_status,
                'is_finalized': is_finalized,
                'date': exam.exam_date.strftime('%b %d, %Y'),
            })

        avg_score = round(statistics.mean(scores), 1) if scores else 0
        return Response({
            'student_id': student.student_id,
            'full_name': student.full_name,
            'roll_number': student.roll_number,
            'email': student.email,
            'created_at': student.created_at,
            'status': 'active' if exams_info else 'pending',
            'exams': exams_info,
            'average_score': avg_score,
        })

    def patch(self, request, student_id):
        teacher = self.teacher()
        student = Student.objects.filter(student_id=student_id, teacher=teacher).first()
        if not student:
            raise NotFound('Student not found.')

        roll = request.data.get('roll_number')
        if roll and roll.strip() != student.roll_number:
            if Student.objects.filter(teacher=teacher, roll_number=roll.strip()).exclude(student_id=student_id).exists():
                return Response({'roll_number': ['A student with this roll number already exists.']}, status=status.HTTP_400_BAD_REQUEST)
            student.roll_number = roll.strip()

        if 'full_name' in request.data and request.data['full_name'].strip():
            student.full_name = request.data['full_name'].strip()
        if 'email' in request.data:
            student.email = request.data['email'].strip()

        student.save()
        return Response(StudentSerializer(student).data)

    def delete(self, request, student_id):
        teacher = self.teacher()
        student = Student.objects.filter(student_id=student_id, teacher=teacher).first()
        if not student:
            raise NotFound('Student not found.')
        student.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class ExamEvaluationView(TeacherRequiredAPIView):
    @transaction.atomic
    def post(self, request, examination_id):
        serializer = EvaluationCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        exam, data = self.exam(examination_id), serializer.validated_data
        question = Question.objects.filter(question_id=data['question_id'], examination=exam).first()
        assignment = ExamStudent.objects.filter(examination=exam, student_id=data['student_id']).select_related('student').first()

        if not question or not assignment:
            raise NotFound('Question or assigned student not found.')

        # Record StudentAnswer
        student_answer_rec, _ = StudentAnswer.objects.update_or_create(
            exam_student=assignment,
            question=question,
            defaults={'answer_text': data['student_answer']},
        )

        # Retrieve reference answer & approved reference facts
        ref_obj = question.reference_answers.prefetch_related('facts').first()
        ref_text = ref_obj.answer_text if ref_obj else ""
        approved_facts = []
        if ref_obj:
            approved_facts = [
                f.fact_text for f in ref_obj.facts.filter(is_approved=True).order_by('order_index', 'fact_id')
            ]

        # Invoke ASAG Evaluator Service
        eval_output = evaluate_answer(
            reference_answer=ref_text,
            student_answer=data['student_answer'],
            reference_facts=approved_facts if approved_facts else None,
            max_marks=float(question.max_marks),
        )

        pct_val = int(eval_output['percentage'])
        verif = "correct" if pct_val >= 80 else ("partial" if pct_val >= 40 else "incorrect")
        status_label = "supported" if pct_val >= 80 else ("partially_supported" if pct_val >= 40 else ("contradicted" if eval_output.get('contradicted', 0) > 0 else "missing"))

        matched_facts = [f['fact'] for f in eval_output.get('fact_results', []) if f['label'] == 'supported']
        missing_facts = [f['fact'] for f in eval_output.get('fact_results', []) if f['label'] in ('missing', 'contradicted')]

        analysis_dict = {
            'matched_key_concepts': matched_facts,
            'missing_key_concepts': missing_facts,
            'confidence': eval_output['semantic_similarity'],
            'verification': verif,
            'components': {
                'semantic': eval_output['semantic_similarity'],
                'coverage': pct_val,
                'keywords': 'High' if pct_val >= 80 else ('Medium' if pct_val >= 45 else 'Low'),
                'completeness': pct_val,
                'htr': 95,
            },
            'evaluation_details': eval_output,
            'fact_results': eval_output.get('fact_results', []),
            'reason': '',
        }

        evaluation, _ = Evaluation.objects.update_or_create(
            student_answer=student_answer_rec,
            defaults={
                'question': question,
                'semantic_similarity': Decimal(str(eval_output['semantic_similarity'])),
                'status': status_label,
                'awarded_marks': Decimal(str(eval_output['awarded_marks'])),
                'feedback': eval_output['feedback'],
                'analysis': analysis_dict,
                'is_reviewed': False,
            },
        )

        return Response(self._eval_representation(evaluation, question))

    @staticmethod
    def _eval_representation(evaluation, question):
        ref = question.reference_answers.prefetch_related('facts').first()
        analysis = evaluation.analysis or {}
        eval_details = analysis.get('evaluation_details') or {}
        fact_results = eval_details.get('fact_results') or analysis.get('fact_results', [])

        components = analysis.get('components', {
            'semantic': float(evaluation.semantic_similarity or 0),
            'coverage': int((float(evaluation.awarded_marks) / float(question.max_marks or 1)) * 100),
            'keywords': 'Medium',
            'completeness': int((float(evaluation.awarded_marks) / float(question.max_marks or 1)) * 100),
            'htr': 95,
        })
        verif = analysis.get('verification', 'correct' if float(evaluation.awarded_marks) >= float(question.max_marks) * 0.8 else 'partial')
        student_ans_text = evaluation.student_answer.answer_text if evaluation.student_answer else ''

        return {
            'evaluation_id': evaluation.evaluation_id,
            'qNumber': question.question_number,
            'question_id': question.question_id,
            'question_text': question.question_text,
            'studentAnswer': student_ans_text,
            'referenceAnswer': ref.answer_text if ref else '',
            'reference_facts': [f.fact_text for f in ref.facts.all()] if ref else [],
            'aiScore': float(evaluation.awarded_marks),
            'finalScore': float(evaluation.awarded_marks),
            'verification': verif,
            'components': components,
            'analysis': analysis,
            'fact_results': fact_results,
            'nli': eval_details.get('nli', analysis.get('nli', {'entailment': 0.0, 'neutral': 1.0, 'contradiction': 0.0})),
            'supported': eval_details.get('supported', analysis.get('supported', 0)),
            'contradicted': eval_details.get('contradicted', analysis.get('contradicted', 0)),
            'missing': eval_details.get('missing', analysis.get('missing', 0)),
            'uncertain': eval_details.get('uncertain', analysis.get('uncertain', 0)),
            'total_facts': eval_details.get('total_facts', len(fact_results)),
            'matched_key_concepts': analysis.get('matched_key_concepts', []),
            'missing_key_concepts': analysis.get('missing_key_concepts', []),
            'confidence': analysis.get('confidence', float(evaluation.semantic_similarity or 0)),
            'feedback': evaluation.feedback or '',
            'reviewed': evaluation.is_reviewed,
            'reason': evaluation.teacher_review_reason or analysis.get('reason', ''),
            'max_marks': float(question.max_marks),
            'evaluated_at': evaluation.evaluated_at,
        }


class ExamStudentEvaluationsView(TeacherRequiredAPIView):
    def get(self, request, examination_id, student_id):
        exam = self.exam(examination_id)
        assignment = ExamStudent.objects.filter(examination=exam, student_id=student_id).select_related('student').first()
        if not assignment:
            raise NotFound('Student not assigned to this exam.')

        questions = list(exam.questions.prefetch_related('reference_answers__facts').order_by('question_number'))

        # Fetch evaluations via StudentAnswer
        eval_records = Evaluation.objects.filter(
            student_answer__exam_student=assignment
        ).select_related('question', 'student_answer')
        eval_by_q = {e.question_id: e for e in eval_records}

        evaluations_list = []
        for question in questions:
            ev = eval_by_q.get(question.question_id)
            if ev:
                evaluations_list.append(ExamEvaluationView._eval_representation(ev, question))
            else:
                ref = question.reference_answers.prefetch_related('facts').first()
                evaluations_list.append({
                    'evaluation_id': None,
                    'qNumber': question.question_number,
                    'question_id': question.question_id,
                    'question_text': question.question_text,
                    'studentAnswer': '',
                    'referenceAnswer': ref.answer_text if ref else '',
                    'reference_facts': [f.fact_text for f in ref.facts.all()] if ref else [],
                    'aiScore': 0.0,
                    'finalScore': 0.0,
                    'verification': 'incorrect',
                    'components': {
                        'semantic': 0.0,
                        'coverage': 0,
                        'keywords': 'Low',
                        'completeness': 0,
                        'htr': 0,
                    },
                    'fact_results': [],
                    'feedback': 'Not evaluated yet.',
                    'reviewed': False,
                    'reason': '',
                    'max_marks': float(question.max_marks),
                    'evaluated_at': None,
                })

        result_obj = Result.objects.filter(
            exam_student=assignment
        ).first()

        is_finalized = bool(result_obj and result_obj.is_finalized)
        result_data = ResultSerializer(result_obj).data if result_obj else None

        return Response({
            'examination_id': exam.examination_id,
            'student_id': assignment.student.student_id,
            'student_name': assignment.student.full_name,
            'roll_number': assignment.student.roll_number,
            'evaluations': evaluations_list,
            'is_finalized': is_finalized,
            'result': result_data,
        })


class EvaluationReviewView(TeacherRequiredAPIView):
    def patch(self, request, evaluation_id):
        evaluation = Evaluation.objects.filter(
            evaluation_id=evaluation_id,
            student_answer__exam_student__examination__teacher=self.teacher(),
        ).select_related('question', 'student_answer').first()

        if not evaluation:
            raise NotFound('Evaluation not found.')

        serializer = EvaluationReviewSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        if serializer.validated_data['awarded_marks'] > evaluation.question.max_marks:
            return Response({'detail': 'Score cannot exceed question marks.'}, status=status.HTTP_400_BAD_REQUEST)

        evaluation.awarded_marks = serializer.validated_data['awarded_marks']
        if 'feedback' in serializer.validated_data and serializer.validated_data['feedback']:
            evaluation.feedback = serializer.validated_data['feedback']

        if 'reason' in serializer.validated_data:
            evaluation.teacher_review_reason = serializer.validated_data['reason']
        evaluation.is_reviewed = True

        analysis = evaluation.analysis or {}
        if 'reason' in serializer.validated_data:
            analysis['reason'] = serializer.validated_data['reason']
        analysis['reviewed'] = True
        evaluation.analysis = analysis

        evaluation.save(update_fields=['awarded_marks', 'feedback', 'teacher_review_reason', 'is_reviewed', 'analysis'])
        return Response(ExamEvaluationView._eval_representation(evaluation, evaluation.question))


class ExamStudentFinalizeView(TeacherRequiredAPIView):
    @transaction.atomic
    def post(self, request, examination_id, student_id):
        exam = self.exam(examination_id)
        assignment = ExamStudent.objects.filter(examination=exam, student_id=student_id).select_related('student').first()
        if not assignment:
            raise NotFound('Student not assigned to this exam.')

        evaluations = list(Evaluation.objects.filter(
            student_answer__exam_student=assignment
        ))

        total_awarded = sum(e.awarded_marks for e in evaluations) if evaluations else Decimal('0.00')
        max_marks = sum(q.max_marks for q in exam.questions.all()) or Decimal('1.00')

        pct = ((total_awarded / max_marks) * 100).quantize(Decimal('0.01'))
        if pct >= 90:
            grade = 'A'
        elif pct >= 80:
            grade = 'B'
        elif pct >= 70:
            grade = 'C'
        elif pct >= 60:
            grade = 'D'
        else:
            grade = 'F'

        result, _ = Result.objects.update_or_create(
            exam_student=assignment,
            defaults={
                'total_marks': total_awarded,
                'maximum_marks': max_marks,
                'percentage': pct,
                'grade': grade,
                'is_finalized': True,
            },
        )

        return Response(ResultSerializer(result).data)
