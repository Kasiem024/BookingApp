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

            btn.addEventListener('click', functionBtnBook)

            document.getElementById('calendar').appendChild(btn);

            if (time.booked == true) {
                btn.disabled = true;
            }
        });
    });
}

const functionBtnBook = (event) => {
    console.log('This is book ------------------------');

    document.getElementById('btnCancelId').disabled = false;
    document.getElementById('btnConfirmId').disabled = false;

    let elements = document.getElementsByClassName('btnBookClass');
    for (let i = 0; i < elements.length; i++) {
        elements[i].disabled = true;
    }

    const id = event.target.id.split(',');

    let btnDay = id[0];
    let btnTime = id[1];

    console.log(btnDay);
    console.log(btnTime);

    dataCurrentWeek.forEach(day => {

        if (day.day == btnDay) {

            day.times.forEach(time => {

                if (time.time == btnTime) {

                    dataUsers.forEach(user => {
                        if (user.email == userLoggedin) {
                            if (user.timeBooked == null) {
                                console.log('1');
                                user.timeBooked = event.target.id;
                                time.bookedBy = userLoggedin;

                            } else {
                                console.log('2');
                                document.getElementById('btnCancelId').disabled = true;
                                document.getElementById('btnConfirmId').disabled = true;
                            }
                        }
                    });

                }
            });
        }
    });

    console.log(dataCurrentWeek);
    console.log(dataUsers);
}

const functionBtnConfirm = () => {
    console.log('This is confirm');
}

const functionBtnCancel = () => {
    console.log('This is cancel');

    document.getElementById('btnCancelId').disabled = true;
    document.getElementById('btnConfirmId').disabled = true;

    let elements = document.getElementsByClassName('btnBookClass');
    for (let i = 0; i < elements.length; i++) {
        elements[i].disabled = false;
    }

    dataCurrentWeek.forEach(day => {

        day.times.forEach(time => {

            if (time.time != '') {

                dataUsers.forEach(user => {
                    if (user.email == userLoggedin) {
                        if (user.timeBooked != null) {
                            console.log('1');
                            user.timeBooked = null;
                            time.bookedBy = '';

                        } else {
                            console.log('2');
                            document.getElementById('btnCancelId').disabled = true;
                            document.getElementById('btnConfirmId').disabled = true;
                        }
                        if (time.bookedBy != '') {
                            time.bookedBy = '';
                        }
                    }
                });

            }
        });

    });
    console.log(dataCurrentWeek);
    console.log(dataUsers);
}

const functionBtnSignOut = () => {
    document.cookie = 'user=;expires=Thu, 01 Jan 1970 00:00:00 UTC;'

    location.href = '/login'
}