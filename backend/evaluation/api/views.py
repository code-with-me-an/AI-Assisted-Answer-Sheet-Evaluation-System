from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView

from .serializers import EvaluationRequestSerializer


class EvaluationView(APIView):

    def post(self, request):
        serializer = EvaluationRequestSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST,
            )

        data = serializer.validated_data

        return Response(
            {
                "message": "Evaluation request received successfully.",
                "data": data,
            },
            status=status.HTTP_200_OK,
        )
