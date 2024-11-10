"use strict";

import express from "express";
import morgan from "morgan";
import cors from "cors";
import fs from "fs";
import path from "path";
import multer from "multer";
import passport from "passport";
import LocalStrategy from "passport-local";
import session from "express-session";
import userDao from "./dao/user-dao.js";
import documentDao from "./dao/document-dao.js";
import stakeholderDao from "./dao/stakeholder-dao.js";
import typeDocumentDao from "./dao/typeDocument-dao.js";
import DocumentConnectionDao from "./dao/document-connection-dao.js";
import locationDao from "./dao/location-dao.js";
import { fileURLToPath } from "url";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
/*** Set up Passport ***/
// set up the "username and password" login strategy
passport.use(
  new LocalStrategy(function (username, password, done) {
    userDao
      .getUser(username, password)
      .then((user) => {
        if (!user)
          return done(null, false, {
            message: "Wrong username and/or password.",
          });

        return done(null, user);
      })
      .catch((err) => done(err));
  })
);

// serialize and de-serialize the user (user object <-> session)
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  userDao
    .getUserById(id)
    .then((user) => {
      done(null, user); // this will be available in req.user
    })
    .catch((err) => {
      done(err, null);
    });
});

// middleware to check if the document provided in the request exists
const checkDocumentExists = async (req, res, next) => {
  const documentId = parseInt(req.params.documentId);
  if (isNaN(documentId)) {
      return res.status(400).json({ message: 'Invalid document ID' });
  }

  try {
      const document = await documentDao.getDocumentById(documentId);
      if (!document) {
          return res.status(404).json({ message: 'Document not found' });
      }
      next(); // Continue to the next middleware if the document exists
  } catch (error) {
      return res.status(500).json({ message: 'Server error', error });
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      const documentId = req.params.documentId;
      if (!documentId) {
          return cb(new Error('Document ID is missing'));
      }

      // Define the directory path based on the document ID
      const dirPath = path.join(__dirname, 'uploads/', documentId);

      // Check if the directory exists, if not, create it
      if (!fs.existsSync(dirPath)) {
          fs.mkdirSync(dirPath, { recursive: true });
      }

      // Use the newly created directory as the destination
      cb(null, dirPath);
  },
  filename: (req, file, cb) => {
      const documentId = req.params.documentId;
      const currentDate = new Date().toISOString().replace(/[-:]/g, '').replace('T', '_').split('.')[0];
      const fileExtension = path.extname(file.originalname);

      // Filename format: documentId_YYYYMMDD_HHMMSS.extension
      const newFilename = `${documentId}_${currentDate}${fileExtension}`;
      cb(null, newFilename);
  }
});

const upload = multer({ storage });

// init express
const app = new express();
const port = 3001;



// set-up middlewares
app.use(morgan("dev"));
app.use(express.json());
app.use(express.static("public"));



// CORS configuration
const corsOptions = {
  origin: "http://localhost:5173", // Replace with your client's origin
  credentials: true,
};
app.use(cors(corsOptions));

// set up the session
app.use(
  session({
    secret: "wge8d239bwd93rkskb",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // set to true if using HTTPS
      httpOnly: true,
      sameSite: "lax", // set the sameSite attribute correctly
    },
  })
);

// then, init passport
app.use(passport.initialize());
app.use(passport.session());

// custom middleware: check if a given request is coming from an authenticated user to check when a function can be done or not
const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) return next();

  return res.status(401).json({ error: "Not authenticated" });
};

const isUrbanPlanner = (req, res, next) => {
  if (req.isAuthenticated() && req.user.role == "Urban Planner") return next();
  else if (req.isAuthenticated() && req.user.role != "Urban Planner") {
    return res.status(403).json({
      error:
        "(Forbidden), user is authenticated but does not have the necessary privileges to access a resource.",
    });
  }
  return res.status(401).json({ error: "Not authenticated" });
};
/*** User APIs ***/

// POST /api/sessions
// do the login
app.post("/api/sessions", function (req, res, next) {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      return res.status(401).json(info);
    }
    // successo del login
    req.login(user, (err) => {
      if (err) return next(err);
      return res.json(req.user);
    });
  })(req, res, next);
});

// DELETE /api/sessions/current
// logout
app.delete("/api/sessions/current", (req, res) => {
  req.logout(() => {
    res.end();
  });
});

// GET /api/sessions/current
// check whether the user is authenticated or not
app.get("/api/sessions/current", (req, res) => {
  if (req.isAuthenticated()) {
    res.status(200).json(req.user);
  } else res.status(401).json({ error: "Unauthenticated user!" });
});

///////// API DOCUMENTS  ////////

// POST /api/documents, only possible for authenticated users and if he/she is a urban planner
app.post("/api/documents", isUrbanPlanner, async (req, res) => {
  const document = req.body;
  console.log(document);
  if (!document.title || !document.idStakeholder || !document.idtype) {
    res
      .status(400)
      .json({ error: "The request body must contain all the fields" });
    return;
  }
  const idLocation= document.idLocation ? document.idLocation : await locationDao.addLocation(document.locationType, document.latitude, document.longitude, document.area_coordinates);
  if (!idLocation) {
    res.status(500).json({ error: "Failed to add location." });
    return;
  }
  documentDao
    .addDocument(document.title,parseInt(document.idStakeholder),document.scale,document.issuance_Date,document.language,parseInt(document.pages),document.description,parseInt(document.idtype),idLocation)
    .then((document) => res.status(201).json(document))
    .catch(() => res.status(500).end());
});

// GET /api/documents

app.get("/api/documents", (req, res) => {
  documentDao
    .getDocuments()
    .then((documents) => res.json(documents))
    .catch(() => res.status(500).end());
});

// GET /api/documents/:documentid

app.get("/api/documents/:documentid", (req, res) => {
  documentDao
    .getDocumentById(req.params.documentid)
    .then((document) => {
      if (document) res.json(document);
      else res.status(404).json({ error: "Document not found" });
    })
    .catch(() => res.status(500).end());
});


// PATCH /api/documents/:documentid 
app.patch("/api/documents/:documentid", isUrbanPlanner, (req, res) => { 
  const documentId = parseInt(req.params.documentid); 
  const document = req.body; 
  if( !document.title || !document.idStakeholder){ 
    res.status(400).json({ error: "The request body must contain all the fields" }); 
    return; 
  } 
  try { 
    documentDao.updateDocument(documentId, document.title, parseInt(document.idStakeholder), document.scale, document.issuance_Date, document.language, parseInt(document.pages), document.description, parseInt(document.idtype)) 
      .then((document) => res.status(200).json(document)) 
      .catch(() => res.status(500).end()); 
  } catch (error) { 
    res.status(500).json({ error: error.message }); 
  }; 
});

// PATCH /api/documents/:documentId/connection
app.patch("/api/documents/:documentId/connection", async (req, res) => {
  const documentId = parseInt(req.params.documentId);
  const newDocumentId2 = parseInt(req.body.IdDocument2);
  const newConnectionId = parseInt(req.body.IdConnection);

  if (!newDocumentId2 || !newConnectionId) {
    return res
      .status(400)
      .json({ error: "newDocumentId2 and newConnectionId are required." });
  }

  try {
    const result = await DocumentConnectionDao.updateDocumentConnection(
      documentId,
      newDocumentId2,
      newConnectionId
    );
    if (result) {
      res.status(200).json({ message: "Connection updated successfully." });
    } else {
      res.status(500).json({ error: "Failed to update connection." });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API add file to document

// Endpoint to upload a file
app.post('/api/documents/:documentId/resources',checkDocumentExists, upload.single('file'), async (req, res) => {
  if (req.file) {
      const documentId = parseInt(req.params.documentId);
      res.json({
          message: 'File uploaded successfully!',
          documentId: documentId,
          filename: req.file.filename,
      });
  } else {
      res.status(400).json({ message: 'File upload failed.' });
  }
});

// APU get file from document app.get('/documents/:documentId/resources/')



// API TYPES
app.get("/api/types", (req, res) => {
  typeDocumentDao
    .getTypes()
    .then((types) => res.json(types))
    .catch(() => res.status(500).end());
});
app.get("/api/types/:typeid", (req, res) => {
  typeDocumentDao
    .getType(req.params.typeid)
    .then((type) => {
      if (type) res.json(type);
      else res.status(404).json({ error: "Type not found" });
    })
    .catch(() => res.status(500).end());
});

// API STAKEHOLDERS

app.get("/api/stakeholders", (req, res) => {
  stakeholderDao
    .getStakeholders()
    .then((stakeholders) => res.json(stakeholders))
    .catch(() => res.status(500).end());
});

app.get("/api/stakeholders/:stakeholderid", (req, res) => {
  stakeholderDao
    .getStakeholderById(req.params.stakeholderid)
    .then((stakeholder) => {
      if (stakeholder) res.json(stakeholder);
      else res.status(404).json({ error: "Stakeholder not found" });
    })
    .catch(() => res.status(500).end());
});

// API CONNECTIONS

app.get("/api/connections", (req, res) => {
  DocumentConnectionDao.getAllConnectionsType()
    .then((connections) => res.status(200).json(connections))
    .catch((err) => res.status(500).json({ error: "Internal server error" }));
});



// API DOCUMENTCONNECTION  

// GET /api/document-connections
// Retrievs all list of connection documents
app.get("/api/document-connections", (req, res) => {
  DocumentConnectionDao.getAllConnections()
    .then((connections) => res.status(200).json(connections))
    .catch((err) => res.status(500).json({ error: "Internal server error" }));
});

// GET /api/document-connections/:documentId
// Retrievs list of all connections for a specific document
app.get("/api/document-connections/:documentId", (req, res) => {
  DocumentConnectionDao.getConnections(req.params.documentId)
    .then((connections) => res.status(200).json(connections))
    .catch((err) => res.status(500).json({ error: "Internal server error" }));
});

// POST /api/document-connections
//  Creates a new connection between two documents
app.post("/api/document-connections", isUrbanPlanner, (req, res) => {
  const connection = req.body;

  if (
    !connection.IdDocument1 ||
    !connection.IdDocument2 ||
    !connection.IdConnection
  ) {
    res
      .status(400)
      .json({ error: "The request body must contain all the required fields" });
    return;
  }

  // Check if documents are not the same
  if (connection.IdDocument1 === connection.IdDocument2) {
    res.status(400).json({ error: "A document cannot be connected to itself" });
    return;
  }
  DocumentConnectionDao.createConnection(
    connection.IdDocument1,
    connection.IdDocument2,
    connection.IdConnection
  )
    .then((newConnection) => res.status(201).json(newConnection))
    .catch(() => res.status(500).end());
});

////// API LOCATION  //////
app.get("/api/locations", (req, res) => {
  locationDao
    .getLocationsPoint()
    .then((locations) => res.json(locations))
    .catch(() => res.status(500).end());
});


app.get("/api/locations/area", (req, res) => {
  locationDao
    .getLocationsArea()
    .then((locations) => res.json(locations))
    .catch(() => res.status(500).end());
});

app.get("/api/locations/:locationId", (req, res) => {
  locationDao
    .getLocationById(req.params.locationId)
    .then((location) => {
      if (location) res.json(location);
      else res.status(404).json({ error: "Location not found" });
    })
    .catch(() => res.status(500).end());
});

app.post("/api/locations", isUrbanPlanner, async (req, res) => {
  const { locationType, latitude, longitude, areaCoordinates } = req.body;
  if (!locationType) {
    return res.status(400).json({ error: "locationType is required." });
  }
  if (locationType == "Point") {
    // Check if both latitude and longitude are provided
    if (latitude == null || longitude == null) {
      return res.status(400).json({
        error:
          "For 'Point' locationType, both latitude and longitude are required.",
      });
    }
  }

  if (locationType == "Area") {
    // Check if areaCoordinates is provided
    if (areaCoordinates == null) {
      return res.status(400).json({
        error: "For 'Area' locationType, areaCoordinates are required.",
      });
    }
  }
  try {
    const result = await locationDao.addLocation(
      locationType,
      latitude,
      longitude,
      areaCoordinates
    );
    if (result) {
      res.status(201).json({ message: "Location added successfully." });
    } else {
      res.status(500).json({ error: "Failed to add location." });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.patch("/api/locations/:locationId", isUrbanPlanner, async (req, res) => {
  const idLocation = parseInt(req.params.locationId);
  console.log(idLocation);
  console.log(req.body);
  const { location_type: locationType, latitude, longitude, area_coordinates: areaCoordinates } = req.body;
  if (!locationType) {
    return res.status(400).json({ error: "locationType is required." });
  }
  if (locationType == "Point") {
    // Check if both latitude and longitude are provided
    if (latitude == null || longitude == null) {
      return res.status(400).json({
        error:
          "For 'Point' locationType, both latitude and longitude are required.",
      });
    }
  }
  if (locationType == "Area") {
    // Check if areaCoordinates is provided
    if (!areaCoordinates) {
      return res.status(400).json({
        error: "For 'Area' locationType, areaCoordinates are required.",
      });
    }
  }
  try {
    const location = await locationDao.getLocationById(idLocation);
    if (!location) {
      return res.status(404).json({ error: "Location not found." });
    }
    const result = await locationDao.updateLocation(
      idLocation,
      locationType,
      latitude,
      longitude,
      areaCoordinates
    );
    if (result) {
      res.status(200).json({ message: "Location updated successfully." });
    } else {
      res.status(500).json({ error: "Failed to update location." });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// activate the server
const server = app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

// Export the app and server
export { app, server };
