// import { uuidv4 } from 'uuid';
const accountSid = "ACd12ba5a0f7d9acc4c22321fe7dac274f";
const authToken = "801131cd378eec5a7b7def5b9f481f13";
const client = require("twilio")(accountSid, authToken);
const express = require("express");
import * as dotenv from "dotenv";
const app = express();
dotenv.config();
app.use(express.json());
const MAIN_NUMBER = process.env.MAIN_NUMBER;
const MESSAGE_NUMBER = process.env.MESSAGE_NUMBER;
// Set up a Twilio webhook that will be called whenever a message is received on your `MAIN_NUMBER`.
// This webhook should be set up to forward incoming messages to your `MESSAGE_NUMBER`.
app.post("/incoming-message", (req: any, res: any) => {
  const sender = req.body.From;
  const message = req.body.Body;

  // Forward the incoming message to your `MESSAGE_NUMBER`.
  client.messages
    .create({
      body: `${sender}: ${message}`,
      from: MAIN_NUMBER,
      to: MESSAGE_NUMBER,
    })
    .then((message: any) => console.log(`Forwarded message: ${message.sid}`));
});

// Set up a Twilio webhook that will be called whenever a message is received on your `MESSAGE_NUMBER`.
// This webhook should be set up to forward incoming messages to the original sender (whose phone number is included in the message body).
app.post("/outgoing-message", (req: any, res: any) => {
  const recipient = req.body.To;
  const message = req.body.Body;

  // Get the original sender's phone number from the message body.
  const sender = message.split(":")[0];

  // Send a message back to the original sender.
  client.messages
    .create({
      body: message.split(":")[1].trim(),
      from: MESSAGE_NUMBER,
      to: sender,
    })
    .then((message: any) => console.log(`Sent message: ${message.sid}`));
});
export default app;
