'use strict'

const express    = require('express');
const users      = express.Router();
const bodyParser = require('body-parser');
const db         = require('./../db/pg/users');
const secret      = "sweet sweet secret";
const expressJWT  = require('express-jwt');
const jwt         = require('jsonwebtoken');

users.use(function(error, request, response, next) {
  if(error.name === 'UnauthorizredError') {
    response.status(401).json({message: 'you need an authoriation token to view condifential information'});
  }
});

function test(req, res, next) {
  console.log(req.user);
  next()
}

users.route('/')
  .post( db.createUser, (req,res)=>res.json(res.rows) )
  // Create a new user

users.route('/login')
  .post( db.login, (req,res)=> {
    var token = jwt.sign(res.rows, secret);
    res.json({users: res.rows, token: token});
  })

module.exports = users;
