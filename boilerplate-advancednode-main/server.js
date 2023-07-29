let express = require('express')
let app = express()
let pug = require('pug')
let dotenv = require('dotenv').config()
let session = require('express-session')
let passport = require('passport')
let ObjectId = require('mongodb').ObjectId
let MongoClient = require('mongodb').MongoClient
let LocalStrategy = require('passport-local')
let bodyParser = require('body-parser')
let bcrypt = require('bcrypt')
let auth = require('./auth')
let routes = require('./routes')


app.set('view engine', 'pug')
app.set('views', './pages')



let uri = 'mongodb://127.0.0.1:27017/advancednode'

MongoClient.connect(uri, (error, client) => {
  if (error) {
    console.log(error)
  }else{
    let db = client.db('advancednode')
    console.log("Succesfully connected to database")

    auth(app, db, session, passport, ObjectId, LocalStrategy, bcrypt)

    routes(app, db, bodyParser, passport, bcrypt)
  }
})