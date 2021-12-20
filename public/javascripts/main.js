'use strict';

console.log('main.js is alive');

let dataUsers = [];
let dataCurrentWeek = [];
let dataNextWeek = [];

const fetchUsersInfo = fetch(
    '/data/users'
).then((res) => res.json());

const fetchCurrentWeekInfo = fetch(
    '/data/currentWeek'
).then((res) => res.json());

const fetchNexttWeekInfo = fetch(
    '/data/nextWeek'
).then((res) => res.json());

const allData = Promise.all([fetchUsersInfo, fetchCurrentWeekInfo, fetchNexttWeekInfo]);

allData.then((res) => load(res));

let load = (res) => {
    console.log(res)

    dataUsers = res[0].users;
    dataCurrentWeek = res[1].currentWeek;
    dataNextWeek = res[2].nextWeek;

    console.log(dataUsers);
    console.log(dataCurrentWeek);
    console.log(dataNextWeek);

    const tboxData = document.getElementById('tboxBookTimeId')
    tboxData.style.display = 'none';

    const btnConfirm = document.createElement('button');
    btnConfirm.id = 'btnConfirmId';
    btnConfirm.textContent = 'Confirm';
    btnConfirm.disabled = true;
    document.getElementById('formId').appendChild(btnConfirm);

    for (let i = 0; i < dataCurrentWeek.length; i++) {

        // Creating a br for better visual clarity
        let mybr = document.createElement('br');
        document.getElementById('calendar').appendChild(mybr);

        // Printing what day it is
        const p = document.createElement('p');
        p.textContent = dataCurrentWeek[i].day
        document.getElementById('calendar').appendChild(p);

        for (let j = 0; j < dataCurrentWeek[i].times.length; j++) {

            // Creating a button for each time in each day, 42 in total
            // Giving each button the same class and a unique id
            // id is based on what day and what time in that day
            const btn = document.createElement('button');
            btn.textContent = "Book " + dataCurrentWeek[i].times[j].time;
            btn.style.width = "80px"
            btn.style.height = "80px"
            btn.id = i + "," + j;
            btn.className = 'btnBookClass';

            // All buttons have the same eventlistener
            btn.addEventListener('click', btnBookClick)

            document.getElementById('calendar').appendChild(btn);

            if (dataCurrentWeek[i].times[j].booked == true) {
                // If a time is already booked
                btn.disabled = true;
            }
        }
    }
}

// "btnBookClick()" prints a string to tboxBookTimeId,
// depending on the id of the clicked button
const btnBookClick = (event) => {
    // "event" is which element triggered the function
    // Gets the id and class of the element
    const id = event.target.id;
    const className = event.target.className;

    // Disables all other buttons when one one of them is clicked
    // This is due to the limitations of how,
    // data is sent to the server and stored
    let elements = document.getElementsByClassName(className);
    for (let i = 0; i < elements.length; i++) {
        elements[i].disabled = true;
    }

    // Enables cancel and confirm button because user now needs them
    document.getElementById('btnCancelId').disabled = false;
    document.getElementById('btnConfirmId').disabled = false;

    // Splits the id of the clicked button to two strings
    // Since each button has a unique id depending on day and time
    let day = id.substr(0, 1);
    let time = id.substr(2, 1);

    const dataCalendar = calendarBooking.response;

    dataCalendar.week[day].times[time].booked = true;

    // Gets which user has clicked the button from cookie
    dataCalendar.week[day].times[time].bookedBy = document.cookie.split('; ').find(row => row.startsWith('user=')).split('=')[1];

    // Value of "tboxData" is the new dataCalendar with who booked what time
    let tboxData = document.getElementById('tboxBookTimeId')
    let dataTemp = JSON.stringify(dataCalendar)
    tboxData.value += dataTemp;
}

const btnCancel = () => {
    // Erases whatever value tboxData had
    let tboxData = document.getElementById('tboxBookTimeId');
    tboxData.value = '';

    document.getElementById('btnCancelId').disabled = true;
    document.getElementById('btnConfirmId').disabled = true;

    let elements = document.getElementsByClassName('btnBookClass');
    for (let i = 0; i < elements.length; i++) {
        elements[i].disabled = false;
    }
}

// Is supposed to delete cookie,
// Currently just redirects
const btnSignOut = () => {
    location.href = '/'
}