const Sauce = require('../models/sauces')
const fs = require('fs')

// Create an object 'sauce'

exports.addSauce = (req,res,next) => {
  const sauce = new Sauce({
    ...req.body,
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: []
  })
  sauce.save()
  .then(()=>{
    res.status(200).json({message:"enregistrement du produit réussi !"})
  })
  .catch((error)=>{
    res.status(420).json({error})
    console.log(error)
  })
}
// Delete a sauce
exports.deleteSauce = (req,res,next) => {
    Sauce.deleteOne({_id : req.params.id})
        .then(()=>{
            res.status(200).json({message : 'Sauce supprimée !'})
        })
        .catch((error)=>{
            res.status(400).json({error})
        })
}
// Modify sauce
exports.modifySauce = (req,res,next) => {
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl : `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    }:{
        ...req.body
    }
    delete sauceObject._userId
    Sauce.findOne({_id : req.params.id})
        .then((sauce)=>{
            if(sauce.userId != req.auth.useriD){
                res.status(400).json({message : 'non autorisé'})
            }else{
                sauce.updateOne({_id : req.params.id},{...sauceObject, _id : req.params.id})
                    .then(()=>{
                        res.status(200).json({message : 'Objet modifié !'})
                    })
                    .catch((error)=>{
                        res.status(401).json({error})
                    })
            }
        })
        .catch((error)=>{
            res.status(400).json({error})
        })

}
// Find sauce
exports.findASauce = (req,res,next) => {
    Sauce.findOne({_id : req.params.id})
        .then((sauce)=>{
            res.status(200).json(sauce)
        })
        .catch((error)=>{
            res.status(400).json({error})
        })
}

// Find all Sauce
exports.findAllSauce = (req,res,next)=>{
    Sauce.find()
        .then((sauces)=>{
            res.status(200).json(sauces)
        })
        .catch((error)=>{
            res.status(400).json({error})
        })
}

exports.like = (req,res,next) => {
    
}