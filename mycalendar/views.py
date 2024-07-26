from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import render
from django.urls import reverse
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required

from .models import User, Date, Event

import json
from django.views.decorators.csrf import csrf_exempt

# Create your views here.

def index(request):
    # Authenticated users view their inbox
    if request.user.is_authenticated:
        days = Date.objects.filter(user=request.user)
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
        event = Event.objects.create(title=title, time=time, description=description)
        event.save()

        day, month, year = splitDate(date)

        day = Date.objects.create(user=user, day=day, month=month, year=year, events=event)
        day.save()
        return HttpResponseRedirect(reverse("index"))
    return render(request, 'mycalendar/calendar.html')

@csrf_exempt
def completeEvent(request, event_id):
    if request.method != "PUT":
        return JsonResponse({"error": "PUT request required"}, status=400)
    try:
        event = Event.objects.get(id=event_id)
        if event.completed:
            event.completed = False
        else:
            event.completed = True
        event.save()
        return JsonResponse({"event": event.serialize(), "message": "Event completed"}, status=201)
    except Date.DoesNotExist:
        return JsonResponse({"error": "Date not found."}, status=404)

@csrf_exempt
def deleteEvent(request, event_id):
    if request.method != "DELETE":
        return JsonResponse({"error": "DELETE request required"}, status=400)
    try:
        event = Event.objects.get(id=event_id)
        event.delete()
        return JsonResponse({"message": "Event deleted"}, status=201)
    except Event.DoesNotExist:
        return JsonResponse({"error": "Event not found."}, status=404)

@csrf_exempt
def editEvent(request, event_id):
    if request.method != "PUT":
        return JsonResponse({"error": "PUT request required"}, status=400)
    try:
        event = Event.objects.get(id=event_id)
        data = json.loads(request.body)
        event.title = data.get("title", event.title)
        event.time = data.get("time", event.time)
        event.description = data.get("description", event.description)
        event.save()
        return JsonResponse({"event": event.serialize(), "message": "Event edited"}, status=201)
    except Event.DoesNotExist:
        return JsonResponse({"error": "Event not found."}, status=404)
