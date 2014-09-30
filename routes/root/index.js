'use strict';

var router = require('express').Router();


router.get('/', function (req, res, next) {
  var docs;

  docs = 'GET    /poll/:date\n' +
         'POST   /poll/:date\n' +
         'PUT    /poll/:date\n' +
         'DELETE /poll/:date\n';

  res.end(docs);
});


module.exports = router;
