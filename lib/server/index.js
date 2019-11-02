require("dotenv").config(); // load from .env

// main imports
const path = require("path");
const express = require("express");

// express middleware
const logger = require("morgan")("dev");
const compression = require("compression")();
const helmet = require("helmet");
const jsonParser = require("body-parser").json({ limit: "125mb" });
const api = require("./api");
const request = require("request");

// app constants
const app = express();
const pub = path.join(process.cwd(), "public"); // should be run with `yarn start`
const bld = path.join(process.cwd(), "build");
const port = process.env.PORT || 5000; // default to port 5000

// AZURE COGNITIVE
let subscriptionKey = process.env["subscriptionKey"];
let endpoint = process.env["endpoint"];

if (!subscriptionKey) {
  throw new Error(
    "Set your environment variables for your subscription key and endpoint."
  );
}

var uriBase = endpoint + "vision/v2.1/analyze";

// Request parameters.
const params = {
  visualFeatures: "Categories,Description,Color,Tags,Objects,Description",
  details: "",
  language: "en"
};

// const options = {
//     uri: uriBase,
//     qs: params,
//     body: '{"url": ' + '"' + imageUrl + '"}',
//     headers: {
//         'Content-Type': 'application/json',
//         'Ocp-Apim-Subscription-Key' : subscriptionKey
//     }
// };

// middleware ordering
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "fonts.googleapis.com"],
      fontSrc: ["fonts.gstatic.com"],
      imgSrc: ["'self'", "data:"]
    }
  })
);

app.use(helmet()); // secure requests
app.use(logger); // log everything
app.use(compression); // compress all resposnes
app.use(jsonParser); // enable POSTing JSON
app.use(express.static(pub)); // Anything in public/ or build/ will be found under "/"
app.use(express.static(bld));
app.use("/api", api); // handle all API requests after every other middleware

app.post("/images/test", function(req, res) {
  console.log(req.body);

  let imageUrl = req.body.url;

  let options = {
    uri: uriBase,
    qs: params,
    body: '{"url": ' + '"' + imageUrl + '"}',
    headers: {
      "Content-Type": "application/json",
      "Ocp-Apim-Subscription-Key": subscriptionKey
    }
  };

  request.post(options, (error, response, body) => {
    if (error) {
      console.log("Error: ", error);
      res.send(error);
      return;
    }
    let jsonResponse = JSON.stringify(JSON.parse(body), null, "  ");
    console.log("JSON Response\n");
    console.log(jsonResponse);
    res.send(jsonResponse);
  });
});

const decodeBase64Image = dataString => {
  const matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
  const response = {};

  if (matches.length !== 3) {
    return new Error("Invalid input string");
  }

  return Buffer.from(matches[2], "base64");
};

app.post("/images/base64", function(req, res) {
  //Step One (Inject Sams Imagine itno my API call)
  // console.log(req.body.image);
  let imageBase64 = decodeBase64Image(req.body.image);

  let options = {
    uri: uriBase,
    qs: params,
    body: imageBase64,
    headers: {
      "Content-Type": "application/octet-stream",
      "Ocp-Apim-Subscription-Key": subscriptionKey
    }
  };

  request.post(options, (error, response, body) => {
    if (error) {
      console.log("Error: ", error);
      return;
    }
    let jsonResponse = JSON.stringify(JSON.parse(body), null, "  ");
    console.log("JSON Response\n");
    console.log(jsonResponse);
    res.send(jsonResponse);
  });
});

app.use("*", (_, res) => res.sendFile(path.join(bld, "index.html"))); // in order to do SPA

app.listen(port, () => console.log(`Webserver listening on port ${port}`));
