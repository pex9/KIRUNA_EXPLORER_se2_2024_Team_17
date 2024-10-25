# KIRUNA_EXPLORER_se2_2024_Team_17
## How to run the Web app
To run the web app refer to the following step:
(Note: VS Code is used as a reference IDE)

- Open two terminals (reffered to as 'terminal 1' and 'terminal 2')

- In terminal 1, type the following commands:
  - `cd server`
  - `npm i`
  - `nodemon index.mjs` (to start the server)
- In terminal 2, type the following commands:
  - `cd client`
  - `npm i`
  - `npm run dev` (to start the client)

- Open a browser window, in the URL field, type `http://localhost:5173/` and press Enter. The client is loaded. The user can interact with the server through the client.

## How to test the backend API's app

- Open a terminal

- In the terminal, type the following commands:
  - `cd server`
  - Decide what you want to test between users,documents then run the appropriate command (for example, to test users):
    - `npm test users`
  - You will see the total time taken to execute these tests and the different API calls.

  ## React Client Application Routes

- Route `/`: Home page of the kiruna explorer
- Route `/login`: Login page to access as urban planner
- Route `/*`: default route for routes that don't exist

## API Server

### Authentication

- POST `/api/sessions`
    - Description: Unauthenticated, creates a new session.
    - Request: The body contains an object with authentication credentials (Content-Type: `application/json`).

    ```json
    {
            "username": "mario@test.it",
            "password": "pwd"
    }
    ```

    - Response: returns `200 OK` (success), `401 Unauthorized` (wrong credentials) or `500 Internal Server Error` (generic error). In case of success, the body contains an object with the authenticated user's information (Content-Type: `application/json`).

- DELETE `/api/sessions/current`
    - Description: Authenticated, deletes the current session.
    - Request: No body.
    - Response: returns `200 OK` (success), `401 Unauthorized` (unauthenticated user) or `500 Internal Server Error` (generic error). No body.

- GET `/api/sessions/current`
    - Description: Authenticated, verifies that the current session is still valid and returns the authenticated user's information.
    - Request: No body.
    - Response: returns `200 OK` (success) or `401 Unauthorized` (unauthenticated user).
    - Response body: In case of success, the body contains an object with the information of the user associated with the current session (Content-Type: `application/json`).

    ```json
    {
            "id": 2,
            "username": "mario@test.it",
            "name": "Mario"
    }
    ```

## Database Tables



## Main React Components


## Screenshot
