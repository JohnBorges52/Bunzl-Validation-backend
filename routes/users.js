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

const randomPswGenerator = () => {
  let char = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  let result = ''
  for (let i = 0; i < 6; i++) {
    result += char.charAt(Math.floor(Math.random() * char.length))
  }
  return result
}


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

router.post("/forgot-password", (req, res, next) => {

  const newPsw = randomPswGenerator()
  const email = req.body.email;
  var client = new pg.Client(dbConnectionString);


  client.connect((err) => {
    if (err) {
      return console.error('couldn\'t connect to postgres', err);
    }
    const userQuery = `SELECT * FROM users WHERE email = $1;`
    const changePassword = `UPDATE users SET password = $1 WHERE email = $2`

    client.query(userQuery, [email])
      .then((data) => {
        if (data.rows.length === 0) {
          console.log("User not Found")
          res.send("User not Found")
        } else {
          client.query(changePassword, [newPsw, email])
            .then((data) => {
              console.log(data.rows);
              console.log("Code Sent");

              const mailOptions = {
                from: "contactpomodoroapp@gmail.com",
                to: email,
                subject: `Password Change`,
                text: `
              Hello ${email}!

              Your password has been changed. Here is the new code to change to a new one: ${newPsw}.

              Thank you!`,

              }
              transporter.sendMail(mailOptions, (err) => {
                if (err) {
                  console.log(err);

                } else {
                  console.log("Email sent: ");
                }

              });
              res.send("Code Sent")
            })

        }
      })
  })
})

router.post("/change-password", (req, res, next) => {
  const email = req.body.email
  const code = req.body.code
  const password = req.body.password

  var client = new pg.Client(dbConnectionString);


  client.connect((err) => {
    if (err) {
      return console.error('couldn\'t connect to postgres', err);
    }
    const userQuery = `SELECT * FROM users WHERE email = $1;`
    const changePassword = `UPDATE users SET password = $1 WHERE email = $2`

    client.query(userQuery, [email])
      .then((data) => {
        if (data.rows.length === 0) {
          console.log("User not Found")
          res.send("User not Found")
        } if (data.rows.length !== 0 && data.rows[0].password !== code) {
          console.log("Wrong Code")
          res.send("Wrong Code")
        } if (data.rows.length !== 0 && data.rows[0].password === code) {
          client.query(changePassword, [password, email])
            .then((res) => {
              res.send("Password updated")
            })

        }



      })


  })

})


module.exports = router;
