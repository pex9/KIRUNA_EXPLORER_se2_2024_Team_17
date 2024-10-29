'use strict';

import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import passport from 'passport';
import LocalStrategy from 'passport-local';
import session from 'express-session';
import userDao from './dao/user-dao.js'; 
import documentDao from './dao/document-dao.js';
import stakeholderDao from './dao/stakeholder-dao.js';
import typeDocumentDao from './dao/typeDocument-dao.js';
/*** Set up Passport ***/
// set up the "username and password" login strategy
passport.use(new LocalStrategy(
  function (username, password, done) {
    userDao.getUser(username, password).then((user) => {
      if (!user)
        return done(null, false, { message: 'Wrong username and/or password.' });

      return done(null, user);
    }).catch(err => done(err));
  }
));

// serialize and de-serialize the user (user object <-> session)
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  userDao.getUserById(id)
    .then(user => {
      done(null, user); // this will be available in req.user
    }).catch(err => {
      done(err, null);
    });
});

// init express
const app = new express();
const port = 3001;

// set-up middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(express.static('public'));

// CORS configuration
const corsOptions = {
  origin: 'http://localhost:5173', // Replace with your client's origin
  credentials: true
};
app.use(cors(corsOptions));

// set up the session
app.use(session({
  secret: 'wge8d239bwd93rkskb',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // set to true if using HTTPS
    httpOnly: true,
    sameSite: 'lax' // set the sameSite attribute correctly
  }
}));

// then, init passport
app.use(passport.initialize());
app.use(passport.session());

// custom middleware: check if a given request is coming from an authenticated user to check when a function can be done or not 
const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated())
    return next();

  return res.status(401).json({ error: 'Not authenticated' });
}

const isUrbanPlanner = (req, res, next) => {
  if (req.isAuthenticated() && req.user.role == 'Urban Planner')
    return next();
  else if (req.isAuthenticated() && req.user.role != 'Urban Planner'){
    return res.status(403 ).json({ error: '(Forbidden), user is authenticated but does not have the necessary privileges to access a resource.' });
  }
  return res.status(401).json({ error: 'Not authenticated' });
}
/*** User APIs ***/

// POST /api/sessions 
// do the login
app.post('/api/sessions', function (req, res, next) {
  passport.authenticate('local', (err, user, info) => {
    if (err)
      return next(err);
    if (!user) {
      return res.status(401).json(info);
    }
    // successo del login
    req.login(user, (err) => {
      if (err)
        return next(err);
      return res.json(req.user);
    });
  })(req, res, next);
});

// DELETE /api/sessions/current 
// logout
app.delete('/api/sessions/current', (req, res) => {
  req.logout(() => { res.end(); });
});

// GET /api/sessions/current
// check whether the user is authenticated or not
app.get('/api/sessions/current', (req, res) => {
  if (req.isAuthenticated()) {
    res.status(200).json(req.user);
  }
  else
    res.status(401).json({ error: 'Unauthenticated user!' });
});


// API DOCUMENTS

// POST /api/documents, only possible for authenticated users and if he/she is a urban planner
app.post('/api/documents', isUrbanPlanner, (req, res) => {
  const document = req.body;
  if (!document.title || !document.idStakeholder) {
    res.status(400).json({ error: 'The request body must contain all the fields' });
    return
  }
  documentDao.addDocument(document.title, document.idStakeholder, document.scale, document.issuance_Date, document.language, document.pages, document.description, document.idtype)
    .then(document => res.status(201).json(document))
    .catch(() => res.status(500).end());
});

// GET /api/documents

app.get('/api/documents', (req, res) => {
  documentDao.getDocuments()
    .then(documents => res.json(documents))
    .catch(() => res.status(500).end());
});

// GET /api/documents/:documentid

app.get('/api/documents/:documentid', (req, res) => {
  documentDao.getDocumentById(req.params.documentid)
    .then(document => {
      if (document)
        res.json(document);
      else
        res.status(404).json({ error: 'Document not found' });
    })
    .catch(() => res.status(500).end());
});


// API TYPES
app.get('/api/types', (req, res) => {
  typeDocumentDao.getTypes()
    .then(types => res.json(types))
    .catch(() => res.status(500).end());
}); 
app.get('/api/types/:typeid', (req, res) => {
  typeDocumentDao.getType(req.params.typeid)
    .then(type => {
      if (type)
        res.json(type);
      else
        res.status(404).json({ error: 'Type not found' });
    })
    .catch(() => res.status(500).end());
});

// API STAKEHOLDERS

app.get('/api/stakeholders', (req, res) => {
  stakeholderDao.getStakeholders()
    .then(stakeholders => res.json(stakeholders))
    .catch(() => res.status(500).end());
});


app.get('/api/stakeholders/:stakeholderid', (req, res) => {
  stakeholderDao.getStakeholderById(req.params.stakeholderid)
    .then(stakeholder => {
      if (stakeholder)
        res.json(stakeholder);
      else
        res.status(404).json({ error: 'Stakeholder not found' });
    })
    .catch(() => res.status(500).end());
});


//API DOCUMENTCONNECTION


// activate the server
const server = app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

// Export the app and server
export { app, server };
