(function () {
  "use strict";

  const express = require("express");
  const app = express();
  const http = require("http");
  const cors = require("cors");
  const cookieParser = require("cookie-parser");
  const bodyParser = require('body-parser')

  app.use(express.static(__dirname + "/public"));
  app.use(bodyParser.urlencoded())
  app.use(bodyParser.json())

  app.set(
    "port",
    process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 5000
  );
  app.set(
    "ipaddr",
    process.env.HOSTNAME || process.env.OPENSHIFT_NODEJS_IP || "localhost"
  );

  app.get("/", function (req, res) {
    // Sending our HTML file to browser.
    res.sendFile(__dirname + "/index.html");
  });

  app.use(cors());
  app.use(cookieParser());

  require("./app/machine_learning/machine_learning.route")(app);

  const httpServer = http.createServer(app);

  httpServer.listen(app.get("port"), function () {
    console.log("Magic happens on port " + app.get("port"));
  });
})();
