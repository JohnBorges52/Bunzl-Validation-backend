const router = require('express').Router();

// all routes will go here 
router.post('/sendsms', (req, res) => {

  const message = req.body.finalMessage;
  const telephone = req.body.telephone;

  console.log(message)
  console.log(telephone)

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


module.exports = router;
