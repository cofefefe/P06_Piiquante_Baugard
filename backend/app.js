const express = require('express')
const mongoose = require('mongoose')
const userRoutes = require('./routes/user')
const bodyParser = require('body-parser')

const app = express()

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*")
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
    )
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, PATCH, OPTIONS"
    )
    next()
  })


app.use(express.json())

const uri = 'mongodb+srv://cofefefe:Trinite333@cluster0.hzpfkea.mongodb.net/?retryWrites=true&w=majority'

mongoose.connect(uri,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use('/api/auth', userRoutes);

app.use(bodyParser.json())


module.exports = app