from django.contrib import admin
from .models import Task

@admin.register(Task) 
class TaskAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'status', 'due_date', 'owner')  
    search_fields = ('title', 'owner__username') 
    list_filter = ('status', 'due_date') 
    ordering = ('-created_at',)  


