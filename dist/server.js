"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
// import { uuidv4 } from 'uuid';
const accountSid = "ACd12ba5a0f7d9acc4c22321fe7dac274f";
const authToken = "801131cd378eec5a7b7def5b9f481f13";
const client = require("twilio")(accountSid, authToken);
const express = require("express");
const dotenv = __importStar(require("dotenv"));
const app = express();
dotenv.config();
app.use(express.json());
const MAIN_NUMBER = process.env.MAIN_NUMBER;
const MESSAGE_NUMBER = process.env.MESSAGE_NUMBER;
// Set up a Twilio webhook that will be called whenever a message is received on your `MAIN_NUMBER`.
// This webhook should be set up to forward incoming messages to your `MESSAGE_NUMBER`.
app.post("/incoming-message", (req, res) => {
    const sender = req.body.From;
    const message = req.body.Body;
    // Forward the incoming message to your `MESSAGE_NUMBER`.
    client.messages
        .create({
        body: `${sender}: ${message}`,
        from: MAIN_NUMBER,
        to: MESSAGE_NUMBER,
    })
        .then((message) => console.log(`Forwarded message: ${message.sid}`));
});
// Set up a Twilio webhook that will be called whenever a message is received on your `MESSAGE_NUMBER`.
// This webhook should be set up to forward incoming messages to the original sender (whose phone number is included in the message body).
app.post("/outgoing-message", (req, res) => {
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
        .then((message) => console.log(`Sent message: ${message.sid}`));
});
exports.default = app;
//# sourceMappingURL=server.js.map