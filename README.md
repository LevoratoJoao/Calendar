# Calendar

# Distinctiveness and Complexity

The project is a calendar application focused on a minimalist and friendly easy-to-use interface for users to manage their daily schedule, It is distinctive in its design and functionality, allowing users to add, edit, and delete events with a clarifying view of the calendar even on mobile devices. This is achieved through the use of CSS to style the elements and ensure responsiveness across all devices.

The project did not use third-party libraries to build the calendar, it was built from scratch using JavaScript to handle the days, months, and years and CSS to style the elements. All the events data are managed in Django and sent back in JSON which is dealt with in javascript to display the events on the calendar. The project utilizes Bootstrap solely for the modals of the events.

The goal with this project was to practice more my skills with JavaScript and CSS, to build a project that is useful for me and others, because I always wanted to have a simple and easy-to-use calendar that I could manage my events and see them in a friendly way, all the others applications that I found were too complex or had too many features that I did not need so I decided to build my own with my style.

- calendar.html: The main file that contains the structure of the calendar. On the left we have days of the week, all the days of the month (built dynamically with JavaScript), input to go to a specific month and year, and the events modal, a button to go back to the current day and on the right side the events of the day along with the add event button.

- script.js: The file that contains all the JavaScript code for managing the calendar, events, and the modal. One of the functions is to build the calendar, all the days of the month, and build the previous and next months. Another function is to update events where the modal of an event is built allowing the user to edit, delete, or complete an event. It also has listeners to all the buttons. It is in this file where all the inputs are handled to make sure the user did not input the wrong data which is sent to the server by fetch API.

- views.py: The backend of the project, with the index function that renders the calendar.html sending the events data through JSON. The addEvent function receives the data from the request, saves it in the database, and responds to the index function. The updateEvent function receives the data from the request and updates the event in the database. The deleteEvent function receives the event and deletes it in the database. The completeEvent function receives the event from the request and updates the event in the database to complete.
It also has functions for login, logout, register, and a simple function to split the date of an event.

- models.py: With models of the project. the Event class that has the fields title, description, time, and completed and methods `__str__` and `serialize` to return the fields in JSON format. The date class that has the fields user, day, month, year, and events, user and events are foreign keys to the User and Event classes respectively, and the method `__str__` and `serialize` return the information about the day and the events that he has.

- style.css: The file that contains all the CSS code to style the html files such as login, register, and calendar. It has media queries to make the calendar responsive on all devices and hover effects on the buttons and events.

- login.html and register.html: The files that contain the structure of the login and register pages. They have a form with inputs for username and password and a button to submit the form. They also have a link to go to the other page.

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