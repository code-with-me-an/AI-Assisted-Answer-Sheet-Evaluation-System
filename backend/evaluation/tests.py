from datetime import date, datetime, timedelta, timezone
from decimal import Decimal
from uuid import uuid4

import jwt
from django.test import TestCase, override_settings
from rest_framework.test import APIClient

from .models import (
    Evaluation, Examination, ExamStudent, Question,
    ReferenceAnswer, Result, Student, StudentAnswer, Teacher,
)
from .services.asag_evaluator import evaluate_answer


@override_settings(
    SUPABASE_JWT_ISSUER='https://example.supabase.co/auth/v1',
    SUPABASE_JWT_AUDIENCE='authenticated',
    SUPABASE_JWT_SECRET='test-only-jwt-secret-with-at-least-32-bytes',
)
class AutoGradePhase1BackendTests(TestCase):
    def setUp(self):
        self.client_a = APIClient()
        self.client_b = APIClient()
        self.user_a_id = uuid4()
        self.user_b_id = uuid4()

        self.token_a = self._make_token(self.user_a_id, 'teacher_a@example.com', 'Prof. Alice')
        self.token_b = self._make_token(self.user_b_id, 'teacher_b@example.com', 'Prof. Bob')

        self.client_a.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token_a}')
        self.client_b.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token_b}')

    def _make_token(self, user_id, email, name):
        claims = {
            'sub': str(user_id),
            'email': email,
            'user_metadata': {'name': name},
            'aud': 'authenticated',
            'iss': 'https://example.supabase.co/auth/v1',
            'exp': datetime.now(timezone.utc) + timedelta(minutes=15),
        }
        return jwt.encode(claims, 'test-only-jwt-secret-with-at-least-32-bytes', algorithm='HS256')

    def test_asag_evaluator_service_direct(self):
        ref = "Polymorphism allows objects of different classes to respond to the same interface."
        stu_good = "Polymorphism is when objects of different classes share the same common interface."
        stu_poor = "It is a programming method."

        eval_good = evaluate_answer(reference_answer=ref, student_answer=stu_good, max_marks=10.0)
        self.assertGreaterEqual(eval_good['awarded_marks'], 7.0)
        self.assertGreaterEqual(eval_good['percentage'], 70.0)
        self.assertIn('fact_results', eval_good)
        self.assertIn('nli', eval_good)
        self.assertGreaterEqual(eval_good['supported'], 1)

        eval_poor = evaluate_answer(reference_answer=ref, student_answer=stu_poor, max_marks=10.0)
        self.assertLess(eval_poor['awarded_marks'], 6.0)

    def test_teacher_profile_sync(self):
        res = self.client_a.get('/api/auth/profile/')
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.data['name'], 'Prof. Alice')
        self.assertEqual(res.data['email'], 'teacher_a@example.com')

        # Update profile name
        update_res = self.client_a.patch('/api/auth/profile/', {'name': 'Professor Alice Smith'})
        self.assertEqual(update_res.status_code, 200)
        self.assertEqual(update_res.data['name'], 'Professor Alice Smith')

    def test_create_exam_with_questions_and_students(self):
        payload = {
            'exam_name': 'Midterm Biology',
            'subject': 'Biology',
            'exam_date': '2026-10-24',
            'questions': [
                {
                    'question_number': 1,
                    'question_text': 'What is photosynthesis?',
                    'max_marks': '10.00',
                    'question_type': 'descriptive',
                    'reference_answer': 'Photosynthesis is the process by which plants convert light energy into chemical energy using chlorophyll.',
                    'key_concepts': ['chlorophyll', 'light energy', 'chemical energy'],
                },
                {
                    'question_number': 2,
                    'question_text': 'What is mitosis?',
                    'max_marks': '5.00',
                    'question_type': 'descriptive',
                    'reference_answer': 'Mitosis is a process of cell division producing two identical daughter cells.',
                    'key_concepts': ['cell division', 'daughter cells'],
                },
            ],
            'students': [
                {
                    'full_name': 'John Doe',
                    'roll_number': 'STU001',
                    'email': 'john@example.com',
                },
                {
                    'full_name': 'Jane Smith',
                    'roll_number': 'STU002',
                    'email': 'jane@example.com',
                },
            ],
        }

        res = self.client_a.post('/api/exams/', payload, format='json')
        self.assertEqual(res.status_code, 201)
        exam_id = res.data['examination_id']
        self.assertEqual(res.data['exam_name'], 'Midterm Biology')
        self.assertEqual(len(res.data['questions']), 2)
        self.assertEqual(len(res.data['students']), 2)

        # Verify DB records
        exam = Examination.objects.get(examination_id=exam_id)
        self.assertEqual(exam.teacher.supabase_user_id, self.user_a_id)
        self.assertEqual(exam.questions.count(), 2)
        self.assertEqual(exam.assignments.count(), 2)

        q1 = exam.questions.get(question_number=1)
        self.assertEqual(q1.reference_answers.first().answer_text, payload['questions'][0]['reference_answer'])

        # Verify Past Exams list
        list_res = self.client_a.get('/api/exams/')
        self.assertEqual(list_res.status_code, 200)
        self.assertEqual(len(list_res.data), 1)
        self.assertEqual(list_res.data[0]['examination_id'], exam_id)

    def test_evaluation_review_and_finalize_workflow(self):
        # 1. Create exam
        create_res = self.client_a.post('/api/exams/', {
            'exam_name': 'Computer Science 101',
            'subject': 'CS',
            'exam_date': '2026-11-01',
            'questions': [
                {
                    'question_number': 1,
                    'question_text': 'Explain polymorphism in OOP.',
                    'max_marks': '10.00',
                    'question_type': 'descriptive',
                    'reference_answer': 'Polymorphism allows objects of different classes to respond to the same interface.',
                    'key_concepts': ['objects', 'interface', 'classes'],
                }
            ],
            'students': [
                {
                    'full_name': 'Alan Turing',
                    'roll_number': 'CS001',
                    'email': 'alan@example.com',
                }
            ],
        }, format='json')
        self.assertEqual(create_res.status_code, 201)
        exam_id = create_res.data['examination_id']
        question_id = create_res.data['questions'][0]['question_id']
        student_id = create_res.data['students'][0]['student_id']

        # 2. Evaluate plain text student answer
        eval_payload = {
            'question_id': question_id,
            'student_id': student_id,
            'student_answer': 'Polymorphism in OOP is when classes share a common interface for objects.',
        }
        eval_res = self.client_a.post(f'/api/exams/{exam_id}/evaluate/', eval_payload, format='json')
        self.assertEqual(eval_res.status_code, 200)
        self.assertGreaterEqual(eval_res.data['aiScore'], 8.0)
        self.assertIn('analysis', eval_res.data)
        evaluation_id = eval_res.data['evaluation_id']

        # Verify StudentAnswer was persisted
        student_ans = StudentAnswer.objects.filter(
            exam_student__examination_id=exam_id,
            exam_student__student_id=student_id,
            question_id=question_id,
        ).first()
        self.assertIsNotNone(student_ans)
        self.assertEqual(student_ans.answer_text, eval_payload['student_answer'])

        # 3. Teacher reviews evaluation and adjusts marks/feedback
        review_payload = {
            'awarded_marks': '9.50',
            'feedback': 'Good answer with strong coverage.',
            'reason': 'Slight phrasing difference.',
        }
        review_res = self.client_a.patch(f'/api/evaluations/{evaluation_id}/', review_payload, format='json')
        self.assertEqual(review_res.status_code, 200)
        self.assertEqual(review_res.data['finalScore'], 9.5)
        self.assertEqual(review_res.data['reason'], 'Slight phrasing difference.')

        # 4. Finalize result
        finalize_res = self.client_a.post(f'/api/exams/{exam_id}/students/{student_id}/finalize/')
        self.assertEqual(finalize_res.status_code, 200)
        self.assertEqual(Decimal(str(finalize_res.data['total_marks'])), Decimal('9.50'))
        self.assertEqual(Decimal(str(finalize_res.data['percentage'])), Decimal('95.00'))
        self.assertEqual(finalize_res.data['grade'], 'A')

        # 5. Verify exam detail reflects reviewed/finalized state
        detail_res = self.client_a.get(f'/api/exams/{exam_id}/')
        self.assertEqual(detail_res.status_code, 200)
        self.assertEqual(detail_res.data['evaluated_count'], 1)
        self.assertEqual(detail_res.data['students'][0]['status'], 'reviewed')
        self.assertEqual(detail_res.data['students'][0]['score'], 9.5)

    def test_authorization_teacher_scoping(self):
        # Teacher A creates exam
        create_res = self.client_a.post('/api/exams/', {
            'exam_name': 'Private Exam A',
            'subject': 'Math',
            'exam_date': '2026-10-15',
            'questions': [
                {
                    'question_number': 1,
                    'question_text': 'What is 2+2?',
                    'max_marks': '5.00',
                    'question_type': 'descriptive',
                    'reference_answer': '4',
                    'key_concepts': ['4'],
                }
            ],
            'students': [
                {
                    'full_name': 'Alice Student',
                    'roll_number': 'M001',
                    'email': 'm001@example.com',
                }
            ],
        }, format='json')
        exam_a_id = create_res.data['examination_id']

        # Teacher B must not see Teacher A's exam in list
        list_b = self.client_b.get('/api/exams/')
        self.assertEqual(list_b.status_code, 200)
        self.assertEqual(len(list_b.data), 0)

        # Teacher B cannot get Teacher A's exam detail
        detail_b = self.client_b.get(f'/api/exams/{exam_a_id}/')
        self.assertEqual(detail_b.status_code, 404)

        # Teacher B cannot evaluate Teacher A's exam
        eval_b = self.client_b.post(f'/api/exams/{exam_a_id}/evaluate/', {
            'question_id': create_res.data['questions'][0]['question_id'],
            'student_id': create_res.data['students'][0]['student_id'],
            'student_answer': '4',
        }, format='json')
        self.assertEqual(eval_b.status_code, 404)

    def test_draft_persistence_and_update(self):
        # 1. Save partial exam as draft
        draft_payload = {
            'is_draft': True,
            'exam_name': 'Draft Midterm',
            'subject': 'Physics',
            'exam_date': '2026-11-20',
            'questions': [
                {
                    'question_number': 1,
                    'question_text': 'Define inertia.',
                    'max_marks': '5.00',
                    'question_type': 'descriptive',
                    'reference_answer': 'Inertia is the resistance of any physical object to any change in its velocity.',
                }
            ],
            'students': [],
        }
        res = self.client_a.post('/api/exams/', draft_payload, format='json')
        self.assertEqual(res.status_code, 201)
        draft_id = res.data['examination_id']
        self.assertTrue(res.data['is_draft'])

        # 2. Update existing draft and convert to published exam with assigned student
        publish_payload = {
            'draft_id': draft_id,
            'is_draft': False,
            'exam_name': 'Final Midterm Physics',
            'subject': 'Physics',
            'exam_date': '2026-11-20',
            'questions': [
                {
                    'question_number': 1,
                    'question_text': 'Define inertia.',
                    'max_marks': '5.00',
                    'question_type': 'descriptive',
                    'reference_answer': 'Inertia is the resistance of any physical object to any change in its velocity.',
                }
            ],
            'students': [
                {
                    'full_name': 'Isaac Newton',
                    'roll_number': 'PHY001',
                    'email': 'newton@example.com',
                }
            ],
        }
        update_res = self.client_a.post('/api/exams/', publish_payload, format='json')
        self.assertEqual(update_res.status_code, 201)
        self.assertEqual(update_res.data['examination_id'], draft_id)
        self.assertEqual(update_res.data['exam_name'], 'Final Midterm Physics')
        self.assertFalse(update_res.data['is_draft'])
        self.assertEqual(len(update_res.data['students']), 1)

