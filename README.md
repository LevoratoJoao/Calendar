# Distinctiveness and Complexity

## Distinctiveness

The project is a calendar application focused on a minimalist and friendly easy-to-use interface for users to manage their daily schedule. It is distinctive in its design and functionality, allowing users to add, edit, and delete events with a clarifying view of the calendar even on mobile devices. This is achieved using CSS to style the elements and ensure responsiveness across all devices. It used Bootstrap for the events' modals and login and register pages.


## Complexity

The complexity of the project is mainly in the JavaScript code that manages the calendar and events, building them dynamically by calculating the number of days in the previous, current month, and next month.

When the user clicks on a day from the previous or next month, the calendar is rebuilt with all the days of that month and the active day clicked is highlighted. It also has a unique logic for the inputs, when the user types a date it automatically adds a `/` between month and year, and a `:` between hours and minutes when the user types the time for faster and easy interactions with the application.

After an event is added through a form, the data is sent to the Django server, it is verified before it is saved in the database to make sure everything is correct. When clicking on an event a popup modal appears with the event information, allowing the user to edit, delete, or complete the event. All these actions are handled by JavaScript and the data is sent to the server by fetch API.

Another important function is `updateEvents` which is called when the user clicks on a day, it updates the modal with the events of the day and allows the user to add, edit, delete, or complete an event.

## purpose

The goal with this project was to practice my skills with JavaScript and CSS, and to build a project that is useful for me and others because I always wanted to have a simple and easy-to-use calendar that I could manage my events and see them in a friendly way, all the others applications that I found were too complex or had too many features that I did not need so I decided to build my own with my style.

## Files

- ### calendar.html
    The file contains the structure of the calendar. On the div with `class="left"` we have days of the week, all the days of the month (built dynamically with JavaScript), input to go to a specific month and year, and the events modal, a button to go back to the current day. On the div with `class="right"` the events of the day along with the add event button.

- ### script.js
    The file that contains all the JavaScript code for managing the calendar, events, and the modal. One of the functions is `initCalendar` where various date-related variables are set, these variables are used to calculate the number of days in the previous month, current month and the days needed from the next month to fill the calendar. This function also updates the calendar's header to display the current month, and year and iterates through the days of the month checking if each day has events, this is done by comparing it with `eventsArray` that comes from the Django server as JSON.

    Another important function is `updateEvents` where the modal of an event and all data of an event is loaded to the html posteriorly allowing the user to edit, delete, or complete an event. It has, listeners to all the buttons and inputs, which also has controls such as `/` and `:` in date and hour fields. All the data that is edited or deleted is sent to the server by fetch API with their respective method.

- ### views.py
    The backend of the project, with the index function that renders the `calendar.html` sending the events data through JSON. The `addEvent` function receives the data from the request, saves it in the database, and responds to the index function.
    The `updateEvent` function receives the data from the request and updates the event in the database.
    The `deleteEvent` function receives the event and deletes it in the database.
    The `completeEvent` function receives the event from the request and updates the event in the database to complete.
    It also has functions for login, logout, register, and a simple function to split the date of an event.

- ### models.py
    With models of the project. the Event class that has the fields title, description, time, and completed and methods `__str__` and `serialize` to return the fields in JSON format. The date class that has the fields user, day, month, year, and events, user and events are foreign keys to the User and Event classes respectively, and the method `__str__` and `serialize` return the information about the day and the events that he has.

- ### style.css
    The file contains all the CSS code to style the html files such as login, register, and calendar. It has media queries to make the calendar responsive on all devices and hover effects on the buttons and events.

- ### login.html and register.html
    The files that contain the structure of the login and register pages. They have a form with inputs for username and password and a button to submit the form. They also have a link to go to the other page.

## How to run

You need to have Django installed to run the project

```bash
pip install django
```

Run the project with the following command
```bash
python manage.py runserver
```
If any changes are made to the models, run the following commands
```bash
python manage.py makemigrations
python manage.py migrate
```

To create a superuser run the following command
```bash
python manage.py createsuperuser
```

## Youtube video

[Link to the video](https://youtu.be/0o-MVKWJ6rY)