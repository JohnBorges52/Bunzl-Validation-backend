var sid = "ACafe9c39df5b4f4d142755262a0691bce";
var authToken = "0b083d40598f1f2a19b2ff0590eb4bce";

var twilio = require('twilio')(sid, authToken);

twilio.messages.create({
  from: "+17179876702",
  to: "+12365081635",
  body: "Testando aqui Thamara"

})
  .then(res => {
    console.log("message sent!")
  })
  .catch(err => {
    console.log(err)
  })
