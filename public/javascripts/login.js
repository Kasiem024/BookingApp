'use strict';

console.log('login.js is alive');

let dataUsers = [];

const fetchUsersInfo = fetch(
    '/data/users'
).then((res) => res.json());

const allData = Promise.all([fetchUsersInfo]);

allData.then((res) => load(res));

const load = (res) => {
    dataUsers = res[0].users;
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

    const validEmail = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    const validPassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}$/;

    let counterCorrect = 0;

    if (email != '' && email.match(validEmail)) {
        let findEmail = dataUsers.find(element => element.email == email);

        if (findEmail == undefined) {
            console.log('Correct email');
            counterCorrect++;

        } else if (findEmail.email != undefined) {
            error.textContent = 'Email already exists ';
        }
    }

    if (password.match(validPassword) && password == repeatPassword) {

        console.log('Correct password');
        counterCorrect++;

    } else {
        console.log('Incorrect password');
        error.innerHTML += 'Incorrect password <br> Password must be at least 6 characters which contain at least one number, one uppercase and one lowercase letter';
    }

    if (counterCorrect == 2) {
        const dataUser = {
            fullName: fullName,
            email: email,
            password: password
        };

        fetch('login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataUser),
            })
            .then(functionAcountCreated(email));
    }
}

const functionAcountCreated = (email) => {
    document.cookie = 'user=' + email;

    location.href = '/';
}