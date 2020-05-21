
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


const url = "mongodb+srv://juanar:KELi1aO0zTS5pF1v@cluster0-axx5n.mongodb.net/test?retryWrites=true&w=majority";
const MONGODB_URI = "mongodb+srv://juanar:KELi1aO0zTS5pF1v@cluster0-axx5n.mongodb.net/test?retryWrites=true&w=majority";
const db = process.env.MONGODB_URI;



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json({ type: 'application/json' }));
corsOptions = {
  origin: "https://zylenstudio.herokuapp.com",
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};
app.use(cors(corsOptions));


app.set('view engine', 'ejs');

const dbName = 'mydb'
var serveroption = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  connectWithNoPrimary: false,
  connectTimeoutMS: 30000
}
MongoClient.connect(db, serveroption,  async function(err, client) {

  assert.equal(null, err);
  console.log("Connected successfully to server");

  const db = client.db(dbName);
app.set('db', require('./endpoints.js'));
//-------------CART----------------
async function cartpProcess (req, res) {

     const {product, token} = req.body;
     console.log("PRODUCT", product.title);
     console.log("PRICE", product.total);
     const idempontencyKey = uuidv4()
     return stripe.customers.create({
       email: token.email,
       source: token.id
     }).then(customer => {
       stripe.charges.create({
         amount: product.total * 100,
         currency: 'eur',
         customer: customer.id,
         //email: token.email,
         description: product.title,

       }).catch(err => console.log(err))
     }).then(function sendEmail() {
       var products = req.body;
       JSON.stringify(products)
       var productosParaEnviar = products.product.addedItems;
       var ids = []
       productosParaEnviar.map(function(item, index) {
         return ids = item._id
         })

       console.log("hola"+ids)
       console.log("PRICE", productosParaEnviar);
       console.log("this is the function!")

      var emailAddress = token.email;
      var bodyMessage = '<table>';
      var mail = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'ju.val.roy@gmail.com',
          pass: 'Manolito.1'
        }
      });
       var mailOptions = {
          from: 'ju.val.roy@gmail.com',
          to: emailAddress,
          subject: 'Sending Email using Node.js',
          html: `<td><h1>thanks for buying ${productosParaEnviar.map(function(item, index) {
            return item.title
          })}, ${productosParaEnviar.map(function(item, index) {
            return item.genre
          })}, ${productosParaEnviar.map(function(item, index) {
            return item.quantity
          })}, ${productosParaEnviar.map(function(item, index) {
            return item.img
          })}, ${productosParaEnviar.map(function(item, index) {
            return `<a href="${item.download}" download>Download Here
          <a/> `})}
          , price ${product.total}</h1></td><td><p>That was easy!</p></td>`
        }
        mail.sendMail(mailOptions, function(error, info){
          if (error) {
            console.log(error);
          } else {
            console.log('Email sent: ' + info.response);
          }
        })
      }).then(

       function(err, db) {
          if (err) throw err;
          var dbo = db.db("mydb");

          var payment = {
            email: token.email,
            products: req.body.product.addedItems,
            total: product.total
          };
          dbo.collection("Payments").insertOne(payment, function(err, result) {
            if (err) throw err;
            console.log(result)
            res.json(result);

          })
        }).then(result =>  res.status(200).json(result))
     .catch(err => console.log(err))
}
app.post("/cart", cartpProcess);

client.close();
});
