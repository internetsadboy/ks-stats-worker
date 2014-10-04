'use strict';

var router = require('express').Router();


router.get('/', function (req, res, next) {
  var docs;

  docs = '\n    =====  API  =====\n\n' +
         '  * GET    /poll       \n' +
         '  * GET    /poll/:date \n' +
         '  * POST   /poll/:date \n' +
         '  * PUT    /poll/:date \n' +
         '  * DELETE /poll/:date \n';

  res.setHeader('Content-Type', 'text/plain');
  res.end(docs);
});


module.exports = router;
