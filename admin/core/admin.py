from django.contrib import admin
from .models import User, StudentProfile, RecruiterProfile, Job, Application

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'email', 'role', 'createdAt')
    list_filter = ('role',)
    search_fields = ('name', 'email')

@admin.register(StudentProfile)
class StudentProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'skills')

@admin.register(RecruiterProfile)
class RecruiterProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'companyName')

@admin.register(Job)
class JobAdmin(admin.ModelAdmin):
    list_display = ('title', 'recruiter', 'location', 'jobType', 'createdAt')
    search_fields = ('title', 'description')
    list_filter = ('jobType',)

@admin.register(Application)
class ApplicationAdmin(admin.ModelAdmin):
    list_display = ('student', 'job', 'atsScore', 'status', 'createdAt')
    list_filter = ('status',)
    readonly_fields = ('atsScore', 'missingKeywords')
