const calendar = document.querySelector(".calendar");
const date = document.querySelector(".date");
const daysContainer = document.querySelector(".days");
const prev = document.querySelector(".prev");
const next = document.querySelector(".next");
const todayBtn = document.querySelector(".today-btn");
const gotoBtn = document.querySelector(".goto-btn");
const dateInput = document.querySelector(".date-input");
const eventDay = document.querySelector(".event-day");
const eventDate = document.querySelector(".event-date");
const eventsContainer = document.querySelector(".events");
const addEventSubmit = document.querySelector(".add-event-btn");
const addEventDate = document.querySelector(".input-event-date");

let today = new Date();
let activeDay;
let month = today.getMonth();
let year = today.getFullYear();

const months = [
    "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
];

// const eventsArray = [
//     {
//         day: 1,
//         month: 7,
//         year: 2024,
//         events: [
//             {
//                 title: "Event 1",
//                 time: "10:00",
//                 description: "Description 1"
//             },
//             {
//                 title: "Event 2",
//                 time: "12:00",
//                 description: "Description 2"
//             }
//         ]
//     }
// ];

function initCalendar() { // Function to initialize the calendar
    console.log(eventsArray);

    // Set the date
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const prevLastDay = new Date(year, month, 0);

    // Get the number of days in a month
    const prevDays = prevLastDay.getDate();
    const lastDate = lastDay.getDate();
    const day = firstDay.getDay();
    const nextDays = 7 - lastDay.getDay() - 1;

    // Update the date on top of the calendar
    date.innerHTML = months[month] + " " + year;

    // Adding days on dom
    let days = "";

    // Add the previous month days
    for (let i = day; i > 0; i--) {
        days += `<div class="day prev-date">${prevDays - i + 1}</div>`;
    }

    // Add the current month days
    for (let i = 1; i <= lastDate; i++){
        // Check if the day has an event
        let event = false;
        eventsArray.forEach((eventObj) => {
            if (eventObj.day === i && eventObj.month === month + 1 && eventObj.year === year) {
                event = true;
            }
        });
        // Check if the day is today
        if (i === new Date().getDate() && year === new Date().getFullYear() && month === new Date().getMonth()) {

            activeDay = i;
            getActiveDay(i);
            updateEvents(i);

            days += `<div class="day today active ${event ? "event" : ""}">${i}</div>`;
        } else {
            days += `<div class="day ${event ? "event" : ""}">${i}</div>`;
        }
    }

    // Add the next month days
    for (let i = 1; i <= nextDays; i++) {
        days += `<div class="day next-date ">${i}</div>`;
    }

    daysContainer.innerHTML = days;
    addListener();
}

initCalendar();

// Previous month
function prevMonth() {
    month--;
    if (month < 0) {
        month = 11;
        year--;
    }
    initCalendar();
}

// Next month
function nextMonth() {
    month++;
    if (month > 11) {
        month = 0;
        year++;
    }
    initCalendar();
}

// Event listeners for the previous and next buttons
prev.addEventListener("click", prevMonth);
next.addEventListener("click", nextMonth);

// Goto today
todayBtn.addEventListener("click", () => {
    today = new Date();
    month = today.getMonth();
    year = today.getFullYear();
    initCalendar();
});

dateInput.addEventListener("input", (e) => {
    dateInput.value = dateInput.value.replace(/[^0-9/]/g, ""); // Allow only numbers
    if (dateInput.value.length === 2) {
        dateInput.value += "/"; // Add a slash after the second number
    }
    if (dateInput.value.length > 7) {
        dateInput.value = dateInput.value.slice(0, 7); // Limit the input to 7 characters
    }
    if (e.inputType === "deleteContentBackward") {
        if (dateInput.value.length === 3) {
            dateInput.value = dateInput.value.slice(0, 2); // Remove the slash if the user deletes the third character
        }
    }
    if (dateInput.value.length === 3 && !dateInput.value.includes("/")) { // If the user types a number after the second number
        dateInput.value = dateInput.value.slice(0, 2) + "/" + dateInput.value.slice(2); // Add a slash after the second number
    }
});

gotoBtn.addEventListener("click", gotoDate);

// Go to a specific date
function gotoDate() {
    const dateArray = dateInput.value.split("/");
    if (dateArray.length === 2) { // Check if the date is complete
        if (dateArray[0] > 0 && dateArray[0] < 13 && dateArray[1].length === 4) { // Check if the date is valid
            month = dateArray[0] - 1;
            year = dateArray[1];
            initCalendar();
            return;
        }
    }
    alert("Invalid date");
}

// Add event
const addEventBtn = document.querySelector(".add-event");
const addEventContainer = document.querySelector(".add-event-wrapper");
const addEventCloseBtn = document.querySelector(".close");
const addEventTitle = document.querySelector(".input-event-name");
const addEventTime = document.querySelector(".input-event-time");
const addEventDesc = document.querySelector(".input-event-desc");


addEventBtn.addEventListener("click", () => { // Show the add event container
    addEventTitle.value = "";
    addEventTime.value = "";
    addEventDesc.value = "";
    addEventDate.setAttribute('value',`${activeDay}/${month + 1}/${year}`);
    addEventContainer.classList.toggle("active");
});

addEventCloseBtn.addEventListener("click", () => { // Close the add event container
    addEventContainer.classList.remove("active");
});

document.addEventListener("click", (e) => { // Close the add event container if the user clicks outside it
    if (e.target !== addEventBtn && !addEventContainer.contains(e.target)) {
        addEventContainer.classList.remove("active");
    }
});

addEventTitle.addEventListener("input", (e) => { // Limit the title to 50 characters
    addEventTitle.value = addEventTitle.value.slice(0, 50);
});

addEventTime.addEventListener("input", (e) => { // Allow only numbers and slashes
    addEventTime.value = addEventTime.value.replace(/[^0-9:]/g, "");
    if (addEventTime.value.length === 2) {
        addEventTime.value += ":"; // Add a colon after the second number
    }
    if (addEventTime.value.length > 5) {
        addEventTime.value = addEventTime.value.slice(0, 5); // Limit the input to 5 characters
    }
    if (e.inputType === "deleteContentBackward") {
        if (addEventTime.value.length === 3) {
            addEventTime.value = addEventTime.value.slice(0, 2); // Remove the colon if the user deletes the third character
        }
    }
    if (addEventTime.value.length === 3 && !addEventTime.value.includes(":")) { // If the user types a number after the second number
        addEventTime.value = addEventTime.value.slice(0, 2) + ":" + addEventTime.value.slice(2); // Add a colon after the second number
    }
});

// Listener on days
function addListener() {
    const days = document.querySelectorAll(".day");
    days.forEach((day) => {
        day.addEventListener("click", (e) => { // Show the active day events
            activeDay = Number(e.target.innerHTML);
            getActiveDay(e.target.innerHTML);
            updateEvents(Number(e.target.innerHTML));

            days.forEach((day) => {
                day.classList.remove("active");
            });

            if (e.target.classList.contains("prev-date")) { // If the day is from the previous month
                prevMonth();

                setTimeout(() => {
                    const days = document.querySelectorAll(".day");

                    days.forEach((day) => {
                        if (!day.classList.contains("prev-date") && day.innerHTML === e.target.innerHTML) {
                            day.classList.add("active");
                        }
                    });
                }, 100);

            } else if (e.target.classList.contains("next-date")) { // If the day is from the next month
                nextMonth();

                setTimeout(() => {
                    const days = document.querySelectorAll(".day");

                    days.forEach((day) => {
                        if (!day.classList.contains("next-date") && day.innerHTML === e.target.innerHTML) {
                            day.classList.add("active");
                        }
                    });
                }, 100);

            } else {
                e.target.classList.add("active");
            }
        });
    });
}

// Show date and day of the active day
function getActiveDay(date) {
    const day = new Date(year, month, date);
    const dayName = day.toString().split(" ")[0];

    eventDay.innerHTML = dayName;
    eventDate.innerHTML = date + " " + months[month] + " " + year;
}



// Show the events of the active day
function updateEvents(date) {
    let events = "";
    eventsArray.forEach((event) => {
        if (date === event.day && month + 1 === event.month && year === event.year) {
            event.events.forEach((event) => {
                if (event.completed === true) {
                    events += `
                        <div class="event" id="${event.id}" data-event-id="${event.id}" style="text-decoration: line-through;" data-toggle="modal" data-target="#myModal-${event.id}">`;
                } else {
                    events += `
                        <div class="event" id="${event.id}" data-event-id="${event.id}" data-toggle="modal" data-target="#myModal-${event.id}">`;
                }
                events += `
                    <div class="title">
                        <i class="fas fa-circle"></i>
                        <h3 class="event-title">${event.title}</h3>
                    </div>

                    <div class="event-time">
                        <span class="event-time">${event.time}</span>
                    </div>

                    <div class="modal fade" id="myModal-${event.id}" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                        <div class="modal-dialog" role="document">
                            <div class="modal-content">

                                <div class="modal-header">
                                    <h5 class="modal-title" id="exampleModalLabel">${event.title}</h5>
                                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>

                                <div class="modal-body">
                                    <div class="add-event-body">
                                        <div class="add-event-input">
                                            <input type="text" class="input-event-name" name="title" placeholder="Event Name" value="${event.title}"/>
                                        </div>
                                        <div class="add-event-input">
                                            <input type="text" class="input-event-date" name="date" value="${activeDay}/${month + 1}/${year}"/>
                                        </div>
                                        <div class="add-event-input">
                                            <input type="text" class="input-event-time" name="time" placeholder="Event Time" value="${event.time}"/>
                                        </div>
                                        <div class="add-event-input">
                                            <input type="text" class="input-event-desc" name="description" placeholder="Description" value="${event.description}"/>
                                        </div>
                                    </div>
                                </div>

                                <div class="modal-footer">
                                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                                    <button type="button" class="btn btn-success" onclick="completeEvent(${event.id})">Complete event</button>
                                    <button type="button" class="btn btn-primary">Edit event</button>
                                    <button type="button" class="btn btn-danger">Delete event</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>`;
                $(document).ready(function() {
                    // Prevent modal from closing when clicking inside .modal-content
                    $(`#myModal-${event.id}`).on('click', '.modal-content', function(event) {
                        event.stopPropagation(); // This stops the click event from propagating to the parent
                    });
                });
            });
        }
    });

    if (events === "") {
        events = `
        <div class="no-event">
            <h3>No events</h3>
        </div>`;
    }
    eventsContainer.innerHTML = events;
}

addEventSubmit.addEventListener("click", () => {
    const eventTitle = addEventTitle.value;
    const eventTime = addEventTime.value;
    const eventDesc = addEventDesc.value;

    if (eventTitle === "" || eventTime === "" || eventDesc === "") {
        alert("Please fill all the fields");
        return;
    }

    const timeArray = eventTime.split(":");
    if (timeArray.length !== 2 || timeArray[0] > 23 || timeArray[1] > 59) {
        alert("Invalid time");
        return;
    }
});

function completeEvent(id) {
    fetch(`/complete-event/${id}`, {
        method: 'PUT',
        body: JSON.stringify({
            id: id
        })
    })
    .then((response) => response.json())
    .then(date => {
        console.log(date);
        window.location.reload();
    });
};
