const express = require("express");
var path = require('path');
const fs = require('fs');
const app = express();


correctPath = path.join(__dirname, 'testquake.json');
console.log(correctPath);

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS"
  );
  next();
});

app.use("/api/quakedata", (req, res, next) => {
  let rawdata = fs.readFileSync(correctPath);
  let quakedata = JSON.parse(rawdata);
  // console.log(quakedata);

  res.status(200).json({
    // message: "quake data fetched succesfully!",
    quakedata: quakedata
  });


});

module.exports = app;
