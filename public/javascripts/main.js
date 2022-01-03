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

        functionShowBooking();

    } else {
        functionPrintWeeks();

        dataUsers.forEach(user => {

            if (user.email == userLoggedin) {
                let counterBooking = 0;

                user.bookings.forEach(booking => {
                    if (booking.booked == true) {
                        counterBooking++;

                    }
                    if (counterBooking == dataUsers[0].bookings.length) {
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
        });
    }
}

const functionPrintWeeks = () => {

    document.getElementById('divBook').innerHTML = null;

    pointerWeek.forEach(week => {
        if (week.weekStatus == true) {

            const h3 = document.createElement('h3');
            h3.textContent = 'Week ' + week.weekNumber;
            document.getElementById('divBook').appendChild(h3);

            week.weekData.forEach((day, counterDay) => {

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
                    btn.id = day.day + "," + time.time + "," + week.weekName;
                    btn.className = 'btnBookClass';

                    btn.addEventListener('click', functionBtnBook);

                    document.getElementById('divBook').appendChild(btn);

                    const hour = time.time.split(':')

                    if (day.day == days[date.getDay()]) {
                        if (parseInt(hour[0]) <= date.getHours() && week.weekName == 'week0') {
                            btn.disabled = true;
                        }
                    }

                    days.forEach((element, counter) => {
                        if (day.day == days[counter]) {
                            if (counter < days.indexOf(days[date.getDay()]) && week.weekName == 'week0') {
                                btn.disabled = true;
                            }
                        }
                    });

                    // let btnDate = new Date();

                    // let numberWeek = week.weekName.replace(/^\D+/g, '');

                    // btnDate.setDate(date.getDate() + (counterDay + (numberWeek * 7)));

                    // console.log(btnDate);

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
                        btn.disabled = false;
                    }
                });
            });
        }
    });
}

const functionBtnBook = (event) => {

    document.getElementById('btnCancelId').disabled = false;
    document.getElementById('btnConfirmId').disabled = false;
    document.getElementById('btnPreviousWeekId').disabled = true;
    document.getElementById('btnNextWeekId').disabled = true;



    functionDisableButtons();

    const id = event.target.id.split(',');

    let btnDay = id[0];
    let btnTime = id[1];
    let btnWeek = id[2];

    pointerWeek.forEach(week => {
        if (week.weekStatus == true) {

            week.weekData.forEach(day => {
                if (day.day == btnDay) {

                    day.times.forEach(time => {
                        if (time.time == btnTime) {

                            dataUsers.forEach(user => {
                                if (user.email == userLoggedin) {
                                    let counterBooking = 0;

                                    user.bookings.forEach(booking => {

                                        if (booking.booked == false && counterBooking == 0) {

                                            booking.booked = true;
                                            booking.bookedInfo = event.target.id;
                                            booking.weekBooked = btnWeek;
                                            booking.dayBooked = btnDay;
                                            booking.timeBooked = btnTime;
                                            booking.currentBooking = true;

                                            time.bookedBy = userLoggedin;
                                            time.booked = true;

                                            counterBooking++;
                                        }
                                    });
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

    functionDisableButtons();

    pointerWeek.forEach(week => {

        if (week.weekStatus == true) {

            week.weekData.forEach(day => {

                day.times.forEach(time => {

                    dataUsers.forEach(user => {
                        if (time.bookedBy == user.email) {

                            user.bookings.forEach(booking => {
                                if (booking.currentBooking == true && time.time == booking.timeBooked && day.day == booking.dayBooked) {

                                    booking.booked = false;
                                    booking.bookedInfo = null;
                                    booking.weekBooked = null;
                                    booking.dayBooked = null;
                                    booking.timeBooked = null;
                                    booking.currentBooking = false;

                                    time.bookedBy = null;
                                    time.booked = false;
                                }
                            });
                        }
                    });
                });
            });
        }
    });

    functionPrintWeeks();
}

const functionBtnNextWeek = () => {

    document.getElementById('btnPreviousWeekId').disabled = false;

    let tempArray = [];

    pointerWeek.forEach(week => {
        tempArray.push(week.weekStatus)
    });

    const weekTrue = tempArray.indexOf(true);

    if (pointerWeek[pointerWeek.length - 2].weekStatus == true) {

        pointerWeek[pointerWeek.length - 2].weekStatus = false;
        pointerWeek[pointerWeek.length - 1].weekStatus = true;
        document.getElementById('btnNextWeekId').disabled = true;

    } else if (pointerWeek[pointerWeek.length - 1].weekStatus == true) {
        // Nothing should happen

    } else {

        pointerWeek[weekTrue].weekStatus = false;
        pointerWeek[weekTrue + 1].weekStatus = true;
    }

    functionPrintWeeks();
}

const functionBtnPreviousWeek = () => {

    document.getElementById('btnNextWeekId').disabled = false;

    let tempArray = [];

    pointerWeek.forEach(week => {
        tempArray.push(week.weekStatus)
    });

    const weekTrue = tempArray.indexOf(true);

    if (pointerWeek[1].weekStatus == true) {

        pointerWeek[1].weekStatus = false;
        pointerWeek[0].weekStatus = true;
        document.getElementById('btnPreviousWeekId').disabled = true;

    } else if (pointerWeek[0].weekStatus == true) {
        // Nothing should happen

    } else {

        pointerWeek[weekTrue].weekStatus = false;
        pointerWeek[weekTrue - 1].weekStatus = true;
    }

    functionPrintWeeks();
}

const functionDisableButtons = () => {
    let btnBookArray = document.getElementsByClassName('btnBookClass');

    for (let i = 0; i < btnBookArray.length; i++) {
        btnBookArray[i].disabled = true;
    }
}

const functionShowBooking = () => {

    pointerWeek.forEach(week => {

        week.weekData.forEach(day => {

            day.times.forEach(time => {

                if (time.bookedBy == userLoggedin) {

                    const p = document.createElement('p');
                    p.textContent = 'You have booked on ' + day.day + ' at ' + time.time + ' in week ' + week.weekNumber;
                    document.getElementById('divShowBooking').appendChild(p);

                    const btn = document.createElement('button');
                    btn.textContent = 'Cancel this booking';
                    btn.id = day.day + "," + time.time + "," + week.weekName;
                    btn.className = 'btnCancelBookingClass';
                    btn.addEventListener('click', functionBtnCancelBooking)
                    document.getElementById('divShowBooking').appendChild(btn);
                }
            });
        })
    });
}

const functionBtnCancelBooking = (event) => {

    functionDisableButtons();

    const id = event.target.id.split(',');

    let btnDay = id[0];
    let btnTime = id[1];
    let btnWeek = id[2];

    pointerWeek.forEach(week => {

        if (week.weekName == btnWeek) {

            week.weekData.forEach(day => {

                if (day.day == btnDay) {

                    day.times.forEach(time => {

                        if (time.time == btnTime && time.bookedBy == userLoggedin) {

                            dataUsers.forEach(user => {

                                if (user.email == userLoggedin) {

                                    user.bookings.forEach(booking => {
                                        if (booking.bookedInfo == event.target.id) {
                                            booking.booked = false;
                                            booking.bookedInfo = null;
                                            booking.weekBooked = null;
                                            booking.dayBooked = null;
                                            booking.timeBooked = null;

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
    });

    document.getElementById('btnConfirmId').disabled = false;
    document.getElementById('btnCancelId').disabled = true;
    document.getElementById('btnPreviousWeekId').disabled = true;
    document.getElementById('btnNextWeekId').disabled = true;
}

const functionBtnSignOut = () => {
    document.cookie = 'user=;expires=Thu, 01 Jan 1970 00:00:00 UTC;'

    location.href = '/login'
}