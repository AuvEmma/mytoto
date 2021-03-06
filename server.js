'use strict'
if(process.env.ENVIRONMENT !== 'production'){
  require('dotenv').config();
}
const express      = require('express');
const logger       = require('morgan');
const path         = require('path');
const bodyParser   = require('body-parser');
const secret       = "sweet sweet secret";
const expressJWT   = require('express-jwt');
const favicon      = require('serve-favicon');

const userRoutes   = require( path.join(__dirname, '/routes/users'));
const guestRoutes  = require( path.join(__dirname, '/routes/guests'));
const totoRoutes  = require( path.join(__dirname, '/routes/toto'));

const app          = express();
// need to use process.env.PORT for heroku deployment
const _port        = process.argv[2]|| process.env.PORT||3000;

app.use(favicon(__dirname + '/public/img/favicon.ico'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// serve static files
app.use(express.static(path.join(__dirname,'public')));

//set up some logging
app.use(logger('dev'));

app.use('/guests', guestRoutes)
app.use('/users',expressJWT({secret:secret}),userRoutes)
app.use('/toto',totoRoutes)

app.get('/',(req,res)=>{
  res.sendFile(path.join(__dirname,'public/index.html'));
})

app.get('*',(req,res)=>{
  res.sendFile(path.join(__dirname,'public/index.html'));
})
// turn me on!
app.listen(_port , ()=>
  console.log(`server here! listening on`, _port )
);
