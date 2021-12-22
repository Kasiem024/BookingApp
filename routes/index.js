var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.render('index', {
        title: 'BookingApp'
    });
});

router.post('/', function(req, res, next) {

    if (req.body[0].fullName == undefined) {

        let currentWeekFile = require('../data/currentWeek.json');

        currentWeekFile.currentWeek = req.body


        const fs = require('fs');

        fs.writeFile('./data/currentWeek.json', JSON.stringify(currentWeekFile), function(err) {
            if (err) throw err;
            console.log('File is created successfully.');
        });
    }

    if (req.body[0].day == undefined) {

        let dataUser = require('../data/users.json');

        dataUser.users = req.body

        const fs = require('fs');

        fs.writeFile('./data/users.json', JSON.stringify(dataUser), function(err) {
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
        "name": req.body.fullName,
        "email": req.body.email,
        "password": req.body.password,
        "timeBooked": null
    })

    const fs = require('fs');

    fs.writeFile('./data/users.json', JSON.stringify(dataUser), function(err) {
        if (err) throw err;
        console.log('File is created successfully.');
    });
});

module.exports = router;