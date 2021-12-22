var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.render('index', {
        title: 'BookingApp'
    });
});

router.post('/', function(req, res, next) {

    if (req.body[0].fullName == undefined) {
        console.log('THIS IS CURREENTWEEK')
        console.log(req.body)

        let currentWeekFile = require('../data/currentWeek.json');

        currentWeekFile.currentWeek = req.body

        console.log(currentWeekFile.currentWeek[0].times)

        const fs = require('fs');

        fs.writeFile('./data/currentWeek.json', JSON.stringify(currentWeekFile), function(err) {
            if (err) throw err;
            console.log('File is created successfully.');
        });
    }

    if (req.body[0].day == undefined) {
        console.log('THIS IS DATAUSERS')
        console.log(req.body)

        let dataUser = require('../data/users.json');

        dataUser.users = req.body

        console.log(dataUser)

        const fs = require('fs');

        fs.writeFile('./data/users.json', JSON.stringify(dataUser), function(err) {
            if (err) throw err;
            console.log('File is created successfully.');
        });
    }
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