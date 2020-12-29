const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const session = require("client-sessions");
const router = require("./routes/index");
const app = express();

const corsOptions = {
  origin: true,
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "Access-Control-Allow-Methods",
    "Access-Control-Request-Headers"
  ],
  credentials: true,
  enablePreflight: true
};
app.use(cors(corsOptions));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, DELETE, PUT");
  next();
});

app.use(
  session({
    cookieName: "session",
    secret: "notguessablecookiekey",
    duration: 7200000,
    activeDuration: 300000,
    httpOnly: true,
    ephemeral: true
  })
);

app.use(bodyParser.json());

app.use("/api", router);

app.listen(process.env.PORT || 8081, () => {
  console.log("server started");
});
