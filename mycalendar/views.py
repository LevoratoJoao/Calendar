from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse
from django.contrib.auth import authenticate, login, logout

from .models import User, Event

# Create your views here.

def index(request):
    # Authenticated users view their inbox
    if request.user.is_authenticated:
        return render(request, 'mycalendar/calendar.html')
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