import { randomUUID } from "node:crypto";
import { readFileSync } from "node:fs";
import { TransformStream } from "stream/web";
import { createSecureServer } from "node:http2";

import { serve } from "@hono/node-server";
import { Hono } from "hono";

import { Chatroom } from "./chatroom-hono";

function delay(delay: number) {
  return new Promise((res) => {
    setTimeout(() => {
      res("");
    }, delay);
  });
}

const chatroom = new Chatroom();

const app = new Hono();

app.get("/", () => {
  const address = randomUUID();

  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();

  chatroom.join(address, writer);
  writer.write("Welcome to the chatroom!\n");

  return new Response(readable);
});

app.post("/", async (c) => {
  const message = await c.req.text();
  chatroom.send(message);
  return new Response("message sent.");
});

serve({
  fetch: app.fetch,
  createServer: createSecureServer,
  serverOptions: {
    key: readFileSync("key.pem"),
    cert: readFileSync("cert.pem"),
  },
});
