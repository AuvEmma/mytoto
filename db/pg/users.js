'use strict';
const pgp = require('pg-promise')({});

if(process.env.ENVIRONMENT === 'production'){
  var cn = process.env.DATABASE_URL;
}else{
  var cn = {
    host: process.env.HOST, // server name or IP address;
    port: 5432,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASS
  }
}

const bcrypt = require('bcrypt');
const salt = bcrypt.genSaltSync(10);
const db = pgp(cn)

function createSecure(email, password, callback) {
    bcrypt.genSalt(function(err, salt) {
      bcrypt.hash(password, salt, function(err, hash){
        callback(email, hash)
      })
    })
  }


function createUser(req, res, next) {
  createSecure(req.body.email, req.body.password, saveUser)

      function saveUser(email, hash) {
        db.none(`INSERT INTO users (email, password_digest)
        VALUES ($1, $2)`,
            [email, hash])
            .then(next)
            .catch((err) => {
              console.log('error signing up', err.code)
              res.rows = err.code
              next()
            })
      }
    }

function login(req, res, next) {
  var email = req.body.email
  var password = req.body.password

  db.one(`SELECT * FROM users WHERE email LIKE $/email/`, req.body)
    .then((data) => {
      console.log(data,'is login user returning data')
        if (bcrypt.compareSync(password, data.password_digest)) {
          res.rows = data
          next()
        }
        res.status(401).json({data: "password and email do not match"})
      })
      .catch((err) => {
        res.setHeader('test', 'test');
        res.rows = 'noUser'
        console.error(err, 'error in function login (db/pg/users.js)')
      })
}

module.exports.login = login;
module.exports.createUser = createUser;
