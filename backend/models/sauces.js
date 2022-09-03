const mongoose = require('mongoose')
const bodyParser = require("body-parser")
const express = require('express')
const app = express()
app.use(bodyParser.urlencoded({ extended: true }));

const sauceSchema = mongoose.Schema({
    userId :       {type:String},
    name :         {type:String},
    manufacturer : {type:String},
    description :  {type:String},
    mainPepper :   {type:String},
    imageUrl :     {type:String},
    heat :         {type:Number},
    likes :        {type:Number},
    dislikes :     {type:Number},
    usersLiked :   {type:Array},
    usersDisliked :{type:Array}
})

module.exports = mongoose.model('sauce', sauceSchema)