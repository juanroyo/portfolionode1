const emailp = process.env.EMAILP;
const express = require('express')
const app = express()
const http = require('http')
const readline = require('readline');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const PORT = process.env.PORT || 5000;
const stripe = require("stripe")("sk_test_qi9RJCWRFOU6Ry4X8m1kvNad002D09YcIO")
const { v4: uuidv4 } = require('uuid');
const cors = require("cors")
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')
const { createProxyMiddleware } = require('http-proxy-middleware');
const MongoClient = require('mongodb').MongoClient;
const mongoose = require('mongoose');
const router = express.Router();
//var url = "mongodb://localhost:27017/";
const assert = require('assert');

const url = "mongodb+srv://juanar:KELi1aO0zTS5pF1v@cluster0-axx5n.mongodb.net/test?retryWrites=true&w=majority";
const MONGODB_URI = "mongodb+srv://juanar:KELi1aO0zTS5pF1v@cluster0-axx5n.mongodb.net/test?retryWrites=true&w=majority";
const db = process.env.MONGODB_URI;


async function sendEmail(req, res) {
  var emailAddress = req.body.email;
  var message =  req.body.textarea;
  //var total = req.body.total;
  console.log("this is the function!")

 var mail = nodemailer.createTransport({
   service: 'gmail',
   auth: {
     user: 'ju.val.roy@gmail.com',
     pass: 'Manolito.1'
   }
 });
  var mailOptions = {
     from:  emailAddress,
     to: 'ju.val.roy@gmail.com',
     subject: 'Sending Email using Node.js',
     html: `<td><p>${message}</p></td><td><p>That was easy!${emailAddress}</p></td>`
   }
   mail.sendMail(mailOptions, function(error, info){
     if (error) {
       console.log(error);
     } else {
       console.log('Email sent: ' + info.response);
     }
   });
 }
app.post('/contact', sendEmail,

        function(err, db) {
    if (err) throw err;
    console.log("hola" + req.body);
    var dbo = db.db("mydb");
    var myobj = {
          email: req.body.email,
          textarea: req.body.textarea
          };
 dbo.collection("Messages").insertOne(myobj, function(err, result) {
      if (err) throw err;
      console.log("1 document inserted");
      res.json(result);
      db.close();

})
}
);

//-------------SHOP-----------------
async function shopPost(req, res) {
  var dbo = db.db("mydb");

  return await dbo.collection("Albums").find({}).toArray(function(err, result) {
    if (err) throw err;

    res.json(result);

  });
}

app.get('/shop', shopPost);
async function offersGet(req, res) {

    var dbo = db.db("mydb");

  return await dbo.collection("Offers").find({}).toArray(function(err, result) {
      if (err) throw err;

      res.json(result);

    });
}
app.get('/offers', offersGet);

async function loginGet(req, res) {
  var dbo = db.db("mydb");

  return await dbo.collection("Payments").find({}, { projection: { _id: 1, email: 1, products: 1,  total: 1 } }).toArray(function(err, result) {
    if (err) throw err;

    res.json(result);

  });
  }

app.get('/login', loginGet);
