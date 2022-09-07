const express = require('express')
const Router = express()
const multer = require('../middleware/multer-config')

const sauceCtrl = require('../controllers/sauces')
// Managing authorization by jwt
const auth = require('../middleware/auth')

// Retrieve one sauce by Id or all sauces
Router.get("/:id", auth, sauceCtrl.findASauce)
Router.get("/", auth, sauceCtrl.findAllSauce)
// Delete a Sauce
Router.delete("/:id", auth, sauceCtrl.deleteSauce)
// Add a sauce
Router.post("/", auth, multer, sauceCtrl.addSauce)
// Modify sauce
Router.put("/:id", auth, multer, sauceCtrl.modifySauce)
// like & dislike
Router.post("/:id/like", sauceCtrl.like)

module.exports = Router