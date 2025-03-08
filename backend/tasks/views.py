from rest_framework import viewsets, permissions
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes  
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import User
from .serializers import UserSerializer, TaskSerializer
from .models import Task
from django.contrib.auth import authenticate
from rest_framework.permissions import IsAuthenticated


@api_view(['POST'])
@permission_classes([permissions.AllowAny]) 
def register_user(request):
    """Registers a new user."""
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "User created successfully"}, status=201)
    return Response(serializer.errors, status=400)


@api_view(['POST'])
@permission_classes([permissions.AllowAny])  
def login_user(request):
    """Authenticate user and return JWT token."""
    email = request.data.get('email')
    password = request.data.get('password')

    try:
        user = User.objects.get(email=email) 
    except User.DoesNotExist:
        return Response({"message": "Invalid credentials"}, status=400)

    user = authenticate(username=user.username, password=password)  
    if user is None:
        return Response({"message": "Invalid credentials"}, status=400)

    refresh = RefreshToken.for_user(user)  
    return Response({
        "refresh": str(refresh),
        "access": str(refresh.access_token)
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])  
def user_tasks(request):
    """Fetches tasks assigned to the logged-in user."""
    tasks = Task.objects.filter(owner=request.user)
    serializer = TaskSerializer(tasks, many=True)
    return Response(serializer.data)


@api_view(['PATCH'])
@permission_classes([IsAuthenticated]) 
def update_task_status(request, task_id):
    """Allows users to update only their task status."""
    try:
        task = Task.objects.get(id=task_id, owner=request.user)
    except Task.DoesNotExist:
        return Response({"error": "Task not found or not assigned to you."}, status=404)

    new_status = request.data.get("status")
    if new_status not in ["TODO", "IN_PROGRESS", "DONE"]:
        return Response({"error": "Invalid status value."}, status=400)

    task.status = new_status
    task.save()
    return Response({"message": "Task status updated!", "task": TaskSerializer(task).data})


class TaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated] 
    queryset = Task.objects.none()

    def get_queryset(self):
        """Ensure users can only see their own tasks."""
        return Task.objects.filter(owner=self.request.user)

    def perform_create(self, serializer):
        """Assign owner when a new task is created."""
        serializer.save(owner=self.request.user)
