'use strict';

console.log('main.js is alive');

let dataUsers = [];
let dataCurrentWeek = [];
let dataNextWeek = [];
let bookingInfo = [];

console.log(document.cookie);

let userLoggedin;

try {
    if (document.cookie != '') {

        if (document.cookie.split(' ').find(row => row.startsWith('user=')).split('=')[1] == '') {

            location.href = '/login';
        } else {
            userLoggedin = document.cookie.split(' ').find(row => row.startsWith('user=')).split('=')[1];
        }
    } else {
        location.href = '/login';
    }

} catch (error) {
    location.href = '/login';
}

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

    console.log(userLoggedin)

    console.log(res)

    dataUsers = res[0].users;
    dataCurrentWeek = res[1].currentWeek;
    dataNextWeek = res[2].nextWeek;

    console.log(dataUsers);
    console.log(dataCurrentWeek);
    console.log(dataNextWeek);

    dataCurrentWeek.forEach((day, counterDay) => {
        // console.log(day.day + ' ' + counterDay);
        // console.log(counterDay);

        let mybr = document.createElement('br');
        document.getElementById('calendar').appendChild(mybr);

        // Printing what day it is
        const p = document.createElement('p');
        p.textContent = day.day;
        document.getElementById('calendar').appendChild(p);

        day.times.forEach((time, counterTime) => {
            // console.log(time.time + ' ' + counterTime);
            // console.log(counterTime);

            const btn = document.createElement('button');
            btn.textContent = "Book " + time.time;
            btn.style.width = "80px"
            btn.style.height = "80px"
            btn.id = day.day + "," + time.time;
            btn.className = 'btnBookClass';

            console.log(btn.id)

            btn.addEventListener('click', functionBtnBook)

            document.getElementById('calendar').appendChild(btn);

            if (time.booked == true) {
                btn.disabled = true;
            }
        });
    });
}

const functionBtnBook = (event) => {
    console.log('This is book');
    console.log(event.target.id);

}

const functionBtnConfirm = () => {
    console.log('This is confirm');
}

const functionBtnCancel = () => {
    console.log('This is cancel');
}

const functionBtnSignOut = () => {
    document.cookie = 'user=;expires=Thu, 01 Jan 1970 00:00:00 UTC;'

    location.href = '/login'
}