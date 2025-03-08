from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class Task(models.Model):
    STATUS_CHOICES = [
        ('TODO','To Do'),
        ('IN_PROGRESS','In Progress'),
        ('DONE','Done')
    ]

    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    status = models.CharField(
        max_length = 20, choices = STATUS_CHOICES, default = 'TODO'
    )
    due_date = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    owner = models.ForeignKey(
        User,
        on_delete = models.CASCADE,
        related_name = 'tasks'  
    )

    def __str__(self):
        return f"{self.title} - {self.owner.username}"