const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

//Use this array as your (in-memory) data store.
const bookings = require("./bookings.json");

app.get("/", function (request, response) {
  response.send("Hotel booking server.  Ask for /bookings, etc.");
});

// TODO add your routes and helper functions here
app.get("/bookings", function (request, response) {
  response.send(bookings);
});

//Read one booking, specified by an ID
app.get('/bookings/:id', function(req, res) {
  if(isNaN( req.params.id)){
    res.send({
        "message": "undefined message"
    })
  }else{
 const message = bookings.find(u => u.id==req.params.id)
 if(message){
     res.send(message)
 }else{
     res.send({
         "message" : "Data Did Not Find"
     })
 }
  }
});

/// Delete user with ID//
app.delete('/bookings/:id', function(request, response) {
  let messageId = Number(request.params.id)
  let index = bookings.findIndex(message=> message.id === messageId)
  let deleted = bookings.splice(index, 1)
  response.json(bookings);
});

//create new  booking
app.post("/bookings", (req, res) => {
  let {
    title,
    firstName,
    surname,
    email,
    roomId,
    checkInDate,
    checkOutDate
  } = req.body;
  if (checkInDate => checkOutDate) {
    console.log("Your app is listening on port " + listener.address().port);	  
    res.send("Check-Out date should be later than Check-In date");
    } else if (
      title.length > 0 &&
      firstName.length > 0 &&
      surname.length > 0 &&
      email.length > 0 &&
      typeof roomId == "number" &&
      checkInDate.length > 0 &&
      checkOutDate.length > 0
    ) {
      bookings.push(req.body);
      res.send({ booking: "success" });
    } else {
      res.status(404).send("Please complete the booking form");
    }
  });


const listener = app.listen(process.env.PORT, function () {
  console.log("Your app is listening on port " + listener.address().port);
});

