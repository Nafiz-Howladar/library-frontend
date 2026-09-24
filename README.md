# Page & Pine Library

A responsive library catalog built with React and Vite. Browse, search, and filter books from the library backend. The login page is a UI preview and is not connected to authentication.

## Run locally

```sh
npm install
npm run dev
```

## Environment

Set `VITE_API_URL` in `.env` to the backend base URL. Copy `.env.example` as a starting point. The books page reads the public `GET /book/all` endpoint.
