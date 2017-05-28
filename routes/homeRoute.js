"use strict"
import express from 'express';
import path from "path";
import bcrypt from "bcrypt";
import { db } from "../mongodb/mongo.js";
import { User } from "../mongodb/user.js";

const isEmpty = (obj) => {
  return !Object.keys(obj).length;
};

const Router = express.Router();

const validation = async (sessionId, res) => {
    if (sessionId) {
        try {
          return await User.findOne({_id : sessionId});
        } catch (error) {
          console.log(error);
          res.sendStatus(500);
        }
    }
};

const isLoggedIn = (sessionId) => {
  switch(!sessionId) {
      case true:
        return false;
        break;

      case false:
        return true;
        break;
  }
};

Router.use(express.static(path.join(__dirname, '../public')));

Router.use('/userdata', (req, res, next) => {
  User.find({email : req.body.email}, (error, user) => {
    if (error) {
      res.sendStatus(500);
      res.end();
    } else {
      if (user.length !== 0) {
        res.send("duplicate email");
        res.end();
      } else {
        next();
      }
    }
  })
});

Router.use('/userdata', (req, res, next) => {
  User.find({userName : req.body.username} ,(error, user) => {
    if (error) {
      console.log(error);
      res.sendStatus(500);
      res.end();
    } else {
      if (user.length !== 0) {
        res.statusCode = 200;
        res.send("user exists");
        res.end();
      } else {
        next();
      }
    }
  })
});

Router.get('/', (req, res, next) => {
    res.sendFile(path.join(__dirname, '../public', 'home.html'));
});

Router.get('/GettingData', (req, res, next) => {
  if (isLoggedIn(req.session.userId)) {
    validation(req.session.userId, res).then((user) => {
      res.send(user.userName);
    }).catch((error) => {
      console.log(error);
      res.sendStatus(500);
    });
  } else {
    res.statusCode = 200;
    res.send("Blown");
  }
});

Router.get("/logoff", (req, res, next) => {
  req.session.destroy();
  res.redirect('/');
});

Router.get("/logged", (req, res, next) => {
  if (isLoggedIn(req.session.userId)) {
      validation(req.session.userId, res).then((user) => {
          switch(!user) {
              case true:
                res.redirect('/public/Login.html');
                break;

              case false:
                res.sendFile(path.join(__dirname, '../private/ProfPage/prof.html'));
                break;
          }
      }).catch((error) => {
        console.log(error);
        res.sendStatus(500);
      });
  } else {
      res.redirect('/public/Login.html');
  }
});

//TODO continue with /GetThingsReady

Router.post('/userdata', (req, res, next) => {
  console.log(req.body);
  console.log(req.files);
  const user = new User();
  user.firstName = req.body.firstname;
  user.lastName = req.body.lastname;
  user.email = req.body.email;
  user.userName = req.body.username;
  user.password = bcrypt.hashSync(req.body.password, 10);
  if (!isEmpty(req.files) && req.files.image) {
    user.image = {data : req.files.image.data, contentType : req.files.image.mimetype};
  }
  if (req.body.team) {
    user.team = req.body.team;
  }
  user.save((error) => {
    if (error) {
      console.log(error);
      res.sendStatus(500);
    } else {
      res.send('ok');
    }
  });
});

Router.post('/CheckAndLogIn', (req, res) => {
  User.findOne({userName : req.body.user}, {userName : 1, password : 1}, (error, user) => {
    if (error) {
      console.log(error, "or no users");
      res.sendStatus(500);
    } else {
      if (!user) {
          res.send("Denied");
      } else {
        switch(bcrypt.compareSync(req.body.pass, user.password)) {
            case true:
              req.session.userId = user._id;
              res.send("Logged in");
              break;

            case false:
              res.send("Denied");
              break;

            default:
              res.send("Denied");
              break;
        }
      }
    }
    });
});


export { Router as homeRoute };
