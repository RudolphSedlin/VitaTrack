// This file should set up the express server as shown in the lecture code
// Just a copy-paste of the lecture code to initialize the server, we are still on localhost port 3000.
import express from 'express';
const app = express();
app.use(express.json());
import configRoutesFunction from './routes/index.js';

configRoutesFunction(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:3000');
});
