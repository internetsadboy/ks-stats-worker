'use strict';

var ksDataTotals = require('ks-data-totals'),
    router = require('express').Router(),
    models = require('../../models/index'),
    crypto = require('crypto'),
    fs = require('fs');


router.get('/', function (req, res, next) {
  ksDataTotals(function (err, data) {
    if (err) res.send('400');
    res.json(data);
  });
});


router.post('/', function (req, res, next) {
  var timestamp, day, month, year, date;

  timestamp = new Date();

  // format date
  day = timestamp.getDate();
  month = timestamp.getMonth() + 1; // index starts at 0
  year = timestamp.getFullYear();

  if (month < 10) {
    month = '0' + month;
  }

  if (day < 10) {
    day = '0' + day;
  }

  date = year + '-' + month + '-' + day;

  // create new entry
  ksDataTotals(function (err, data) {
    var entry;

    entry = { date : date, data : data };

    new models.ksStatsTotals(entry).save();

    res.json(entry);
  });
});


router.route('/:date')

  .get(function (req, res, next) {
    var date = req.params.date;

    models.ksStatsTotals
      .find({ 'date' : date })
      .exec(function (err, doc) {

        if (err) {
          console.log(err);
        }

        res.json(doc);
      });
  })

  .put(function (req, res, next) {
    var date = req.params.date;

    models.ksStatsTotals
      .update({ 'date' : date })
      .exec(function (err, doc) {

        if (err) {
          console.log(err);
        }

        res.send(doc);
      });
  })

  .delete(function (req, res, next) {
    var date = req.params.date;

    models.ksDataTotals
      .remove({ 'date' : date }, function (err) {

        if (err) {
          console.log(err);
        }

        res.send('');
      });
  });


module.exports = router;
