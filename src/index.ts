import { createSecureServer } from "node:http2";
import { randomUUID } from "node:crypto";
import { readFileSync } from "node:fs";

import { Chatroom } from "./chatroom";

const options = {
  key: readFileSync("key.pem"),
  cert: readFileSync("cert.pem"),
};

const chatroom = new Chatroom();

const server = createSecureServer(options, (req, res) => {
  const address = randomUUID();

  req.on("close", () => {
    if (req.method === "GET") {
      console.log(`user ${address} left.`);
      chatroom.leave(address);
      res.end();
    }
  });

  req.on("data", (buffer) => {
    const message = buffer.toString();
    chatroom.send(message);
  });

  if (req.method === "GET") {
    console.log(`user ${address} joined.`);
    chatroom.join(address, res);
    res.write("Welcome to the chatroom!\n");
  } else if (req.method === "POST") {
    req.read();
    res.end();
  }
});

server.listen(3000);
