const express = require('express')
const mongoose = require('mongoose')
const userRoutes = require('./routes/user')

const app = express()
const uri = 'mongodb+srv://cofefefe:Trinite333@cluster0.hzpfkea.mongodb.net/?retryWrites=true&w=majority'

mongoose.connect(uri, {useNewUrlParser:true})
.then(()=> res.status(201).console.log('connexion réussie à la base de donnée'))
.catch((error)=> console.log({error}))

app.use('/api/auth', userRoutes);

module.exports = app