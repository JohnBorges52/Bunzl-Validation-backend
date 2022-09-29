var sid = "ACafe9c39df5b4f4d142755262a0691bce";
var authToken = "f8afcc4985deb5297131dafa922cdd87";

var twilio = require('twilio')(sid, authToken);

twilio.messages.create({
  from: "+17179876702",
  to: "+12365082985",
  body: "Testing twilio message"

})
  .then(res => {
    console.log("message sent!")
  })
  .catch(err => {
    console.log(err)
  })
