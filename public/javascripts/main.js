'use strict';

console.log('main.js is alive');

let dataUsers = [];
let dataCurrentWeek = [];
let dataNextWeek = [];
let dataNextNextWeek = [];
let bookingInfo = [];
let counterCurrentWeek = 0;

console.log(document.cookie);

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
    dataCurrentWeek = res[1].currentWeek;
    dataNextWeek = res[2].nextWeek;
    dataNextNextWeek = res[3].nextNextWeek;

    console.log(dataUsers);
    console.log(dataCurrentWeek);
    console.log(dataNextWeek);
    console.log(dataNextNextWeek);

    if (location.href.includes('showBooking')) {
        console.log('This is showBooking page');

        dataCurrentWeek.forEach(day => {

            day.times.forEach(time => {

                if (time.bookedBy == userLoggedin) {

                    const p = document.createElement('p');
                    p.textContent = 'You have booked on ' + day.day + ' at ' + time.time;
                    document.getElementById('divShowBooking').appendChild(p);

                    const btn = document.createElement('button');
                    btn.textContent = 'Cancel this booking';
                    btn.id = day.day + "," + time.time;
                    btn.className = 'btnCancelBookingClass';
                    btn.addEventListener('click', functionBtnCancelBooking)
                    document.getElementById('divShowBooking').appendChild(btn);
                }

            });
        });

    } else {

        console.log('This is index page');

        functionPrintWeeks();

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
}

const functionPrintWeeks = () => {

    document.getElementById('divBook').innerHTML = null;
    console.log(counterCurrentWeek);

    if (counterCurrentWeek == 0) {
        console.log('I am CurrentWeek');

        dataCurrentWeek.forEach(day => {

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
                }
            });
        });
    }
    if (counterCurrentWeek == 1) {
        console.log('I am NextWeek');

        dataNextWeek.forEach(day => {

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
                }
            });
        });
    }
    if (counterCurrentWeek == 2) {

        dataNextNextWeek.forEach(day => {
            console.log('I am NextNextWeek');

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
                }
            });
        });
    }
}

const functionBtnBook = (event) => {

    document.getElementById('btnCancelId').disabled = false;
    document.getElementById('btnConfirmId').disabled = false;

    let btnBookArray = document.getElementsByClassName('btnBookClass');
    for (let i = 0; i < btnBookArray.length; i++) {
        btnBookArray[i].disabled = true;
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
                            user.timeBooked = event.target.id;
                            time.bookedBy = userLoggedin;
                            time.booked = true;
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

    let btnBookArray = document.getElementsByClassName('btnBookClass');
    for (let i = 0; i < btnBookArray.length; i++) {
        btnBookArray[i].disabled = false;
    }

    dataCurrentWeek.forEach(day => {

        day.times.forEach(time => {

            dataUsers.forEach(user => {
                if (user.email == userLoggedin) {
                    if (user.timeBooked != null) {
                        user.timeBooked = null;
                        time.bookedBy = null;
                        time.booked = false;

                    } else {
                        document.getElementById('btnCancelId').disabled = true;
                        document.getElementById('btnConfirmId').disabled = true;
                    }
                    if (time.bookedBy != null) {
                        time.bookedBy = null;
                        time.booked = false;
                    }
                }
            });
        });
    });
    console.log(dataCurrentWeek[0].times);
    console.log(dataUsers);
}

const functionBtnCancelBooking = (event) => {

    document.getElementById('btnConfirmId').disabled = false;

    const id = event.target.id.split(',');

    let btnDay = id[0];
    let btnTime = id[1];

    dataCurrentWeek.forEach(day => {

        if (day.day == btnDay) {

            day.times.forEach(time => {

                if (time.time == btnTime) {

                    dataUsers.forEach(user => {

                        if (user.email == userLoggedin) {

                            user.timeBooked = null;
                            time.bookedBy = null;
                            time.booked = false;

                        }
                    });
                }

            });
        }
    });

    console.log(dataCurrentWeek[0].times);
    console.log(dataUsers);
}

const functionBtnNextWeek = () => {
    console.log('This is functionBtnNextWeek');

    document.getElementById('btnPreviousWeekId').disabled = false;

    if (counterCurrentWeek < 3) {
        counterCurrentWeek++;
        functionPrintWeeks();

    }
    if (counterCurrentWeek >= 2) {
        document.getElementById('btnNextWeekId').disabled = true;
    }
    console.log(counterCurrentWeek);
}

const functionBtnPreviousWeek = () => {
    console.log('This is functionBtnPreviousWeek');

    document.getElementById('btnNextWeekId').disabled = false;

    if (counterCurrentWeek > 0) {
        counterCurrentWeek--;
        functionPrintWeeks();

    }
    if (counterCurrentWeek == 0) {
        document.getElementById('btnPreviousWeekId').disabled = true;
    }
    console.log(counterCurrentWeek);
}

const functionBtnSignOut = () => {
    document.cookie = 'user=;expires=Thu, 01 Jan 1970 00:00:00 UTC;'

    location.href = '/login'
}