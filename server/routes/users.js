const router = require('express').Router();
// const apiKey = process.env.MAILGUN_API_KEY;
// const DOMAIN = process.env.MAILGUN_DOMAIN;


// const Mailgun = require('mailgun.js');
// const formData = require('form-data');

// const mailgun = new Mailgun(formData);

// const client = mailgun.client({ username: apiKey, key: DOMAIN });


const nodemailer = require("nodemailer");

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



  const sid = process.env.ACCOUNT_SID;
  const authToken = process.env.AUTH_TOKEN;
  const twilio = require('twilio')(sid, authToken);

  twilio.messages.create({
    from: process.env.PHONE_NUMBER,
    to: telephone,
    body: message
  })

  res.send(message)

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

module.exports = router;
