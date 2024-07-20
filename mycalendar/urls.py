from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('login', views.login_view, name='login'),
    path('logout', views.logout_view, name='logout'),
    path('register', views.register, name='register'),
    path('addEvent', views.addEvent, name='addEvent'),

    # API Routes
    path("complete-event/<int:date_id>", views.completeEvent, name="completeEvent"),
    path("delete-event/<int:date_id>", views.deleteEvent, name="deleteEvent"),
    path("edit-event/<int:date_id>", views.editEvent, name="editEvent"),
]
