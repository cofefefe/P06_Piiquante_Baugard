// Required dependancies
const bodyParser = require('body-parser')
const express = require('express')
const mongoose = require('mongoose')
const path = require('path')

const dotenv = require('dotenv') 

// Required files
const userRoutes = require('./routes/user')
const sauceRoutes = require('./routes/sauces')
const app = express()
const sauceController = require('./controllers/sauces')
const multer = require('./middleware/multer-config')
// have access to request body

app.use(express.json());

// Define path of .env
dotenv.config({
  path: path.resolve(__dirname, '.env')
});


// Cors permission
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
  next()
})

// Link frontend and backend database
const uri = `mongodb+srv://${process.env.DB_USER_NAME}:${process.env.DB_USER_PASSWORD}@cluster0.hzpfkea.mongodb.net/?retryWrites=true&w=majority`

mongoose.connect(uri,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
.then(() => console.log('Connexion à MongoDB réussie !'))
.catch(() => console.log('Connexion à MongoDB échouée !'))

app.use("/api/auth", userRoutes)
app.use('/api/sauces', sauceRoutes)
app.use('/images', express.static(path.join(__dirname, 'images')))


module.exports = app