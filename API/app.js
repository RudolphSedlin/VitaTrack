// Set up an express server that we will use to recieve client requests.

import express from "express";
import session from "express-session";
const app = express();
import configRoutes from "./routes/index.js";
import { fileURLToPath } from "url";
import { dirname } from "path";
import crypto from "crypto";

app.use(express.json({limit: '10mb'}));
app.use(express.urlencoded({ extended: true, limit: '10mb'})); // Necessary for larger payloads with image data.

app.use(
  session({
    name: "AuthState",
    secret: crypto.randomBytes(64).toString('hex'),
    saveUninitialized: false,
    resave: false,
    rolling: true,
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000
      // To whom it may concern, DO NOT ADD secure:true. By default HTTPS is secure anyways, and HTTP breaks with it on.
    },
  })
);

app.use(async (req, res, next) => {
  let currTime = new Date().toUTCString();
  let reqMethod = req.method;
  let reqRoute = req.originalUrl;
  let auth = "Non-Authenticated User";
  if (req.session.user) {
    auth = "Authenticated User";
  }

  console.log(`[${currTime}]: ${reqMethod} ${reqRoute} (${auth})`);
  next();
});

configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log("Your routes will be running on http://localhost:3000");
});
