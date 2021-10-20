require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");
const path = require("path");

const app = express();
const port = 3000;

const { Map } = require("immutable");

const NasaRovers = Map({
  opportunity: Map({
    name: "Opportunity",
    about:
      "Opportunity, also known as MER-B or MER-1, and nicknamed 'Oppy', is a robotic rover that was active on Mars from 2004 until the middle of 2018",
    launchDate: "8 July 2003, 8:48 am IST",
    maxSpeed: "0.18 km/h",
    imageUrl: "./assets/opportunity.png",
  }),
  curiosity: Map({
    name: "Curiosity",
    about:
      "Curiosity is a car-sized rover designed to explore the crater Gale on Mars as part of NASA's Mars Science Laboratory mission. Curiosity was launched from Cape Canaveral on November 26, 2011, at 15:02 UTC and landed on Aeolis Palus inside Gale on Mars on August 6, 2012, 05:17 UTC.",
    launchDate: "26 November 2011, 8:32 pm IST",
    maxSpeed: "0.14 km/h",
    imageUrl: "./assets/curiosity.webp",
  }),

  spirit: Map({
    name: "Spirit",
    about:
      "Spirit, also known as MER-A or MER-2, is a robotic rover on Mars, active from 2004 to 2010. It was one of two rovers of NASA's Mars Exploration Rover Mission.",
    launchDate: "10 June 2003, 11:28 pm IST",
    maxSpeed: "0.18 km/h",
    imageUrl: "./assets/spirit.jpg",
  }),
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/", express.static(path.join(__dirname, "../public")));

//API CALLS-------------------------------------------
app.post("/roverInfo", async (req, res) => {
  try {
    res.send(NasaRovers.get(req.body.roverName));
  } catch (err) {
    console.log("error:", err);
  }
});

app.post("/fetchImage", async (req, res) => {
  try {
    const URL = `https://api.nasa.gov/mars-photos/api/v1/rovers/${req.body.roverName}/photos?sol=1000&api_key=${process.env.API_KEY}`;
    let data = await fetch(URL).then((res) => res.json());
    res.send(data.photos);
  } catch (err) {
    console.log("error:", err);
  }
});

app.listen(port, () => console.log(`App listening on port ${port}!`));
