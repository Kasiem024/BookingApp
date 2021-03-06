'use strict';

console.log('login.js is alive');

let dataUsers = [];

console.log(document.cookie);

try {
    if (document.cookie != '') {

        if (document.cookie.split(' ').find(row => row.startsWith('user=')).split('=')[1] != '') {

            location.href = '/';
        }
    }
} catch (error) {}

const fetchUsersInfo = fetch(
    '/data/users'
).then((res) => res.json());

const allData = Promise.all([fetchUsersInfo]);

allData.then((res) => load(res));

const load = (res) => {
    dataUsers = res[0].users;
}

const functionLogin = () => {

    let email = document.getElementById('tBoxLoginEmail').value;
    let password = document.getElementById('tBoxLoginPassword').value;

    email = objectHash.sha1(email);
    password = objectHash.sha1(password);

    let error = document.getElementById('errorMessageLogin');
    error.innerHTML = null;

    let findEmail = dataUsers.find(element => element.email == email);
    let findPassword = dataUsers.find(element => element.password == password);

    if (findEmail != undefined && findPassword != undefined) {
        document.cookie = 'user=' + email;
        location.href = '/';
    }

    if (findEmail == undefined) {
        error.textContent += 'Incorrect email ';
    }

    if (findPassword == undefined) {
        error.textContent += 'Incorrect password ';
    }
}

const functionShowCreateAccount = () => {

    document.getElementById('divLogin').style.display = 'none';
    document.getElementById('divCreateAccount').style.display = 'block';
}
const functionCancelCreateAccount = () => {

    document.getElementById('divLogin').style.display = 'block';
    document.getElementById('divCreateAccount').style.display = 'none';
}

const functionCreateAccount = () => {

    let error = document.getElementById('errorMessageCreate');
    error.innerHTML = null;

    const fullName = document.getElementById('tBoxFullName').value;
    let email = document.getElementById('tBoxCreateEmail').value;
    const password = document.getElementById('tBoxCreatePassword').value;
    const repeatPassword = document.getElementById('tBoxRepeatPassword').value;

    const validEmail = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    const validPassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}$/;

    let counterCorrect = 0;

    if (email != '' && email.match(validEmail)) {
        email = objectHash.sha1(email);

        let findEmail = dataUsers.find(element => element.email == email);

        if (findEmail == undefined) {
            counterCorrect++;

        } else if (findEmail.email != undefined) {
            error.textContent = 'Email already exists ';
        }
    }

    if (password.match(validPassword) && password == repeatPassword) {

        counterCorrect++;

    } else {
        error.innerHTML += 'Incorrect password <br> Password must be at least 6 characters which contain at least one number, one uppercase and one lowercase letter';
    }

    if (counterCorrect == 2) {
        const dataUser = {
            "fullName": fullName,
            "email": email,
            "password": password
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