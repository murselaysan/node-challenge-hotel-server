const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

var moment = require("moment");
moment().format();

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
app.get("/bookings/:id", function (req, res) {
  if (isNaN(req.params.id)) {
    res.send({
      message: "undefined message",
    });
  } else {
    const message = bookings.find((u) => u.id == req.params.id);
    if (message) {
      res.send(message);
    } else {
      res.send({
        message: "Data Did Not Find",
      });
    }
  }
});

/// Delete user with ID//
app.delete("/bookings/:id", function (request, response) {
  let messageId = Number(request.params.id);
  let index = bookings.findIndex((message) => message.id === messageId);
  let deleted = bookings.splice(index, 1);
  response.json(bookings);
});

//create new  booking
app.post("/bookings", (req, res) => {
  let newId = new Date().getTime();
  let newRoomId = bookings[bookings.length - 1].id + 1;

  let newBooking = {
    id: newId,
    title: req.body.title,
    firstName: req.body.firstName,
    surname: req.body.surname,
    email: req.body.email,
    roomId: newRoomId,
    checkInDate: req.body.checkInDate,
    checkOutDate: req.body.checkOutDate,
  };
  if (
    newBooking.checkInDate !== undefined &&
    newBooking.checkInDate.length > 0 &&
    newBooking.checkOutDate !== undefined &&
    newBooking.checkOutDate.length > 0 &&
    newBooking.title !== undefined &&
    newBooking.title.length > 0 &&
    newBooking.firstName !== undefined &&
    newBooking.firstName.length > 0 &&
    newBooking.surname !== undefined &&
    newBooking.surname.length > 0 &&
    newBooking.email !== undefined &&
    newBooking.email.includes("@") &&
    moment(newBooking.checkOutDate).isAfter(newBooking.checkInDate)
  ) {
    bookings.push(newBooking);
    // res.send("added")
    res.send("added");
  } else {
    res.send(" 400,bad request");
  }
});

app.get("/bookings/search", function (request, response) {
  const queryDate = request.query.date;
  const term = request.query.term;
  if (!term && !queryDate) {
    response.status(400).json("what are you doing here");
    return;
  }

  if (moment(queryDate, "YYYY-MM-DD", true).isValid()) {
    let result = bookings.filter(
      (booking) =>
        moment(queryDate).isBetween(
          booking.checkInDate,
          booking.checkOutDate
        ) ||
        moment(queryDate).isSame(booking.checkInDate) ||
        moment(queryDate).isSame(booking.checkOutDate)
    );
    result.length > 0
      ? response.send(result)
      : response.send("Not found a booking ton this date");
    return;
  } else if (queryDate) {
    response
      .status(400)
      .json('Please enter a valid date, format should like "YYYY-MM-DD"');
    return;
  }
  const searchTerm = bookings.filter((booking) =>
    `${booking.firstName} ${booking.surname} ${booking.email}`
      .toLowerCase()
      .includes(term.toLowerCase())
  );
  if (term && searchTerm.length > 0) {
    response.json(searchTerm);
  } else if (term) {
    response.status(400).json("Sorry we couldn't find your term");
  }
});

const listener = app.listen(process.env.PORT, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
