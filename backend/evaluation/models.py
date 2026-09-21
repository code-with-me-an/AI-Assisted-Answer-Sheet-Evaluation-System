from django.db import models


class Teacher(models.Model):
    teacher_id = models.BigAutoField(primary_key=True)
    name = models.CharField(max_length=100)
    email = models.EmailField(max_length=150, unique=True)
    password = models.CharField(max_length=255)
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

    def __str__(self):
        return f"{self.examination.exam_name} - Q{self.question_number}"


class ReferenceAnswer(models.Model):
    reference_id = models.BigAutoField(primary_key=True)
    question = models.ForeignKey(
        Question,
        on_delete=models.CASCADE,
        related_name="reference_answers",
    )
    reference_number = models.IntegerField()
    answer_text = models.TextField()
    marking_scheme = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Reference {self.reference_number} - Q{self.question.question_number}"


class AnswerSheet(models.Model):
    answer_sheet_id = models.BigAutoField(primary_key=True)
    examination = models.ForeignKey(
        Examination,
        on_delete=models.CASCADE,
        related_name="answer_sheets",
    )
    student_name = models.CharField(max_length=100)
    roll_number = models.CharField(max_length=50)
    file_path = models.CharField(max_length=500, blank=True, null=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.student_name} - {self.examination.exam_name}"


class ExtractedAnswer(models.Model):
    extracted_answer_id = models.BigAutoField(primary_key=True)
    answer_sheet = models.ForeignKey(
        AnswerSheet,
        on_delete=models.CASCADE,
        related_name="extracted_answers",
    )
    question = models.ForeignKey(
        Question,
        on_delete=models.CASCADE,
        related_name="extracted_answers",
    )
    extracted_text = models.TextField()
    confidence_score = models.DecimalField(
        max_digits=6,
        decimal_places=4,
        blank=True,
        null=True,
    )
    extracted_at = models.DateTimeField(auto_now_add=True)


class Evaluation(models.Model):
    evaluation_id = models.BigAutoField(primary_key=True)
    question = models.ForeignKey(
        Question,
        on_delete=models.CASCADE,
        related_name="evaluations",
    )
    answer_sheet = models.ForeignKey(
        AnswerSheet,
        on_delete=models.CASCADE,
        related_name="evaluations",
    )
    student_answer = models.TextField()

    semantic_similarity = models.DecimalField(
        max_digits=6,
        decimal_places=4,
        blank=True,
        null=True,
    )
    concept_score = models.DecimalField(
        max_digits=6,
        decimal_places=4,
        blank=True,
        null=True,
    )
    nli_score = models.DecimalField(
        max_digits=6,
        decimal_places=4,
        blank=True,
        null=True,
    )
    completeness_score = models.DecimalField(
        max_digits=6,
        decimal_places=4,
        blank=True,
        null=True,
    )
    correctness_score = models.DecimalField(
        max_digits=6,
        decimal_places=4,
        blank=True,
        null=True,
    )

    awarded_marks = models.DecimalField(max_digits=5, decimal_places=2)
    feedback = models.TextField(blank=True, null=True)
    analysis = models.JSONField(blank=True, null=True)
    evaluated_at = models.DateTimeField(auto_now_add=True)


class Result(models.Model):
    result_id = models.BigAutoField(primary_key=True)
    answer_sheet = models.OneToOneField(
        AnswerSheet,
        on_delete=models.CASCADE,
        related_name="result",
    )
    total_marks = models.DecimalField(max_digits=6, decimal_places=2)
    maximum_marks = models.DecimalField(max_digits=6, decimal_places=2)
    percentage = models.DecimalField(max_digits=5, decimal_places=2)
    grade = models.CharField(max_length=10, blank=True, null=True)
    generated_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Result - {self.answer_sheet.student_name}"
