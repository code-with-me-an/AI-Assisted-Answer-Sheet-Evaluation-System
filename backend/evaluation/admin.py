from django.contrib import admin
from .models import (
    Teacher,
    Examination,
    Question,
    ReferenceAnswer,
    ReferenceFact,
    Student,
    ExamStudent,
    StudentAnswer,
    Evaluation,
    Result,
)


@admin.register(Teacher)
class TeacherAdmin(admin.ModelAdmin):
    list_display = ('teacher_id', 'name', 'email', 'user', 'created_at')
    search_fields = ('name', 'email')


@admin.register(Examination)
class ExaminationAdmin(admin.ModelAdmin):
    list_display = ('examination_id', 'exam_name', 'subject', 'exam_date', 'teacher', 'is_draft', 'created_at')
    list_filter = ('subject', 'is_draft', 'exam_date')
    search_fields = ('exam_name', 'subject')


@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = ('question_id', 'examination', 'question_number', 'max_marks', 'question_type')
    list_filter = ('question_type',)
    search_fields = ('question_text',)


@admin.register(ReferenceAnswer)
class ReferenceAnswerAdmin(admin.ModelAdmin):
    list_display = ('reference_id', 'question', 'reference_number', 'is_approved', 'created_at')
    list_filter = ('is_approved',)


@admin.register(ReferenceFact)
class ReferenceFactAdmin(admin.ModelAdmin):
    list_display = ('fact_id', 'reference_answer', 'order_index', 'is_approved', 'created_at')
    list_filter = ('is_approved',)


@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = ('student_id', 'teacher', 'full_name', 'roll_number', 'email', 'created_at')
    search_fields = ('full_name', 'roll_number', 'email')


@admin.register(ExamStudent)
class ExamStudentAdmin(admin.ModelAdmin):
    list_display = ('id', 'examination', 'student', 'assigned_at')


@admin.register(StudentAnswer)
class StudentAnswerAdmin(admin.ModelAdmin):
    list_display = ('student_answer_id', 'exam_student', 'question', 'submitted_at')


@admin.register(Evaluation)
class EvaluationAdmin(admin.ModelAdmin):
    list_display = ('evaluation_id', 'question', 'awarded_marks', 'status', 'is_reviewed', 'evaluated_at')
    list_filter = ('status', 'is_reviewed')


@admin.register(Result)
class ResultAdmin(admin.ModelAdmin):
    list_display = ('result_id', 'exam_student', 'total_marks', 'maximum_marks', 'percentage', 'grade', 'is_finalized', 'generated_at')
    list_filter = ('grade', 'is_finalized')
