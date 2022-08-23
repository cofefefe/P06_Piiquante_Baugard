const express = require('express')
const app = express()
const mongoose = require('mongoose')
const uri = 'mongodb+srv://cofefefe:Trinite333@cluster0.hzpfkea.mongodb.net/?retryWrites=true&w=majority'

mongoose.connect(uri, {useNewUrlParser:true, useUnifiedTypology:true })
    .then(()=> console.log('connexion réussie à la base de donnée'))
    .catch(()=> console.log('connexion échouée'))

module.exports = app