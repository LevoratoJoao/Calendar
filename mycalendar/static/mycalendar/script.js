const calendar = document.querySelector(".calendar");
const date = document.querySelector(".date");
const daysContainer = document.querySelector(".days");
const prev = document.querySelector(".prev");
const next = document.querySelector(".next");
const todayBtn = document.querySelector(".today-btn");
const gotoBtn = document.querySelector(".goto-btn");
const dateInput = document.querySelector(".date-input");

let today = new Date();
let activeDay;
let month = today.getMonth();
let year = today.getFullYear();

const months = [
    "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
];

// Function to get the number of days in a month
// function getDaysInMonth(month, year) {
//     return new Date(year, month, 0).getDate();
// }

function initCalendar() { // Function to initialize the calendar
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
        days += `<div class="day prev-date"> ${prevDays - i + 1}</div>`;
    }

    // Add the current month days
    for (let i = 1; i <= lastDate; i++){
        // Check if the day is today
        if (i === new Date().getDate() && year === new Date().getFullYear() && month === new Date().getMonth()) {
            days += `<div class="day today">${i}</div>`;
        } else {
            days += `<div class="day">${i}</div>`;
        }
    }

    // Add the next month days
    for (let i = 1; i <= nextDays; i++) {
        days += `<div class="day next-date ">${i}</div>`;
    }

    daysContainer.innerHTML = days;
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