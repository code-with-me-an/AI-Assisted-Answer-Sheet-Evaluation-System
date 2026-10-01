from django.urls import path

from .views import (
    DashboardView, EvaluationReviewView, EvaluationView, ExamEvaluationView,
    ExamStudentEvaluationsView, ExamStudentFinalizeView, ExaminationDetailView,
    ExaminationListCreateView, StudentDetailView, StudentListView, TeacherProfileView,
)


urlpatterns = [
    path('auth/profile/', TeacherProfileView.as_view(), name='teacher-profile'),
    path('dashboard/', DashboardView.as_view(), name='dashboard'),
    path('exams/', ExaminationListCreateView.as_view(), name='exam-list'),
    path('exams/<int:examination_id>/', ExaminationDetailView.as_view(), name='exam-detail'),
    path('exams/<int:examination_id>/evaluate/', ExamEvaluationView.as_view(), name='exam-evaluate'),
    path('exams/<int:examination_id>/students/<int:student_id>/evaluations/', ExamStudentEvaluationsView.as_view(), name='exam-student-evaluations'),
    path('exams/<int:examination_id>/students/<int:student_id>/finalize/', ExamStudentFinalizeView.as_view(), name='exam-student-finalize'),
    path('students/', StudentListView.as_view(), name='student-list'),
    path('students/<int:student_id>/', StudentDetailView.as_view(), name='student-detail'),
    path('evaluations/<int:evaluation_id>/', EvaluationReviewView.as_view(), name='evaluation-review'),
    path('evaluate/', EvaluationView.as_view(), name='evaluate'),
]
