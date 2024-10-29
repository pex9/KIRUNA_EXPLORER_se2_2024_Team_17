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

const addDocument = (title,idStakeholder, scale, issuance_Date,language,pages,description, idtype) => {
  return new Promise((resolve, reject) => {
    fetch(URL + "/documents", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title,idStakeholder, scale, issuance_Date,language,pages,description, idtype}),
      credentials: "include",
    })
      .then((response) => {
        if (response.ok) {
          resolve(response.json());
        } else {
          response.json().then((message) => {
            reject(message);
          });
        }
      })
      .catch(() => {
        reject({ error: "Cannot communicate with the server." });
      });
  });

};



// API TYPES DOCUMENTS CALL

const getAllTypesDocument = () => {
  return new Promise((resolve, reject) => {
    fetch(URL + "/types", {
      credentials: "include",
    })
      .then((response) => {
        if (response.ok) {
          response.json().then((types) => {
            resolve(types);
          });
        } else {
          response
            .json()
            .then((message) => {
              reject(message);
            })
            .catch(() => {
              reject({ error: "Cannot parse server response." });
            });
        }
      })
      .catch(() => {
        reject({ error: "Cannot communicate with the server." });
      });
  });
};
const getTypeDocument = (id) => {
  return new Promise((resolve, reject) => {
    fetch(URL + "/types/" + id, {
      credentials: "include",
    })
      .then((response) => {
        if (response.ok) {
          response.json().then((type) => {
            resolve(type);
          });
        } else {
          response
            .json()
            .then((message) => {
              reject(message);
            })
            .catch(() => {
              reject({ error: "Cannot parse server response." });
            });
        }
      })
      .catch(() => {
        reject({ error: "Cannot communicate with the server." });
      });
  });
};


// API DOCUMENT CONNECTIONS CALL

const createDocumentConnection = (IdDocument1, IdDocument2, connection_type) => {
  return new Promise((resolve, reject) => {
    fetch(URL + "/document-connections", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ IdDocument1, IdDocument2, connection_type }),
      credentials: "include",

    }).then((response) => {
      if (response.ok) {
        resolve(response.json());
      } else {
        response.json().then((message) => {
          reject(message);
        });
      }
    }).catch(() => {
      reject({ error: "Cannot communicate with the server!" });
    });
  });
};

// API STAKEHOLDERS CALL

const getAllStakeholders = () => {
  return new Promise((resolve, reject) => {
    fetch(URL + "/stakeholders", {
      credentials: "include",
    })
      .then((response) => {
        if (response.ok) {
          response.json().then((stakeholders) => {
            resolve(stakeholders);
          });
        } else {
          response
            .json()
            .then((message) => {
              reject(message);
            })
            .catch(() => {
              reject({ error: "Cannot parse server response." });
            });
        }
      })
      .catch(() => {
        reject({ error: "Cannot communicate with the server." });
      });
  });
};
const getStakeholder = (id) => {
  return new Promise((resolve, reject) => {
    fetch(URL + "/stakeholders/" + id, {
      credentials: "include",
    })
      .then((response) => {
        if (response.ok) {
          response.json().then((stakeholder) => {
            resolve(stakeholder);
          });
        } else {
          response
            .json()
            .then((message) => {
              reject(message);
            })
            .catch(() => {
              reject({ error: "Cannot parse server response." });
            });
        }
      })
      .catch(() => {
        reject({ error: "Cannot communicate with the server." });
      });
  });
};

// API DOCUMENTS CONNECTION CALL 

const API = { getUsers, login, logout, getUserInfo,getAllTypesDocument,getTypeDocument,getAllStakeholders,getStakeholder,addDocument, createDocumentConnection};

export default API;
