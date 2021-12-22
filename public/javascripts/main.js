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

    dataUsers = res[0].users;
    dataCurrentWeek = res[1].currentWeek;
    dataNextWeek = res[2].nextWeek;

    console.log(dataUsers);
    console.log(dataCurrentWeek);
    console.log(dataNextWeek);

    if (location.href.includes('showBooking')) {
        console.log('This is showBooking page');

    } else {

        console.log('This is index page')

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

        dataUsers.forEach(element => {
            if (element.email == userLoggedin && element.timeBooked != null) {
                let elements = document.getElementsByClassName('btnBookClass');
                for (let i = 0; i < elements.length; i++) {
                    elements[i].disabled = true;
                }
            }
        });
    }


}

const functionBtnBook = (event) => {

    document.getElementById('btnCancelId').disabled = false;
    document.getElementById('btnConfirmId').disabled = false;

    let elements = document.getElementsByClassName('btnBookClass');
    for (let i = 0; i < elements.length; i++) {
        elements[i].disabled = true;
    }

    const id = event.target.id.split(',');

    let btnDay = id[0];
    let btnTime = id[1];

    dataCurrentWeek.forEach(day => {

        if (day.day == btnDay) {

            day.times.forEach(time => {

                if (time.time == btnTime) {

                    dataUsers.forEach(user => {
                        if (user.email == userLoggedin) {
                            if (user.timeBooked == null) {
                                user.timeBooked = event.target.id;
                                time.bookedBy = userLoggedin;
                                time.booked = true;

                            } else {
                                document.getElementById('btnCancelId').disabled = true;
                                document.getElementById('btnConfirmId').disabled = true;
                            }
                        }
                    });

                }
            });
        }
    });
}

const functionBtnConfirm = () => {

    fetch('/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataCurrentWeek),
    }).then(console.log('dataCurrentWeek finished'))

    fetch('/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataUsers),
    }).then(console.log('dataUsers finished'))

    location.reload();
}

const functionBtnCancel = () => {

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
                            user.timeBooked = null;
                            time.bookedBy = '';

                        } else {
                            document.getElementById('btnCancelId').disabled = true;
                            document.getElementById('btnConfirmId').disabled = true;
                        }
                        if (time.bookedBy != '') {
                            time.bookedBy = '';
                            time.booked = false;
                        }
                    }
                });

            }
        });

    });
}

const functionBtnSignOut = () => {
    document.cookie = 'user=;expires=Thu, 01 Jan 1970 00:00:00 UTC;'

    location.href = '/login'
}