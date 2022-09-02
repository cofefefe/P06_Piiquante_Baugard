const express = require('express')
const Router = express()
const multer = require('../images/multer-config')
const sauceCtrl = require('../controllers/sauces')

// Retrieve one sauce by Id or all sauces
Router.get("/:id", sauceCtrl.findASauce)
Router.get("/", sauceCtrl.findAllSauce)
// Delete a Sauce
Router.delete("/:id", sauceCtrl.deleteSauce)
// Add a sauce
Router.post("/", multer, sauceCtrl.addSauce)
// Modify sauce
Router.put("/:id", multer, sauceCtrl.modifySauce)

module.exports = Router;