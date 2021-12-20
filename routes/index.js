var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.render('index', { title: 'BookingApp' });
});

router.get('/login', function(req, res, next) {
    res.render('login', { title: 'BookingApp' });
});

router.post('/login', function(req, res, next) {
    console.log(req.body)

    // let dataUsers = require('../data/users.json');

    // dataUsers.users.push({
    //     "name": "placeholder",
    //     "password": "placeholder"
    // })

    // const fs = require('fs');

    // fs.writeFile('./data/users.json', JSON.stringify(dataUsers), function(err) {
    //     if (err) throw err;
    //     console.log('File is created successfully.');
    // });

    res.render('index', { title: 'BookingApp' });

});

module.exports = router;