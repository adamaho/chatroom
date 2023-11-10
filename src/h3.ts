import { createApp, eventHandler, readBody, sendStream, toNodeListener } from "h3";

import { createServer } from "node:http";
import { TransformStream } from "node:stream/web";
import { randomUUID } from "node:crypto";

import { Chatroom } from "./chatroom-fetch";

const app = createApp();

const chatroom = new Chatroom();

app.use(
  "/",
  eventHandler(async (event) => {
    const method = event.method;

    if (method === "GET") {
      const address = randomUUID();
      const { readable, writable } = new TransformStream();
      const writer = writable.getWriter();

      chatroom.join(address, writer);
      writer.write("Welcome to the chatroom!\n");

      sendStream(event, readable);
    } else if (method === "POST") {
      const message = await readBody<string>(event);
      chatroom.send(message);
      return "Message sent";  
    }
  }),
);

createServer(toNodeListener(app)).listen(process.env.PORT || 3000);
