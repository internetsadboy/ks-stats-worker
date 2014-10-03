'use strict';

var ksDataTotals = require('ks-data-totals'),
    router = require('express').Router(),
    models = require('../../models/index'),
    request = require('request'),
    crypto = require('crypto'),
    fs = require('fs');

var url = 'http://104.131.136.59:8006/poll/';


// poll real-time data
router.get('/', function (req, res, next) {
  ksDataTotals(function (err, data) {
    if (err) res.send('400');
    res.json(data);
  });
});


// create a new entry
router.post('/', function (req, res, next) {
  var timestamp, day, month, year, date;

  timestamp = new Date();

  // format date
  day = timestamp.getDate();
  month = timestamp.getMonth() + 1; // index starts at 0
  year = timestamp.getFullYear();

  if (month < 10) month = '0' + month;
  if (day < 10) day = '0' + day;

  date = year + '-' + month + '-' + day;

  ksDataTotals(function (err, data) {
    var entry;

    entry = { date : date, data : data };

    new models.ksDataTotals(entry).save();

    res.json(entry);
  });
});


router.route('/:date')

  // get date specific data
  .get(function (req, res, next) {
    var date = req.params.date;

    models.ksDataTotals
      .find({ 'date' : date })
      .exec(function (err, doc) {

        if (err) console.log(err);

        res.json(doc);
      });
  })

  // update an entry
  .put(function (req, res, next) {
    var date = req.params.date;

    models.ksDataTotals
      .update({ 'date' : date })
      .exec(function (err, doc) {

        if (err) console.log(err);

        res.send(doc);
      });
  })

  // delete an entry
  .delete(function (req, res, next) {
    var date = req.params.date;

    models.ksDataTotals
      .remove({ 'date' : date }, function (err) {

        if (err) console.log(err);

        res.send('');
      });
  });


// compute averages
router.route('/:date/avg')

  .get(function (req, res, next) {
    var date, data;

    date = req.params.date;

    request(url + date, function onResponse (err, response, body) {

      if (err) console.log(err);

      try {

        // data transformation
        data = JSON.parse(body)
          .map(function onMap (element) {
            return element.data;
          });

        var keys, averages = {}, i, j, k;

        // get key names
        keys = Object.keys(data[0]);

        // initialize averages
        for (k = 0; k < keys.length; k++) averages[keys[k]] = 0;

        // iterate over data points
        for (i = 0; i < data.length; i++)
        {
          // summate values
          for (j = 0; j < keys.length; j++)
          {
            averages[keys[j]] += data[i][keys[j]];
            if (i === data.length - 1) averages[keys[j]] = averages[keys[j]] / data.length;
          }
        }

        res.json(averages);

      } catch (e) {
        res.send(e);
      }
    });

  });


// map to specific statistical end point
router.route('/:date/avg/:stat')

  .get(function (req, res, next) {
    var date, stat, data;

    date = req.params.date;
    stat = req.params.stat;

    request(url + date + '/avg', function onResponse (err, response, body) {

      if (err) console.log(err);

      res.json(JSON.parse(body)[stat]);
    });
  });



module.exports = router;
