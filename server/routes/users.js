const router = require('express').Router();

const users = ['Bob', 'Alex', 'Will', 'Tristan'];

module.exports = (db) => {
  // all routes will go here 
  router.post('/sendsms', (req, res) => {

    const sid = "ACafe9c39df5b4f4d142755262a0691bce";
    const authToken = "f8afcc4985deb5297131dafa922cdd87";
    const twilio = require('twilio')(sid, authToken);

    twilio.messages.create({
      from: "+17179876702",
      to: req.query.telephone,
      body: req.query.message
    })
      .then(res => res.send("message sent!")
      })
    .catch(err => {
      console.log(err)
    })








  res.json(users);
});

return router;
}

module.exports = router;
