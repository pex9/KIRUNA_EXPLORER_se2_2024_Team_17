const URL = "http://localhost:3001/api";

// API USERS CALL
// function to getusers
function getUsers() {
  // call GET /api/users
  return new Promise((resolve, reject) => {
    fetch(URL + "/users", {
      credentials: "include",
    })
      .then((response) => {
        if (response.ok) {
          response.json().then((users) => {
            resolve(users);
          });
        } else {
          // analyze the cause of error
          response
            .json()
            .then((message) => {
              reject(message);
            }) // error message in the response body
            .catch(() => {
              reject({ error: "Cannot parse server response." });
            }); // something else
        }
      })
      .catch(() => {
        reject({ error: "Cannot communicate with the server." });
      }); // connection errors
  });
}
//function to login
async function login(credentials) {
  // call POST /api/sessions
  let response = await fetch(URL + "/sessions", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });
  if (response.ok) {
    const user = await response.json();
    return user;
  } else {
    const errDetail = await response.json();
    throw errDetail.message;
  }
}

async function logout() {
  // call DELETE /api/sessions/current
  await fetch(URL + "/sessions/current", {
    method: "DELETE",
    credentials: "include",
  });
}
// funzione per ottenere le informazioni dell'utente loggato
async function getUserInfo() {
  // call GET /api/sessions/current
  const response = await fetch(URL + "/sessions/current", {
    credentials: "include",
  });

  const userInfo = await response.json();
  if (response.ok) {
    return userInfo;
  } else {
    throw userInfo; // an object with the error coming from the server
  }
}

// API DOCUMENTS CALL 


// API TYPES DOCUMENTS CALL


// API STAKEHOLDERS CALL

// API DOCUMENTS CONNECTION CALL 

const API = { getUsers, login, logout, getUserInfo };

export default API;
