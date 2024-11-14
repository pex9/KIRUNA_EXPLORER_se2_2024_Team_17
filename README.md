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

## Docker 

# How to Launch the Kiruna Explorer Application

You can launch the Kiruna Explorer application using the image provided in docker.

## Running the Application Using Docker Compose 

This method uses Docker Compose to link two containers (client and server) for the application.

### Steps:

1. **Clone the repository**:
    ```bash
    git clone repourl
    ```
2. **Run Docker Compose**:

    ```bash
    docker-compose up -d
    ```
You will see the kiruna explore at address: http://localhost:5173/


## Notes
- Ensure you have Docker and Docker Compose installed on your machine.
- Make sure you're logged into Docker Hub before pushing images:

    ```bash
    docker login
    ```

- You can stop the application with:

    ```bash
    docker-compose down
    ```

This setup will link the client and server containers, allowing the application to run seamlessly.



Nb we pushed the server and client images using this command: `docker build -t my-node-app .`


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
- Route `/addDocument`: Route for adding a document.
- Route `/documents`: Route for showing the documents.
- Route `/documents/modify-document/:documentId`: Route for modifying the document given the id.
- Route `/documents/create-document`: Route for create a document with all fields.

## API Server

### USER API

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
    "email": "mario@test.it",
    "name": "Mario",
    "surname": "Test",
    "role": "Urban Planner"
  }
  ```

## DOCUMENT API

- POST `/api/documents`

  - Description: Allows the authenticated user to upload a new document to the system. This endpoint validates the user’s authorization level to ensure they have permission to add documents.
  - Request: The request body should contain a JSON object with the document's metadata.

    ```json
    {
      "title": "Sample Title",
      "idStakeholder": 1,
      "scale": "National",
      "issuance_Date": "04/2019",
      "language": "English",
      "pages": 50,
      "description": "A description for the document",
      "idType": 2,
      "locationType": "Point",
      "latitude": 19,
      "longitude": 23,
      "area_coordinates": ""
    }
    ```

  - Response: returns `201 Created OK` (created) or `400 Bad Request` (invalid data ) or `401 Unauthorized` (If the user is unauthenticated or lacks sufficient permissions) or `500 Internal Server Error `If an unexpected error occurs.
  - Response Body: On success (`201 Created`), the body contains an object with the details of the created document.
    ```json
    {
      "documentId": 123,
      "title": "Sample Title",
      "idStakeholder": 1,
      "scale": "National",
      "issuance_Date": "04/2019",
      "language": "English",
      "pages": 50,
      "description": "A description for the document",
      "idType": 2,
      "idLocation": 1
    }
    ```

- GET `/api/documents`
  - Description: Allows all user to get all documents of the system.
  - Request: No request.
  - Response: returns `200 OK` (created) or `400 Bad Request` (invalid data ) or `500 Internal Server Error `If an unexpected error occurs.
  - Response Body: On success (`200 OK`), the body contains an array of objects with the details of the documents.
    ```json
    [
      {
        "documentId": 123,
        "title": "Sample Title",
        "idStakeholder": 1,
        "scale": "National",
        "issuance_Date": "04/2019",
        "language": "English",
        "pages": 50,
        "description": "A description for the document",
        "idType": 2,
        "idLocation": 2
      },
      {
        "documentId": 124,
        "title": "Sample Title v2",
        "idStakeholder": 1,
        "scale": "National",
        "issuance_Date": "04/2019",
        "language": "English",
        "pages": 44,
        "description": "A description for the document v2",
        "idType": 2,
        "idLocation": 1
      }
    ]
    ```
- GET `/api/documents/:documentId`
  - Description: Allows all user to get the document of the system by giving id.
  - Request: No request.
  - Response: returns `200 OK` (created) or `400 Bad Request` (invalid data ) or `500 Internal Server Error `If an unexpected error occurs or `404 Not Found`.
  - Response Body: On success (`200 OK`), the body contains the object with the details of the documents.
    ```json
    {
      "documentId": 123,
      "title": "Sample Title",
      "idStakeholder": 1,
      "scale": "National",
      "issuance_Date": "04/2019",
      "language": "English",
      "pages": 50,
      "description": "A description for the document",
      "idType": 2,
      "idLocation": 1
    }
    ```
- **POST** `/api/documents/:documentId/resources`

  - **Description**: Allows users to upload a file for a specific document, given its `documentId`.
  - **Request**:
    - **URL Parameter**: `documentId` (integer) - the unique ID of the document to which the resource will be associated.
    - **Body**: `multipart/form-data` (file upload). The file will be uploaded using the field name `file`.
      - Example Body:
        ```bash
        Content-Type: multipart/form-data
        {
            file: <file_to_upload>
        }
        ```
  - **Response**: returns `200 OK`: File uploaded successfully or `400 Bad Request`: If no file is uploaded or required parameters are missing or `404 Not Found`: If the document with the given `documentId` does not exist. or `500 Internal Server Error`: If an unexpected error occurs.
  - **Response Body**: On success (`200 OK`), the body contains a message with the details of the uploaded file.
    ```json
    {
      "message": "File uploaded successfully!",
      "documentId": 1,
      "filename": "file1234_20241110_145302.pdf"
    }
    ```

- GET `/api/documents/:documentId/resources`

  - **Description**: Allows user to get the resources of the document of the system by giving id
  - **Request**: No request.
  - **Response**: returns `200 OK` (created) or `400 Bad Request` (invalid
    data ) or `500 Internal Server Error `If an unexpected error occurs or `404 Not Found` If the document with the given `documentId` does not exist.
  - **Response Body**: On success (`200 OK`), the body contains the object with the details of the resources of the document.

    ```json
    [
      {
        "documentId": 18,
        "filename": "18_20241110_201804.pdf",
        "url": "/uploads/18/18_20241110_201804.pdf"
      }
    ]
    ```

# DOCUMENT CONNECTION API

- GET `/api/document-connections`

  - Description: lists all document connection entries in the table.

  - Request: No Body.
  - Response: returns `200 OK` (success) or `500 Internal Server Error` If an unexpected error occurs.
  - Response body in case of success :

  ```json
  [
    {
      "IdConnectionDocuments": 1,
      "IdDocument1": 1,
      "IdDocument2": 2,
      "IdConnection": 1
    }
  ]
  ```

- GET `/api/document-connections/:idDocument`

  - Description: return all the connections for specific document.

  - Request: No Body.
  - Response: returns `200 OK` (success) or `500 Internal Server Error` If an unexpected error occurs.
  - Response body in case of success :

  ```json
  [
    {
      "IdConnectionDocuments": 1,
      "IdDocument1": 1,
      "IdDocument2": 2,
      "IdConnection": 1
    }
  ]
  ```

- POST `/api/document-connections`

  - Description: Creates a connection between two documents in the system. This endpoint validates that the user has urban planner permissions and ensures documents can be properly linked.
  - Request: The request body should contain a JSON object with the connection details.

    ```json
    {
      "IdDocument1": 1,
      "IdDocument2": 2,
      "IdConnection": 1
    }
    ```

  - Response: returns `201 Created OK` (created) or `400 Bad Request` (invalid data ) or `401 Unauthorized` (If the user is unauthenticated or lacks sufficient permissions) or `500 Internal Server Error `If an unexpected error occurs.

  - Response Body: On success (`201 Created`), returns the created connection

    ```json
    {
      "id": 1,
      "IdDocument1": 1,
      "IdDocument2": 2,
      "IdConnection": 1
    }
    ```

# LOCATION API

- GET `/api/locations`

  - **Description**: Retrieves a list of all locations.
  - **Request**: No request body required.
  - **Response**: Returns `200 OK` with a JSON array of locations if successful, or `500 Internal Server Error` if an unexpected error occurs.
  - **Response Body on Success**:
    ```json
    [
      {
        "IdLocation": 1,
        "LocationType": "Point",
        "Latitude": 45.0,
        "Longitude": 9.0,
        "AreaCoordinates": null
      }
    ]
    ```

- GET `/api/locations/:locationId`

  - **Description**: Retrieves a specific location by its ID.
  - **Request Parameters**:
    - `locationId` (Number, required): The ID of the location to retrieve.
  - **Response**: Returns `200 OK` with the location data if found, `404 Not Found` if the location does not exist, or `500 Internal Server Error` if an unexpected error occurs.
  - **Response Body on Success**:
    ```json
    {
      "IdLocation": 1,
      "LocationType": "Point",
      "Latitude": 45.0,
      "Longitude": 9.0,
      "AreaCoordinates": null
    }
    ```

- POST `/api/locations`

  - **Description**: Creates a new location entry.
  - **Authorization**: Requires `isUrbanPlanner` authorization.
  - **Request Body**:
    - `locationType` (String, required): The type of location (`"Point"` or `"Area"`).
    - `latitude` (Number, required if `locationType` is `"Point"`): The latitude of the location.
    - `longitude` (Number, required if `locationType` is `"Point"`): The longitude of the location.
    - `areaCoordinates` (String, required if `locationType` is `"Area"`): The area coordinates in string format.
  - **Response**: Returns `201 Created` with a success message if the location is created, or `400 Bad Request` if validation fails, or `500 Internal Server Error` if an error occurs.
  - **Response Body on Success**:
    ```json
    {
      "message": "Location added successfully."
    }
    ```

- PATCH `/api/locations/:locationId`

  - **Description**: Updates an existing location by its ID.
  - **Authorization**: Requires `isUrbanPlanner` authorization.
  - **Request Parameters**:
    - `locationId` (Number, required): The ID of the location to update.
  - **Request Body**:
    - `locationType` (String, required): The type of location (`"Point"` or `"Area"`).
    - `latitude` (Number, required if `locationType` is `"Point"`): The latitude of the location.
    - `longitude` (Number, required if `locationType` is `"Point"`): The longitude of the location.
    - `areaCoordinates` (String, required if `locationType` is `"Area"`): The area coordinates in string format.
  - **Response**: Returns `200 OK` with a success message if the location is updated, `404 Not Found` if the location does not exist, `400 Bad Request` if validation fails, or `500 Internal Server Error` if an error occurs.
  - **Response Body on Success**:
    ```json
    {
      "message": "Location updated successfully."
    }
    ```

# Stakeholder API

- GET`/api/stakeholders`

  - **Description**: Retrieves a list of all stakeholders.
  - **Request**: No request body required.
  - **Response**: Returns `200 OK` with a JSON array of stakeholders if successful, or `500 Internal Server Error` if an unexpected error occurs.
  - **Response Body on Success**:
    ```json
    [
      {
        "IdStakeholder": 1,
        "Name": "Municipality",
        "Color": "#8C6760"
      }
    ]
    ```

- GET `/api/stakeholders/:stakeholderid`

  - **Description**: Retrieves a specific stakeholder by their ID.
  - **Request Parameters**:
    - `stakeholderid` (Number, required): The ID of the stakeholder to retrieve.
  - **Response**: Returns `200 OK` with the stakeholder data if found, `404 Not Found` if the stakeholder does not exist, or `500 Internal Server Error` if an unexpected error occurs.
  - **Response Body on Success**:
    ```json
    {
      "IdStakeholder": 1,
      "Name": "Municipality",
      "Color": "#8C6760"
    }
    ```

# TYPEDOCUMENT API

- GET `/api/types`

  - **Description**: Retrieves a list of all document types.
  - **Request**: No request body required.
  - **Response**: Returns `200 OK` with a JSON array of document types if successful, or `500 Internal Server Error` if an unexpected error occurs.
  - **Response Body on Success**:
    ```json
    [
      {
        "IdType": 1,
        "Name": "Report",
        "Description": "A detailed report document type."
      }
    ]
    ```

- GET `/api/types/:typeid`

  - **Description**: Retrieves a specific document type by its ID.
  - **Request Parameters**:
    - `typeid` (Number, required): The ID of the document type to retrieve.
  - **Response**: Returns `200 OK` with the document type data if found, `404 Not Found` if the type does not exist, or `500 Internal Server Error` if an unexpected error occurs.
  - **Response Body on Success**:
    ```json
    {
      "IdType": 1,
      "Name": "Report",
      "Description": "A detailed report document type."
    }
    ```

## Database Tables

**User**

- **IdUser**: Unique identifier for the user
- **Email**: Unique email address of the user
- **PasswordHash**: Hashed password of the user
- **Salt**: Unique salt for password hashing
- **Role**: Role of the user (e.g., Admin, Editor)
- **Name**: First name of the user
- **Surname**: Last name of the user

**Stakeholder**

- **IdStakeholder**: Unique identifier for each stakeholder
- **Name**: Name of the stakeholder
- **Color**: Hex color code representing the stakeholder (e.g., `#FFFFFF`)

**Location**

- **IdLocation**: Unique identifier for each location
- **Location_Type**: Type of location (e.g., `point` or `area`)
- **Latitude**: Latitude coordinate (for point locations)
- **Longitude**: Longitude coordinate (for point locations)
- **Area_Coordinates**: Array of coordinate pairs forming an area (used if location is an area)

**TypeDocument**

- **IdType**: Unique identifier for each document type
- **IconSrc**: Path or URL to the icon representing this type
- **Type**: Name of the document type (e.g., Report, Policy)

**Document**

- **IdDocument**: Unique identifier for each document
- **Title**: Title of the document
- **IdStakeholder**: Reference to the stakeholder responsible for this document
- **Scale**: Scope or scale of the document (e.g., National, Regional)
- **Issuance_Date**: Date when the document was issued
- **Language**: Language of the document
- **Pages**: Number of pages in the document
- **Description**: Brief description of the document
- **IdType**: Reference to the type of the document
- **IdLocation**: Reference to the location associated with this document

**Connection**

- **IdConnection**: Unique identifier for each connection type
- **Type**: Type of connection between documents (e.g., Collateral, Direct Consequence)
- **Description**: Description of the connection type

**DocumentConnection**

- **IdConnectionDocuments**: Unique identifier for each document connection
- **IdDocument1**: Reference to the first document in the connection
- **IdDocument2**: Reference to the second document in the connection
- **IdConnection**: Reference to the type of connection between the documents

## Main React Components

- **Authentication.jsx**: Handles the user authentication process, including login and session management.
- **Default.jsx**: Fallback component for routes that do not exist, ensuring users are redirected to a 404 page.
- **Document.jsx**: Displays detailed information about a single document, allowing users to view, download, or edit document details.
- **Documents.jsx**: Lists all documents in the system, offering features like search, filtering, and browsing of document metadata.
- **Home.jsx**: The homepage of the application, providing an introduction to the platform and navigation to other parts of the app.
- **Map.jsx**: Displays an interactive map to visualize geographic data related to documents and locations in the system.
- **ModifyDocument.jsx**: Allows users to modify an existing document’s metadata, providing an editable form for updates.
- **MyNavBar.jsx**: The navigation bar component that provides links to the homepage, documents, map, and other sections of the app.
- **API.jsx**: Manages API calls to the backend, centralizing data fetching and providing reusable hooks for components.
- **App.jsx**: The root component that renders the entire application, integrating routing and layout to ensure smooth app functionality.

## Screenshots

![Screenshot](/images/login.png)
![Screenshot](/images/map.png)
![Screenshot](/images/addDocument.png)
![Screenshot](/images/listDocument.png)
![Screenshot](/images/visualizeDocument.png)
![Screenshot](/images/visualizeDocumentMap.png)
![Screenshot](/images/updateDocument.png)

## License

This project is licensed under the CC BY-NC-SA 4.0 License.
