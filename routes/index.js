'use strict';
var express = require('express');
var router = express.Router();
var hash = require('object-hash');

router.get('/', function(req, res, next) {
    res.render('index', {
        title: 'BookingApp'
    });
});

router.post('/', function(req, res, next) {

    if (req.body[0].fullName != undefined) {
        let usersFile = require('../data/users.json');

        req.body.forEach(user => {
            user.bookings.forEach(booking => {
                booking.currentBooking = false;
            });
        });

        usersFile.users = req.body

        const fs = require('fs');

        fs.writeFile('./data/users.json', JSON.stringify(usersFile), function(err) {
            if (err) throw err;
            console.log('File is created successfully.');
        });
    }

    if (req.body[0].fullName == undefined) {
        let weekFile = require('../data/currentWeek.json');

        weekFile.weeks.forEach(element => {

            req.body.forEach(week => {

                if (week.weekName == element.weekName) {

                    element.weekData = week.weekData;
                }
            });
        });

        const fs = require('fs');

        fs.writeFile('./data/currentWeek.json', JSON.stringify(weekFile), function(err) {
            if (err) throw err;
            console.log('File is created successfully.');
        });
    }
});

router.get('/showBooking', function(req, res, next) {
    res.render('showBooking', {
        title: 'BookingApp'
    });
});

router.get('/login', function(req, res, next) {

    res.render('login', {
        title: 'BookingApp'
    });
});

router.post('/login', function(req, res, next) {

    let dataUser = require('../data/users.json');

    dataUser.users.push({
        "name": hash(req.body.fullName),
        "email": hash(req.body.email),
        "password": hash(req.body.password),
        "bookings": [{
            "booked": false,
            "bookedInfo": null,
            "weekBooked": null,
            "dayBooked": null,
            "timeBooked": null,
            "currentBooking": false
        }, {
            "booked": false,
            "bookedInfo": null,
            "weekBooked": null,
            "dayBooked": null,
            "timeBooked": null,
            "currentBooking": false
        }]
    })

    const fs = require('fs');

    fs.writeFile('./data/users.json', JSON.stringify(dataUser), function(err) {
        if (err) throw err;
        console.log('File is created successfully.');
    });
});

module.exports = router;