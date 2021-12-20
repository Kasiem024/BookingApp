'use strict';

console.log('login.js is alive');

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

    const dataUsers = res[0].users;
    const dataCurrentWeek = res[1].currentWeek;
    const dataNextWeek = res[2].nextWeek;

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

    const fullName = document.getElementById('tBoxFullName').value;
    const email = document.getElementById('tBoxCreateEmail').value;
    const password = document.getElementById('tBoxCreatePassword').value;
    const repeatPassword = document.getElementById('tBoxRepeatPassword').value;



}