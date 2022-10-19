const pg = require('pg');
const router = require('express').Router();
const nodemailer = require("nodemailer");


const sid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
const twilio = require('twilio')(sid, authToken);

const dbConnectionString = process.env.ELEPHANT_DB_URL;

var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  }

});

// all routes will go here 
router.post('/sendsms', (req, res) => {

  const message = req.body.finalMessage;
  const telephone = req.body.telephone;

  twilio.messages.create({
    body: message,
    from: "+17179876702",
    to: telephone,
  })
    .then(message => console.log(message.sid))
    .catch(err => console.log(err))
});

router.post("/sendemail", (req, res) => {

  const { clientName, orderNumber, email, itemsList } = req.body;

  var mailOptions = {
    from: "contactpomodoroapp@gmail.com",
    to: email,
    subject: `Your Item(s) is/are ready!`,
    text: `
    Hello ${clientName}!
    Your backorder number: ${orderNumber} is ready for pick up.
    Here is a list of the items: ${itemsList}
    
    Thank you!`,
  };
  transporter.sendMail(mailOptions, (err) => {
    if (err) {
      console.log(err);

    } else {
      console.log("Email sent: ");
    }

  });

})


router.post("/userlogin", (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  var client = new pg.Client(dbConnectionString);

  client.connect((err) => {
    if (err) {
      return console.error('couldn\'t connect to postgres', err);
    }
    const userQuery = `SELECT * FROM users WHERE email = $1;`

    client.query(userQuery, [email])
      .then((data) => {
        // console.log(data.rows[0])
        if (data.rows.length === 0) {
          console.log("User not Found")
          res.send("User not Found")
        }
        if (data.rows.length !== 0 && data.rows[0].password !== password) {
          console.log("Wrong Password")
          res.send("Wrong Password")
        }
        if (data.rows.length !== 0 && data.rows[0].password === password) {
          res.json(data.rows);
        }
      })

  })

})




module.exports = router;
