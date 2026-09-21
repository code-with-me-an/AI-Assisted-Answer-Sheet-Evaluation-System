from django.urls import path

from .views import EvaluationView


urlpatterns = [
    path("evaluate/", EvaluationView.as_view(), name="evaluate"),
]
