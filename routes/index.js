var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.render('index', {
        title: 'BookingApp'
    });
});

router.post('/', function(req, res, next) {

    if (req.body[0].fullName != undefined) {
        let dataUser = require('../data/users.json');

        dataUser.users = req.body

        const fs = require('fs');

        fs.writeFile('./data/users.json', JSON.stringify(dataUser), function(err) {
            if (err) throw err;
            console.log('File is created successfully.');
        });
    }

    if (req.body[0].weekName == 'currentWeek') {
        let weekFile = require('../data/currentWeek.json');

        weekFile.currentWeek = req.body[0].weekData

        const fs = require('fs');

        fs.writeFile('./data/currentWeek.json', JSON.stringify(weekFile), function(err) {
            if (err) throw err;
            console.log('File is created successfully.');
        });
    }

    if (req.body[1].weekName == 'nextWeek') {
        let weekFile = require('../data/nextWeek.json');

        weekFile.nextWeek = req.body[1].weekData

        const fs = require('fs');

        fs.writeFile('./data/nextWeek.json', JSON.stringify(weekFile), function(err) {
            if (err) throw err;
            console.log('File is created successfully.');
        });
    }

    if (req.body[2].weekName == 'nextNextWeek') {
        let weekFile = require('../data/nextNextWeek.json');

        weekFile.nextNextWeek = req.body[2].weekData

        const fs = require('fs');

        fs.writeFile('./data/nextNextWeek.json', JSON.stringify(weekFile), function(err) {
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
        "weekBooked": null,
        "timeBooked": null,
    })

    const fs = require('fs');

    fs.writeFile('./data/users.json', JSON.stringify(dataUser), function(err) {
        if (err) throw err;
        console.log('File is created successfully.');
    });
});

module.exports = router;