var express = require('express');
const { send } = require('express/lib/response');
var router = express.Router();

router.get('/users', function(req, res, next) {
    if (typeof req.headers.referer != 'undefined') {
        const data = require('../data/users.json');
        res.send(data);
    } else {
        res.send('<h1>Unathourized Access</h1>');
    }
});

router.get('/currentWeek', function(req, res, next) {
    if (typeof req.headers.referer != 'undefined') {
        const data = require('../data/currentWeek.json');
        res.send(data);
    } else {
        res.send('<h1>Unathourized Access</h1>');
    }
});

router.get('/nextWeek', function(req, res, next) {
    if (typeof req.headers.referer != 'undefined') {
        const data = require('../data/nextWeek.json');
        res.send(data);
    } else {
        res.send('<h1>Unathourized Access</h1>');
    }
});

module.exports = router;