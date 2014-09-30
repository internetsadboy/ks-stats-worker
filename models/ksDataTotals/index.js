'use strict';

var mongoose = require('mongoose');


var Schema, ObjectId, pkgDownloadsSchema;

Schema = mongoose.Schema;
ObjectId = Schema.ObjectId;

ksDataTotalsSchema = new Schema({
  uid: ObjectId,
  date: String,
  timestamp: { type: Date, default: Date.now },
  data: Object
});

module.exports = mongoose.model('ksDataTotals', ksDataTotalsSchema);
