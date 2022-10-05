const router = require('express').Router();
const API_KEY = process.env.MAILGUN_API_KEY;
const DOMAIN = process.env.MAILGUN_DOMAIN;


const Mailgun = require('mailgun.js');
const formData = require('form-data');

const mailgun = new Mailgun(formData);

const client = mailgun.client({ username: API_KEY, key: DOMAIN });


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

  const messageData = {
    from: 'Bunzl Cleaning & Hygiene',
    to: `${email}`,
    subject: `${orderNumber}`,
    html: `<p>Hello ${clientName}, here is the list of the items that you need ${itemsList}</p>`
  };

  client.messages.create(DOMAIN, messageData)
    .then(res => {
      console.log(res)
    })
    .catch(err => {
      console.error(err)
    })

});


module.exports = router;
