import { Http2ServerResponse } from "http2";

type Client = {
  conn: Http2ServerResponse;
  last_message: Date | null;
};

class Chatroom {
  private clients: Map<string, Client> = new Map();

  constructor() {}

  join = (address: string, conn: Http2ServerResponse) => {
    this.clients.set(address, { conn, last_message: null });
  };

  send = (message: string) => {
    for (const [_, client] of Array.from(this.clients)) {
      console.log(this.clients);
      client.conn.write(`${message}\n`);
    }
  };

  leave = (address: string) => {
    this.clients.delete(address);
  };
}

export { Chatroom };
