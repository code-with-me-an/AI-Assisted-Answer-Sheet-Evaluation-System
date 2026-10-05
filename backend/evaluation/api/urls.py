from django.urls import path

from .views import (
    ChangePasswordView, DashboardView, EvaluationReviewView, EvaluationView,
    ExamEvaluationView, ExamStudentEvaluationsView, ExamStudentFinalizeView,
    ExaminationDetailView, ExaminationListCreateView, GenerateCandidateFactsView,
    LoginView, LogoutView, ReferenceAnswerApproveFactsView, ReferenceAnswerFactsView,
    ReferenceFactDetailView, SignupView, StudentDetailView, StudentListView,
    TeacherProfileView,
)


urlpatterns = [
    path('auth/signup/', SignupView.as_view(), name='auth-signup'),
    path('auth/login/', LoginView.as_view(), name='auth-login'),
    path('auth/logout/', LogoutView.as_view(), name='auth-logout'),
    path('auth/change-password/', ChangePasswordView.as_view(), name='auth-change-password'),
    path('auth/profile/', TeacherProfileView.as_view(), name='teacher-profile'),
    path('dashboard/', DashboardView.as_view(), name='dashboard'),
    path('exams/', ExaminationListCreateView.as_view(), name='exam-list'),
    path('exams/<int:examination_id>/', ExaminationDetailView.as_view(), name='exam-detail'),
    path('exams/<int:examination_id>/evaluate/', ExamEvaluationView.as_view(), name='exam-evaluate'),
    path('exams/<int:examination_id>/students/<int:student_id>/evaluations/', ExamStudentEvaluationsView.as_view(), name='exam-student-evaluations'),
    path('exams/<int:examination_id>/students/<int:student_id>/finalize/', ExamStudentFinalizeView.as_view(), name='exam-student-finalize'),
    path('reference-answers/generate-facts/', GenerateCandidateFactsView.as_view(), name='generate-facts'),
    path('reference-answers/<int:reference_id>/facts/', ReferenceAnswerFactsView.as_view(), name='reference-facts'),
    path('reference-answers/<int:reference_id>/approve-facts/', ReferenceAnswerApproveFactsView.as_view(), name='reference-approve-facts'),
    path('reference-facts/<int:fact_id>/', ReferenceFactDetailView.as_view(), name='reference-fact-detail'),
    path('students/', StudentListView.as_view(), name='student-list'),
    path('students/<int:student_id>/', StudentDetailView.as_view(), name='student-detail'),
    path('evaluations/<int:evaluation_id>/', EvaluationReviewView.as_view(), name='evaluation-review'),
    path('evaluate/', EvaluationView.as_view(), name='evaluate'),
]
