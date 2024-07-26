from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.

class User(AbstractUser):
    pass

class Date(models.Model):
    user = models.ForeignKey("User", on_delete=models.CASCADE, related_name="user", null=True)
    day = models.IntegerField(default=0)
    month = models.IntegerField(default=0)
    year = models.IntegerField(default=0)
    events = models.ForeignKey("Event", on_delete=models.CASCADE, related_name="dates", null=True)

    def __str__(self):
        return f"{self.day}/{self.month}/{self.year} - {self.events}"

    def serialize(self):
        return {
            "id": self.id,
            "user": self.user.username,
            "day": self.day,
            "month": self.month,
            "year": self.year,
            "events": [self.events.serialize()]
        }

class Event(models.Model):
    title = models.CharField(max_length=100)
    time = models.TimeField(default="00:00")
    description = models.TextField(blank=True)
    completed = models.BooleanField(default=False)

    def __str__(self):
        return f"Title: {self.title}, time: {self.time}, desc: {self.description}"

    def serialize(self):
        return {
            "id": self.id,
            "title": self.title,
            "time": self.time.strftime("%H:%M"),
            "description": self.description,
            "completed": self.completed
        }