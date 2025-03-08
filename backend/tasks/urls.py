from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'tasks', views.TaskViewSet, basename='task')

urlpatterns = [
    path('register/', views.register_user),
    path('login/', views.login_user),
    path('tasks/', views.user_tasks, name="user_tasks"),
    path('task_status/<int:task_id>/', views.update_task_status, name="update_task_status"),
    path('', include(router.urls)),
]


