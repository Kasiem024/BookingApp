'use strict';

console.log('login.js is alive');

let dataUsers = [];
let dataCurrentWeek = []
let dataNextWeek = []

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

const load = (res) => {
    console.log(res)

    dataUsers = res[0].users;
    dataCurrentWeek = res[1].currentWeek;
    dataNextWeek = res[2].nextWeek;

    console.log(dataUsers);
    console.log(dataCurrentWeek);
    console.log(dataNextWeek);
}

const functionShowCreateAccount = () => {
    console.log('functionShowCreateAccount');
    document.getElementById('divLogin').style.display = 'none';
    document.getElementById('divCreateAccount').style.display = 'block';
}
const functionCancelCreateAccount = () => {
    console.log('functionCancelCreateAccount');
    document.getElementById('divLogin').style.display = 'block';
    document.getElementById('divCreateAccount').style.display = 'none';
}

const functionCreateAccount = () => {
    console.log('functionCreateAccount');

    let error = document.getElementById('errorMessage');
    error.innerHTML = null;

    const fullName = document.getElementById('tBoxFullName').value;
    const email = document.getElementById('tBoxCreateEmail').value;
    const password = document.getElementById('tBoxCreatePassword').value;
    const repeatPassword = document.getElementById('tBoxRepeatPassword').value;

    var validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    let counterCorrect = 0;

    if (email != '' && email.match(validRegex)) {
        let findEmail = dataUsers.find(element => element == email)

        if (findEmail == undefined) {
            console.log('Correct email');
            counterCorrect++;

        } else {
            error.textContent = 'Email already exists ';
        }
    }

    if (password == repeatPassword && password != '' && repeatPassword != '') {
        console.log('Correct password');
        counterCorrect++;

    } else {
        console.log('Incorrect password');
        error.textContent += 'Incorrect password';
    }

    if (counterCorrect == 2) {
        const data = {
            fullName: fullName,
            email: email,
            password: password
        };

        fetch('login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })
            .then(console.log('Finished'));
    }
}