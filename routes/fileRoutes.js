"use strict"
import express from "express";
import path from "path";
const Router = express.Router();


Router.get('/Login.html', (req, res, next) => {
  res.sendFile(path.join(__dirname, '../public', 'LogIn.html'));
});

Router.get('/Form.html', (req, res, next) => {
  res.sendFile(path.join(__dirname, '../public', 'Form1.html'));
});

export { Router as fileRoute };
