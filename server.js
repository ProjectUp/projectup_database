"use strict"
import express from "express";
import session from "express-session";
import bodyParser from "body-parser";
import busboyBodyParser from "busboy-body-parser";
import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { homeRoute } from "./routes/homeRoute.js";
import { fileRoute } from "./routes/fileRoutes.js";
import { db } from "./mongodb/mongo.js";
import { User } from "./mongodb/user.js";

const app = express();
app.use(session({
  secret : "mongodb",
  resave : true,
  saveUninitialized : true,
  cookie : {secure : false}
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));
app.use(busboyBodyParser());
app.use('/', homeRoute);
app.use('/public', fileRoute);

app.listen(3001, console.log("start"));
