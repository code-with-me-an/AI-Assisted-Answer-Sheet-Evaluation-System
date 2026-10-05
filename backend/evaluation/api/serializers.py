from decimal import Decimal
from rest_framework import serializers

from ..models import (
    Evaluation, Examination, Question, ReferenceAnswer,
    ReferenceFact, Result, Student, StudentAnswer,
)


class EvaluationRequestSerializer(serializers.Serializer):
    question = serializers.CharField(required=False, allow_blank=True, default='')
    reference_answers = serializers.ListField(child=serializers.CharField(), required=False, default=list)
    reference_facts = serializers.ListField(child=serializers.CharField(), required=False, default=list)
    student_answer = serializers.CharField(allow_blank=True, default='')
    max_marks = serializers.DecimalField(max_digits=5, decimal_places=2, min_value=Decimal('0.00'), default=Decimal('10.00'))


class SignupSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, min_length=6)
    name = serializers.CharField(max_length=100, required=False, allow_blank=True, default='')


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)


class ChangePasswordSerializer(serializers.Serializer):
    password = serializers.CharField(write_only=True, min_length=6)


class TeacherProfileSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=100, required=False, allow_blank=False)


class StudentInputSerializer(serializers.Serializer):
    full_name = serializers.CharField(max_length=100)
    roll_number = serializers.CharField(max_length=50)
    email = serializers.EmailField(required=False, allow_blank=True)


class ReferenceFactSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReferenceFact
        fields = ['fact_id', 'fact_text', 'order_index', 'is_approved', 'created_at', 'updated_at']


class ReferenceAnswerSerializer(serializers.ModelSerializer):
    facts = ReferenceFactSerializer(many=True, read_only=True)

    class Meta:
        model = ReferenceAnswer
        fields = [
            'reference_id', 'reference_number', 'answer_text', 'marking_scheme',
            'is_approved', 'facts', 'created_at',
        ]


class GenerateFactsRequestSerializer(serializers.Serializer):
    reference_answer = serializers.CharField(allow_blank=False)


class FactItemInputSerializer(serializers.Serializer):
    fact_id = serializers.IntegerField(required=False, allow_null=True)
    fact_text = serializers.CharField(allow_blank=False)
    order_index = serializers.IntegerField(required=False, default=0)
    is_approved = serializers.BooleanField(required=False, default=True)


class QuestionSerializer(serializers.Serializer):
    question_id = serializers.IntegerField(read_only=True)
    question_number = serializers.IntegerField(min_value=1)
    question_text = serializers.CharField()
    max_marks = serializers.DecimalField(max_digits=5, decimal_places=2, min_value=Decimal('0.01'))
    question_type = serializers.ChoiceField(choices=['descriptive', 'mcq', 'short', 'truefalse'], default='descriptive')
    reference_answer = serializers.CharField(required=False, allow_blank=True)
    reference_facts = serializers.ListField(child=serializers.CharField(), required=False, default=list)
    is_approved = serializers.BooleanField(required=False, default=True)
    key_concepts = serializers.ListField(child=serializers.CharField(max_length=255), required=False, default=list)


class ExaminationWriteSerializer(serializers.Serializer):
    draft_id = serializers.IntegerField(required=False, allow_null=True)
    is_draft = serializers.BooleanField(required=False, default=False)
    exam_name = serializers.CharField(max_length=150)
    subject = serializers.CharField(max_length=100)
    exam_date = serializers.DateField()
    questions = QuestionSerializer(many=True, required=False, default=list)
    students = StudentInputSerializer(many=True, required=False, default=list)

    def validate(self, attrs):
        is_draft = attrs.get('is_draft', False)
        questions = attrs.get('questions', [])
        students = attrs.get('students', [])

        if not is_draft:
            if not questions:
                raise serializers.ValidationError({'questions': 'At least one question is required to create an exam.'})
            numbers = [question['question_number'] for question in questions]
            if len(numbers) != len(set(numbers)):
                raise serializers.ValidationError({'questions': 'Question numbers must be unique.'})
            for q in questions:
                if not q.get('question_text', '').strip():
                    raise serializers.ValidationError({'questions': f"Question {q.get('question_number')} text cannot be empty."})
                if not q.get('reference_answer', '').strip():
                    raise serializers.ValidationError({'questions': f"Question {q.get('question_number')} requires a reference answer."})

            if students:
                rolls = [student['roll_number'].lower().strip() for student in students if student.get('roll_number')]
                if len(rolls) != len(set(rolls)):
                    raise serializers.ValidationError({'students': 'Student roll numbers must be unique.'})
        return attrs


class ExaminationUpdateSerializer(serializers.Serializer):
    exam_name = serializers.CharField(max_length=150, required=False)
    subject = serializers.CharField(max_length=100, required=False)
    exam_date = serializers.DateField(required=False)
    is_draft = serializers.BooleanField(required=False)


class ExaminationListSerializer(serializers.ModelSerializer):
    question_count = serializers.IntegerField(read_only=True)
    student_count = serializers.IntegerField(read_only=True)
    total_marks = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    evaluated_count = serializers.IntegerField(read_only=True, default=0)
    pending_count = serializers.IntegerField(read_only=True, default=0)
    average_score = serializers.FloatField(read_only=True, default=0.0)
    highest_score = serializers.FloatField(read_only=True, default=0.0)
    lowest_score = serializers.FloatField(read_only=True, default=0.0)
    median_score = serializers.FloatField(read_only=True, default=0.0)
    pass_rate = serializers.FloatField(read_only=True, default=0.0)
    status = serializers.CharField(read_only=True, default='pending')

    class Meta:
        model = Examination
        fields = [
            'examination_id', 'exam_name', 'subject', 'exam_date', 'is_draft', 'created_at',
            'question_count', 'student_count', 'total_marks',
            'evaluated_count', 'pending_count', 'average_score', 'highest_score',
            'lowest_score', 'median_score', 'pass_rate', 'status',
        ]


class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = ['student_id', 'full_name', 'roll_number', 'email', 'created_at']


class EvaluationCreateSerializer(serializers.Serializer):
    question_id = serializers.IntegerField()
    student_id = serializers.IntegerField()
    student_answer = serializers.CharField(allow_blank=True)


class EvaluationSerializer(serializers.ModelSerializer):
    question_id = serializers.IntegerField(source='question.question_id', read_only=True)
    question_number = serializers.IntegerField(source='question.question_number', read_only=True)
    question_text = serializers.CharField(source='question.question_text', read_only=True)
    max_marks = serializers.DecimalField(source='question.max_marks', max_digits=5, decimal_places=2, read_only=True)
    student_answer = serializers.CharField(source='student_answer.answer_text', read_only=True)

    class Meta:
        model = Evaluation
        fields = [
            'evaluation_id', 'question_id', 'question_number', 'question_text', 'max_marks',
            'student_answer', 'semantic_similarity',
            'awarded_marks', 'status', 'feedback', 'analysis', 'is_reviewed', 'teacher_review_reason', 'evaluated_at',
        ]


class EvaluationReviewSerializer(serializers.Serializer):
    awarded_marks = serializers.DecimalField(max_digits=5, decimal_places=2, min_value=Decimal('0.00'))
    feedback = serializers.CharField(required=False, allow_blank=True)
    reason = serializers.CharField(required=False, allow_blank=True)


class ResultSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='exam_student.student.full_name', read_only=True)
    roll_number = serializers.CharField(source='exam_student.student.roll_number', read_only=True)

    class Meta:
        model = Result
        fields = [
            'result_id', 'student_name', 'roll_number', 'total_marks',
            'maximum_marks', 'percentage', 'grade', 'is_finalized', 'generated_at',
        ]
