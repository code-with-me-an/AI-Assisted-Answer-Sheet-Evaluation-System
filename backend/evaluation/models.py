from django.conf import settings
from django.db import models


class Teacher(models.Model):
    teacher_id = models.BigAutoField(primary_key=True)
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="teacher",
        null=True,
        blank=True,
    )
    name = models.CharField(max_length=100)
    email = models.EmailField(max_length=150, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class Examination(models.Model):
    examination_id = models.BigAutoField(primary_key=True)
    teacher = models.ForeignKey(
        Teacher,
        on_delete=models.CASCADE,
        related_name="examinations",
    )
    exam_name = models.CharField(max_length=150)
    subject = models.CharField(max_length=100)
    exam_date = models.DateField()
    is_draft = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.exam_name


class Question(models.Model):
    question_id = models.BigAutoField(primary_key=True)
    examination = models.ForeignKey(
        Examination,
        on_delete=models.CASCADE,
        related_name="questions",
    )
    question_number = models.IntegerField()
    question_text = models.TextField()
    max_marks = models.DecimalField(max_digits=5, decimal_places=2)
    question_type = models.CharField(max_length=30, default='descriptive')

    def __str__(self):
        return f"{self.examination.exam_name} - Q{self.question_number}"


class ReferenceAnswer(models.Model):
    reference_id = models.BigAutoField(primary_key=True)
    question = models.ForeignKey(
        Question,
        on_delete=models.CASCADE,
        related_name="reference_answers",
    )
    reference_number = models.IntegerField(default=1)
    answer_text = models.TextField()
    marking_scheme = models.TextField(blank=True, null=True)
    is_approved = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Reference {self.reference_number} - Q{self.question.question_number}"


class ReferenceFact(models.Model):
    fact_id = models.BigAutoField(primary_key=True)
    reference_answer = models.ForeignKey(
        ReferenceAnswer,
        on_delete=models.CASCADE,
        related_name="facts",
    )
    fact_text = models.TextField()
    order_index = models.IntegerField(default=0)
    is_approved = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['order_index', 'fact_id']

    def __str__(self):
        return f"Fact #{self.fact_id} (Ref {self.reference_answer_id}): {self.fact_text[:40]}"


class Student(models.Model):
    student_id = models.BigAutoField(primary_key=True)
    teacher = models.ForeignKey(
        Teacher,
        on_delete=models.CASCADE,
        related_name='students',
    )
    full_name = models.CharField(max_length=100)
    roll_number = models.CharField(max_length=50)
    email = models.EmailField(max_length=150, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['teacher', 'roll_number'], name='unique_teacher_roll_number'),
        ]

    def __str__(self):
        return f"{self.full_name} ({self.roll_number})"


class ExamStudent(models.Model):
    examination = models.ForeignKey(
        Examination,
        on_delete=models.CASCADE,
        related_name='assignments',
    )
    student = models.ForeignKey(
        Student,
        on_delete=models.CASCADE,
        related_name='exam_assignments',
    )
    assigned_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['examination', 'student'], name='unique_exam_student_assignment'),
        ]

    def __str__(self):
        return f"{self.student.full_name} - {self.examination.exam_name}"


class StudentAnswer(models.Model):
    student_answer_id = models.BigAutoField(primary_key=True)
    exam_student = models.ForeignKey(
        ExamStudent,
        on_delete=models.CASCADE,
        related_name="student_answers",
    )
    question = models.ForeignKey(
        Question,
        on_delete=models.CASCADE,
        related_name="student_answers",
    )
    answer_text = models.TextField()
    submitted_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['exam_student', 'question'],
                name='unique_exam_student_question_answer',
            ),
        ]

    def __str__(self):
        return f"{self.exam_student.student.full_name} - Q{self.question.question_number}"


class Evaluation(models.Model):
    evaluation_id = models.BigAutoField(primary_key=True)
    student_answer = models.OneToOneField(
        StudentAnswer,
        on_delete=models.CASCADE,
        related_name="evaluation",
        null=True,
        blank=True,
    )
    question = models.ForeignKey(
        Question,
        on_delete=models.CASCADE,
        related_name="evaluations",
    )
    semantic_similarity = models.DecimalField(
        max_digits=6,
        decimal_places=4,
        blank=True,
        null=True,
    )
    awarded_marks = models.DecimalField(max_digits=5, decimal_places=2)
    feedback = models.TextField(blank=True, null=True)
    analysis = models.JSONField(blank=True, null=True)
    status = models.CharField(max_length=50, default='supported')
    is_reviewed = models.BooleanField(default=False)
    teacher_review_reason = models.TextField(blank=True, null=True)
    evaluated_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Evaluation #{self.evaluation_id} - Q{self.question.question_number}"


class Result(models.Model):
    result_id = models.BigAutoField(primary_key=True)
    exam_student = models.OneToOneField(
        ExamStudent,
        on_delete=models.CASCADE,
        related_name="result",
    )
    total_marks = models.DecimalField(max_digits=6, decimal_places=2)
    maximum_marks = models.DecimalField(max_digits=6, decimal_places=2)
    percentage = models.DecimalField(max_digits=5, decimal_places=2)
    grade = models.CharField(max_length=10, blank=True, null=True)
    is_finalized = models.BooleanField(default=False)
    generated_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Result - {self.exam_student.student.full_name} ({self.exam_student.examination.exam_name})"
