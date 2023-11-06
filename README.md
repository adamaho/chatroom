# chatroom

implements an http2 streaming chatroom using nodejs http2 server and honojs.

## development

1. generate certs

```
mkcert localhost
```

2. run the server
    a. run node version
        ```
        pnpm dev
        ```
    b. run hono version
        ```
        pnpm hono
        ```

## node

implemented using the raw request / response event lifecycle.

## hono

uses the fetch implementation of request / response and responds with a ReadableStream that is written to via a TransformStream.