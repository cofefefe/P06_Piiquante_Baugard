// Required dependancies
const bodyParser = require('body-parser')
const express = require('express')
const mongoose = require('mongoose')

// Required files 
const userRoutes = require('./routes/user')
const app = express()

// have access to request body
app.use(bodyParser.json())

// Cors permission
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  )
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  ),
  next()
})

// Link frontend and backend database
const uri = 'mongodb+srv://cofefefe:Trinite333@cluster0.hzpfkea.mongodb.net/?retryWrites=true&w=majority'

mongoose.connect(uri,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
.then(() => console.log('Connexion à MongoDB réussie !'))
.catch(() => console.log('Connexion à MongoDB échouée !'))



app.post("/api/auth", userRoutes)


module.exports = app