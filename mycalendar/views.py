from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required

from .models import User, Date, Event

import json

# Create your views here.

def index(request):
    # Authenticated users view their inbox
    if request.user.is_authenticated:
        days = Date.objects.all()
        day_events = json.dumps([day.serialize() for day in days])
        return render(request, 'mycalendar/calendar.html', {
            "events_json": day_events
        })
    return HttpResponseRedirect(reverse('login'))

def login_view(request):
    if request.method == "POST":
        # Attempt to sign user in
        user = authenticate(request, username=request.POST["username"], password=request.POST["password"])

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        return render(request, "mycalendar/login.html", {
            "message": "Invalid username and/or password."
        })
    return render(request, "mycalendar/login.html")

def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))

def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "mycalendar/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError as e:
            print(e)
            return render(request, "mycalendar/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))

    return render(request, "mycalendar/register.html")

def splitDate(date):
    year = date.split("/")[2]
    month = date.split("/")[1]
    day = date.split("/")[0]

    if len(month) == 1:
        month = "0" + month
    if len(day) == 1:
        day = "0" + day

    return day, month, year

@login_required(login_url='login')
def addEvent(request):
    if request.method == "POST":
        title = request.POST["title"]
        date = request.POST["date"]
        time = request.POST["time"]
        description = request.POST["description"]
        user = request.user
        print(f"Date: {date}")
        print(f"Time: {time}")
        event = Event.objects.create(user=user, title=title, time=time, description=description)
        event.save()

        day, month, year = splitDate(date)

        day = Date.objects.create(day=day, month=month, year=year, events=event)
        day.save()
        return HttpResponseRedirect(reverse("index"))
    return render(request, 'mycalendar/calendar.html')