from rest_framework import serializers


class EvaluationRequestSerializer(serializers.Serializer):
    question = serializers.CharField()
    reference_answers = serializers.ListField(
        child=serializers.CharField(),
        min_length=1,
    )
    student_answer = serializers.CharField()
    max_marks = serializers.DecimalField(
        max_digits=5,
        decimal_places=2,
        min_value=0,
    )
