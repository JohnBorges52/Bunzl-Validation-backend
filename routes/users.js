const router = require('express').Router();
const nodemailer = require("nodemailer");

const sid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
const twilio = require('twilio')(sid, authToken);

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
    from: process.env.PHONE_NUMBER,
    to: telephone,
    body: message
  })
    .then((res) => {
      console.log("msg has been sent")
    })
    .catch((e) => { console.log(e) })

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
