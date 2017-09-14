"use strict";

const fs        = require("fs");
const path      = require("path");
const Sequelize = require("sequelize");
const env       = process.env.NODE_ENV || "development";
const config    = require(path.join(__dirname, '..', '..', 'config', 'config'))[env];

if (process.env.DATABASE_URL) {
  var sequelize = new Sequelize(process.env.DATABASE_URL,config);
} else {
  var sequelize = new Sequelize(config.database, config.username, config.password, config);
}

const db = {};

fs
.readdirSync(__dirname)
.filter(function(file) {
  return (file.indexOf(".") !== 0) && (file !== "index.js");
})
.forEach(function(file) {
  let model = sequelize.import(path.join(__dirname, file));
  db[model.name] = model;
});

Object.keys(db).forEach(function(modelName) {
  if ("associate" in db[modelName]) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;


if (!process.env.DATABASE_URL) {
  throw new Error('Missing missing DATABASE_URL env');
}

//const Sequelize = require('sequelize');
//const sequelize = new Sequelize(process.env.DATABASE_URL);

//const Shipment = sequelize.define('shipment', {
//userId: {
//type: Sequelize.INTEGER, allowNull: false
//},
//rates: {
//type: Sequelize.JSONB, allowNull: false
//},

//{
//timestamps: true
//}
//});

//const Label = sequelize.define('label', {
//trackingNumber: {
//type: Sequelize.STRING
//},
//vendor: {
//type: Sequelize.STRING
//},
//weight: {
//type: Sequelize., allowNull: false, unique: true
//},
//{
//timestamps: true
//}
//});

//const Address = sequelize.define('label', {
//userId: {
//type: Sequelize.INTEGER, allowNull: false, unique: true
//},
//type: {
//type: Sequelize.STRING
//},
//{
//timestamps: true
//}
//});

sequelize.sync();
