from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.

class User(AbstractUser):
    pass

class Event(models.Model):
    user = models.ForeignKey("User", on_delete=models.CASCADE, related_name="events")
    title = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    completed = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.title} - {self.user.username} - {self.created_at} - {self.completed}"

    def serialize(self):
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "created_at": self.created_at.strftime("%b %d %Y, %I:%M %p"),
            "completed": self.completed
        }