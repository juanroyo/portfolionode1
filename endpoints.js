const app = express()
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
