(function() {
  "use strict";

  // require("dotenv").config();
  const express = require("express");
  const app = express();
  const http = require("http");
  const fs = require("fs");
  const cors = require("cors");
  const mongoose = require("mongoose");
  const cookieParser = require("cookie-parser");
  // const bodyParser = require("body-parser");
  const config = require("./config/config.js");
  const modelsPath = __dirname + "/app/models/";

  app.use(function(req, res, next) {
    var responseSettings = {
      AccessControlAllowOrigin: req.headers.origin,
      AccessControlAllowHeaders:
        "Content-Type,X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5,  Date, X-Api-Version, X-File-Name",
      AccessControlAllowMethods: "POST, GET, PUT, DELETE, OPTIONS",
      AccessControlAllowCredentials: true
    };
    res.header(
      "Access-Control-Allow-Credentials",
      responseSettings.AccessControlAllowCredentials
    );
    res.header(
      "Access-Control-Allow-Origin",
      responseSettings.AccessControlAllowOrigin
    );
    res.header(
      "Access-Control-Allow-Headers",
      req.headers["access-control-request-headers"]
        ? req.headers["access-control-request-headers"]
        : "x-requested-with"
    );
    res.header(
      "Access-Control-Allow-Methods",
      req.headers["access-control-request-method"]
        ? req.headers["access-control-request-method"]
        : responseSettings.AccessControlAllowMethods
    );
    if (req.method === "OPTIONS") {
      res.send(200);
    } else {
      next();
    }
  });

  app.set(
    "port",
    process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 5000
  );
  app.set(
    "ipaddr",
    process.env.HOSTNAME || process.env.OPENSHIFT_NODEJS_IP || "localhost"
  );

  fs.readdirSync(modelsPath).forEach(function(file) {
    require(modelsPath + "/" + file);
  });

  app.use(cors());
  app.use(cookieParser());

  const mainDB = mongoose.createConnection(config.db_main, {
    useNewUrlParser: true
  });
  mainDB.on("error", function(err) {
    if (err) {
      console.log("MainDB");
      console.log(err);
    }
  });
  mainDB.once("open", function callback() {
    console.info("CLIENT DB connected successfully");
  });

  module.exports = {
    main: mainDB
  };

  require("./app/covid/covid.route")(app);
  // require("./app/routes/floorsData.route")(app);
  // require("./app/routes/payments.route")(app);
  // require("./app/routes/duration.route")(app);
  // require("./app/routes/photo.route")(app);
  // require("./app/routes/rentSettings.route")(app);
  // require("./app/routes/description.route")(app);
  // require("./app/routes/buildings.route")(app);
  // require("./app/routes/userChoice.route")(app);
  // require("./app/routes/person.route")(app);
  // require("./app/routes/calendars.route")(app);
  // require("./app/routes/stripe.route")(app);

  const httpServer = http.createServer(app);

  httpServer.listen(app.get("port"), function() {
    console.log("Magic happens on port " + app.get("port"));
  });
})();
