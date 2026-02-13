from django.db import models

class User(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    email = models.CharField(max_length=255, unique=True)
    password_hash = models.CharField(max_length=255)
    phone = models.CharField(max_length=255, null=True, blank=True)
    role = models.CharField(max_length=50, choices=[('student', 'Student'), ('recruiter', 'Recruiter'), ('admin', 'Admin')], default='student')
    createdAt = models.DateTimeField(auto_now_add=True)
    updatedAt = models.DateTimeField(auto_now=True)

    class Meta:
        managed = False
        db_table = 'users'

    def __str__(self):
        return self.email


class StudentProfile(models.Model):
    id = models.AutoField(primary_key=True)
    user = models.OneToOneField(User, on_delete=models.CASCADE, db_column='userId', related_name='student_profile')
    skills = models.TextField(null=True, blank=True)
    education = models.TextField(null=True, blank=True)
    experience = models.TextField(null=True, blank=True)
    resumeUrl = models.CharField(max_length=255, null=True, blank=True)

    class Meta:
        managed = False
        db_table = 'student_profiles'

    def __str__(self):
        return f"Profile: {self.user.name}"


class RecruiterProfile(models.Model):
    id = models.AutoField(primary_key=True)
    user = models.OneToOneField(User, on_delete=models.CASCADE, db_column='userId', related_name='recruiter_profile')
    companyName = models.CharField(max_length=255)
    companyWebsite = models.CharField(max_length=255, null=True, blank=True)
    companyDescription = models.TextField(null=True, blank=True)

    class Meta:
        managed = False
        db_table = 'recruiter_profiles'

    def __str__(self):
        return self.companyName


class Job(models.Model):
    id = models.AutoField(primary_key=True)
    recruiter = models.ForeignKey(User, on_delete=models.CASCADE, db_column='recruiterId', related_name='jobs')
    title = models.CharField(max_length=255)
    description = models.TextField()
    location = models.CharField(max_length=255, null=True, blank=True)
    salary = models.CharField(max_length=255, null=True, blank=True)
    jobType = models.CharField(max_length=50, null=True, blank=True)
    skillsRequired = models.TextField(null=True, blank=True)
    createdAt = models.DateTimeField(auto_now_add=True)
    updatedAt = models.DateTimeField(auto_now=True)

    class Meta:
        managed = False
        db_table = 'jobs'

    def __str__(self):
        return self.title


class Application(models.Model):
    id = models.AutoField(primary_key=True)
    job = models.ForeignKey(Job, on_delete=models.CASCADE, db_column='jobId', related_name='applications')
    student = models.ForeignKey(User, on_delete=models.CASCADE, db_column='studentId', related_name='applications')
    resumeUrl = models.CharField(max_length=255)
    atsScore = models.FloatField(default=0.0)
    status = models.CharField(max_length=50, choices=[('applied', 'Applied'), ('shortlisted', 'Shortlisted'), ('rejected', 'Rejected')], default='applied')
    missingKeywords = models.TextField(null=True, blank=True)
    createdAt = models.DateTimeField(auto_now_add=True)
    updatedAt = models.DateTimeField(auto_now=True)

    class Meta:
        managed = False
        db_table = 'applications'
    
    def __str__(self):
        return f"{self.student.name} -> {self.job.title}"
