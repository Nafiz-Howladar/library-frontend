# Page & Pine Library

A responsive library catalog built with React and Vite. Browse, search, and filter books from the library backend, and sign in with a library account.

For this learning project, the access token is stored in `localStorage`, which is exposed to cross-site scripting (XSS) if the app has a script injection vulnerability.

## Run locally

```sh
npm install
npm run dev
```

## Environment

Copy `.env.example` to `.env` and set `VITE_API_URL` to the backend base URL (the included Vite proxy setup uses `/api`). Set `VITE_REGISTER_ROLE` to the role string accepted by the backend before registering; registration will not be sent while it is empty.

## Routes

- `/books` — public book catalog
- `/books/:id` — book details and reservation action
- `/login` and `/register` — account access
- `/dashboard`, `/my-books`, and `/reservations` — signed-in account pages

The catalog uses the public `GET /book/all` endpoint. The account pages use protected backend endpoints and display `N/A` for fields the backend response does not provide.

## Admin panel

The librarian role value is `librarian`. The role claim in the login token controls admin UI visibility only; the backend remains responsible for enforcing permissions. Librarians can manage books, issue books by manually entered user ID, process returns, and mark fines as paid. Reservation administration is a placeholder. There are no endpoints yet for listing all users or issues, so those records cannot be browsed and IDs must be entered manually.
