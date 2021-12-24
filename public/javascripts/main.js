'use strict';

console.log('main.js is alive');

console.log(document.cookie);

let dataUsers = [];

let pointerWeek = [{
    "weekStatus": true,
    "weekName": "currentWeek",
    "weekData": null
}, {
    "weekStatus": false,
    "weekName": "nextWeek",
    "weekData": null
}, {
    "weekStatus": false,
    "weekName": "nextNextWeek",
    "weekData": null
}];

let userLoggedin;

try {
    if (document.cookie != null) {

        if (document.cookie.split(' ').find(row => row.startsWith('user=')).split('=')[1] == null) {

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

const fetchNextWeekInfo = fetch(
    '/data/nextWeek'
).then((res) => res.json());

const fetchNextNextWeekInfo = fetch(
    '/data/nextNextWeek'
).then((res) => res.json());

const allData = Promise.all([fetchUsersInfo, fetchCurrentWeekInfo, fetchNextWeekInfo, fetchNextNextWeekInfo]);

allData.then((res) => load(res));

let load = (res) => {

    dataUsers = res[0].users;
    pointerWeek[0].weekData = res[1].currentWeek;
    pointerWeek[1].weekData = res[2].nextWeek;
    pointerWeek[2].weekData = res[3].nextNextWeek;

    console.log(dataUsers);
    console.log(pointerWeek);

    if (location.href.includes('showBooking')) {
        console.log('This is showBooking page');

        pointerWeek.forEach(element => {

            element.weekData.forEach(day => {

                day.times.forEach(time => {

                    if (time.bookedBy == userLoggedin) {

                        const p = document.createElement('p');
                        p.textContent = 'You have booked on ' + day.day + ' at ' + time.time + ' in ' + element.weekName;
                        document.getElementById('divShowBooking').appendChild(p);

                        const btn = document.createElement('button');
                        btn.textContent = 'Cancel this booking';
                        btn.id = day.day + "," + time.time + ',' + element.weekName;
                        btn.className = 'btnCancelBookingClass';
                        btn.addEventListener('click', functionBtnCancelBooking)
                        document.getElementById('divShowBooking').appendChild(btn);
                    }
                });
            })
        });

    } else {
        console.log('This is index page');

        functionPrintWeeks();
    }
}

const functionPrintWeeks = () => {

    document.getElementById('divBook').innerHTML = null;

    pointerWeek.forEach(element => {
        if (element.weekStatus == true) {

            element.weekData.forEach(day => {

                let mybr = document.createElement('br');
                document.getElementById('divBook').appendChild(mybr);

                const p = document.createElement('p');
                p.textContent = day.day;
                document.getElementById('divBook').appendChild(p);

                day.times.forEach(time => {

                    const btn = document.createElement('button');
                    btn.textContent = "Book " + time.time;
                    btn.style.width = "80px";
                    btn.style.height = "80px";
                    btn.id = day.day + "," + time.time;
                    btn.className = 'btnBookClass';

                    btn.addEventListener('click', functionBtnBook);

                    document.getElementById('divBook').appendChild(btn);

                    if (time.booked == true) {
                        btn.disabled = true;
                        btn.classList.add('booked');
                    }
                });
            });
        }
    });

    dataUsers.forEach(element => {
        if (element.email == userLoggedin && element.timeBooked != null) {

            let btnBookArray = document.getElementsByClassName('btnBookClass');

            for (let i = 0; i < btnBookArray.length; i++) {
                btnBookArray[i].disabled = true;
            }

            let h3 = document.createElement('h3');
            h3.textContent = 'You have already booked a time. You need to first cancel your previous booking';
            document.getElementById('divBook').prepend(h3);
        }
    });
}

const functionBtnBook = (event) => {

    document.getElementById('btnCancelId').disabled = false;
    document.getElementById('btnConfirmId').disabled = false;
    document.getElementById('btnPreviousWeekId').disabled = true;
    document.getElementById('btnNextWeekId').disabled = true;

    let btnBookArray = document.getElementsByClassName('btnBookClass');
    for (let i = 0; i < btnBookArray.length; i++) {
        btnBookArray[i].disabled = true;
    }

    const id = event.target.id.split(',');

    let btnDay = id[0];
    let btnTime = id[1];

    pointerWeek.forEach(element => {

        if (element.weekStatus == true) {

            element.weekData.forEach(day => {

                if (day.day == btnDay) {

                    day.times.forEach(time => {

                        if (time.time == btnTime) {

                            dataUsers.forEach(user => {

                                if (user.email == userLoggedin) {

                                    user.timeBooked = event.target.id;
                                    user.weekBooked = element.weekName;
                                    time.bookedBy = userLoggedin;
                                    time.booked = true;
                                }
                            });
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
        body: JSON.stringify(dataUsers),
    }).then(console.log('dataUsers finished'));

    fetch('/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(pointerWeek),
    }).then(console.log('dataCurrentWeek finished'));

    location.reload();
}

const functionBtnCancel = () => {

    document.getElementById('btnCancelId').disabled = true;
    document.getElementById('btnConfirmId').disabled = true;

    let btnBookArray = document.getElementsByClassName('btnBookClass');

    for (let i = 0; i < btnBookArray.length; i++) {
        if (!btnBookArray[i].className.includes('booked')) {
            btnBookArray[i].disabled = false;
        }
    }

    pointerWeek.forEach(element => {

        if (element.weekStatus == true) {

            element.weekData.forEach(day => {

                day.times.forEach(time => {

                    dataUsers.forEach(user => {
                        if (time.bookedBy == user.email) {

                            user.timeBooked = null;
                            user.weekBooked = null;
                            time.bookedBy = null;
                            time.booked = false;
                        }
                    });
                });
            });
        }
    });

    if (pointerWeek[0].weekStatus == true) {
        document.getElementById('btnNextWeekId').disabled = false;
    }
    if (pointerWeek[1].weekStatus == true) {
        document.getElementById('btnPreviousWeekId').disabled = false;
        document.getElementById('btnNextWeekId').disabled = false;
    }
    if (pointerWeek[2].weekStatus == true) {
        document.getElementById('btnPreviousWeekId').disabled = false;
        document.getElementById('btnNextWeekId').disabled = false;
    }
}

const functionBtnNextWeek = () => {
    console.log('This is functionBtnNextWeek');

    document.getElementById('btnPreviousWeekId').disabled = false;

    if (pointerWeek[0].weekStatus == true) {
        console.log('currentweek')

        pointerWeek[0].weekStatus = false;
        pointerWeek[1].weekStatus = true;

        functionPrintWeeks();
    } else
    if (pointerWeek[1].weekStatus == true) {
        console.log('nextweek')

        pointerWeek[1].weekStatus = false;
        pointerWeek[2].weekStatus = true;
        document.getElementById('btnNextWeekId').disabled = true;

        functionPrintWeeks();
    }
    console.log(pointerWeek);
}

const functionBtnPreviousWeek = () => {
    console.log('This is functionBtnPreviousWeek');

    document.getElementById('btnNextWeekId').disabled = false;

    if (pointerWeek[1].weekStatus == true) {
        console.log('nextweek')

        pointerWeek[1].weekStatus = false;
        pointerWeek[0].weekStatus = true;
        document.getElementById('btnPreviousWeekId').disabled = true;

        functionPrintWeeks();
    } else
    if (pointerWeek[2].weekStatus == true) {
        console.log('nextnextweek')

        pointerWeek[2].weekStatus = false;
        pointerWeek[1].weekStatus = true;

        functionPrintWeeks();
    }
}

const functionBtnCancelBooking = (event) => {

    document.getElementById('btnConfirmId').disabled = false;

    const id = event.target.id.split(',');

    let btnDay = id[0];
    let btnTime = id[1];
    let btnWeek = id[2];

    pointerWeek.forEach(element => {

        if (element.weekName == btnWeek) {

            element.weekData.forEach(day => {

                if (day.day == btnDay) {

                    day.times.forEach(time => {

                        if (time.time == btnTime) {

                            dataUsers.forEach(user => {

                                if (user.email == userLoggedin) {

                                    user.timeBooked = null;
                                    user.weekBooked = null;
                                    time.bookedBy = null;
                                    time.booked = false;
                                }
                            });
                        }
                    });
                }
            });
        }
    });
}

const functionBtnSignOut = () => {
    document.cookie = 'user=;expires=Thu, 01 Jan 1970 00:00:00 UTC;'

    location.href = '/login'
}