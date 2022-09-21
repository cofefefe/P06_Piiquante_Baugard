const mongoose = require('mongoose')
const bodyParser = require("body-parser")
const express = require('express')
const app = express()
app.use(bodyParser.urlencoded({ extended: true }))

// Use mongoose method to create a schema of sauce object
const sauceSchema = mongoose.Schema({
    userId :       {type:String, required:true},
    name :         {type:String, required:true},
    manufacturer : {type:String, required:true},
    description :  {type:String, required:true},
    mainPepper :   {type:String, required:true},
    imageUrl :     {type:String, required:true},
    heat :         {type:Number, required:true},
    likes :        {type:Number, required:true},
    dislikes :     {type:Number, required:true},
    usersLiked :   {type:Array},
    usersDisliked :{type:Array}
})

module.exports = mongoose.model('sauce', sauceSchema)