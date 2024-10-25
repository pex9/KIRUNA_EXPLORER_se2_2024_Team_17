'use strict';

import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { check, validationResult } from 'express-validator';
import passport from 'passport';
import LocalStrategy from 'passport-local';
import session from 'express-session';
import userDao from './dao/user-dao.js'; // Aggiungi questa riga per importare userDao correttamente

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


// activate the server
const server = app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

// Export the app and server
export { app, server };
