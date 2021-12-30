'use strict';

console.log('main.js is alive');

console.log(document.cookie);

let dataUsers = [];

let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
let date = new Date();

let janOne = new Date(date.getFullYear(), 0, 1);
let numberDays = Math.floor((date - janOne) / (24 * 60 * 60 * 1000));
let weekNumber = Math.ceil((date.getDay() + 1 + numberDays) / 7);

let pointerWeek = [];

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

const allData = Promise.all([fetchUsersInfo, fetchCurrentWeekInfo]);

allData.then((res) => load(res));

let load = (res) => {

    dataUsers = res[0].users;

    res[1].weeks.forEach((element, counter) => {
        pointerWeek.push({
            "weekStatus": false,
            "weekName": element.weekName,
            "weekData": element.weekData,
            "weekNumber": weekNumber + counter
        })
    });

    pointerWeek[0].weekStatus = true;

    console.log(dataUsers);
    console.log(pointerWeek);

    if (location.href.includes('showBooking')) {
        console.log('This is showBooking page');

        functionShowBooking();

    } else {
        console.log('This is index page');

        functionPrintWeeks();
    }
}

const functionPrintWeeks = () => {

    document.getElementById('divBook').innerHTML = null;

    pointerWeek.forEach(element => {
        if (element.weekStatus == true) {

            const h3 = document.createElement('h3');
            h3.textContent = 'Week ' + element.weekNumber;
            document.getElementById('divBook').appendChild(h3);

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
                    btn.id = day.day + "," + time.time + "," + element.weekName;
                    btn.className = 'btnBookClass';

                    btn.addEventListener('click', functionBtnBook);

                    document.getElementById('divBook').appendChild(btn);

                    const hour = time.time.split(':')

                    days.forEach((element, counter) => {
                        if (day.day == days[counter]) {
                            if (counter < days.indexOf(days[date.getDay()])) {
                                btn.disabled = true;
                            }
                        }
                    });

                    if (day.day == days[date.getDay()]) {
                        if (parseInt(hour[0]) <= date.getHours()) {
                            btn.disabled = true;
                        }
                    }

                    if (time.booked == true) {
                        btn.disabled = true;
                        btn.textContent = 'Already booked ' + time.time;
                        btn.classList.add('booked');
                    }

                    if (time.bookedBy == userLoggedin) {
                        btn.removeEventListener('click', functionBtnBook);
                        btn.addEventListener('click', functionBtnCancelBooking);
                        btn.textContent = 'You have booked this time ' + time.time;
                        btn.classList.add('bookedByUser');
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
                if (btnBookArray[i].className.includes('bookedByUser')) {
                    btnBookArray[i].disabled = false;
                }
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
    }).then(console.log('pointerWeek finished'));

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

    functionPrintWeeks();
}

const functionBtnNextWeek = () => {

    document.getElementById('btnPreviousWeekId').disabled = false;

    if (pointerWeek[0].weekStatus == true) {

        pointerWeek[0].weekStatus = false;
        pointerWeek[1].weekStatus = true;

        functionPrintWeeks();
    } else
    if (pointerWeek[1].weekStatus == true) {

        pointerWeek[1].weekStatus = false;
        pointerWeek[2].weekStatus = true;
        document.getElementById('btnNextWeekId').disabled = true;

        functionPrintWeeks();
    }
}

const functionBtnPreviousWeek = () => {

    document.getElementById('btnNextWeekId').disabled = false;

    if (pointerWeek[1].weekStatus == true) {

        pointerWeek[1].weekStatus = false;
        pointerWeek[0].weekStatus = true;
        document.getElementById('btnPreviousWeekId').disabled = true;

        functionPrintWeeks();
    } else
    if (pointerWeek[2].weekStatus == true) {

        pointerWeek[2].weekStatus = false;
        pointerWeek[1].weekStatus = true;

        functionPrintWeeks();
    }
}

const functionShowBooking = () => {

    pointerWeek.forEach(element => {

        element.weekData.forEach(day => {

            day.times.forEach(time => {

                if (time.bookedBy == userLoggedin) {

                    const p = document.createElement('p');
                    p.textContent = 'You have booked on ' + day.day + ' at ' + time.time + ' in week ' + element.weekNumber;
                    document.getElementById('divShowBooking').appendChild(p);

                    const btn = document.createElement('button');
                    btn.textContent = 'Cancel this booking';
                    btn.id = day.day + "," + time.time + "," + element.weekName;
                    btn.className = 'btnCancelBookingClass';
                    btn.addEventListener('click', functionBtnCancelBooking)
                    document.getElementById('divShowBooking').appendChild(btn);
                }
            });
        })
    });
}

const functionBtnCancelBooking = (event) => {

    const id = event.target.id.split(',');

    let btnDay = id[0];
    let btnTime = id[1];
    let btnWeek = id[2];

    pointerWeek.forEach(element => {

        if (element.weekName == btnWeek) {

            element.weekData.forEach(day => {

                if (day.day == btnDay) {

                    day.times.forEach(time => {

                        if (time.time == btnTime && time.bookedBy == userLoggedin) {

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

    document.getElementById('btnConfirmId').disabled = false;
    // document.getElementById('btnCancelId').disabled = false;
    document.getElementById('btnPreviousWeekId').disabled = true;
    document.getElementById('btnNextWeekId').disabled = true;

}

const functionBtnSignOut = () => {
    document.cookie = 'user=;expires=Thu, 01 Jan 1970 00:00:00 UTC;'

    location.href = '/login'
}