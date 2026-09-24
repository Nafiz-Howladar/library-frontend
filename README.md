# Page & Pine Library

A responsive library catalog built with React and Vite. Browse, search, and filter books from the library backend, and sign in with a library account.

For this learning project, the access token is stored in `localStorage`, which is exposed to cross-site scripting (XSS) if the app has a script injection vulnerability.

## Run locally

```sh
npm install
npm run dev
```

## Environment

Set `VITE_API_URL` in `.env` to the backend base URL. Copy `.env.example` as a starting point. The books page reads the public `GET /book/all` endpoint.
