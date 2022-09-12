const Sauce = require('../models/sauces')
const fs = require('fs')
const auth = require('../middleware/auth')
const bodyParser = require('body-parser')

// Create an object 'sauce'

exports.addSauce = (req,res,next) => {
    const sauceObject = JSON.parse(req.body.sauce)
    delete sauceObject._id;
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
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
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id})
        .then(sauce => {
                console.log('on est dans le then')
                const filename = sauce.imageUrl.split('/images/')[1];
                console.log({filename})
                fs.unlink(`images/${filename}`, () => {
                    Sauce.deleteOne({_id: req.params.id})
                        .then(() => { res.status(200).json({message: 'Objet supprimé !'})})
                        .catch(error => res.status(401).json({ error }));
                });
            })
        .catch( error => {
            res.status(500).json({ error });
            console.log({error})
        });
 };

// Modify sauce
exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ?
    {
      ...JSON.parse(req.body.sauce), // Retrieve request json format
      // switch path of modified image
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`} : { ...req.body }
    // Update changes
    Sauce.updateOne({ _id : req.params.id}, {...sauceObject, _id: req.params.id})
    .then(res.status(200).json({ message : "Sauce modifiée"}))
    .catch(error => res.status(400).json({ error }))
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
    // Like value
    let like = req.body.like
    // UserId of the request
    const userId = req.body.userId
    // Sauce Id by params request
    const productId = req.params.id
        // If user liked the sauce
        if(like === 1){
            Sauce.updateOne(
                { _id: productId },
                {
                    $inc : {likes : like++},
                    $push : {usersLiked : userId}
                })
                .then(() => {
                    res.status(200).json({message : "You liked this sauce !"})
                })
                .catch((error) => {
                    res.status(400).json({error})
                })
        }
        // If user disliked the Sauce
        else if(like === -1){
            Sauce.updateOne(
                { _id: productId },
                {
                  $inc: { dislikes: like++ * -1 },
                  $push: { usersDisliked: userId },
                }
              )
                .then((sauce) => res.status(200).json({message: "Ajout Dislike"}))
                .catch((error) => res.status(400).json({error}));
        }
        // If user is neutral
        else{
            Sauce.findOne({ _id: productId })
            .then((sauce) => {
              if (sauce.usersLiked.includes(userId)) {
                Sauce.updateOne(
                  { _id: productId },
                  { $pull: { usersLiked: userId }, $inc: { likes: -1 } }
                )
                  .then((sauce) => {
                    res.status(200).json({ message: "Suppression Like" });
                  })
                  .catch((error) => res.status(400).json({ error }));
              } else if (sauce.usersDisliked.includes(userId)) {
                Sauce.updateOne(
                  { _id: req.params.id },
                  {
                    $pull: { usersDisliked: productId },
                    $inc: { dislikes: -1 },
                  }
                )
                  .then((sauce) => {
                    res.status(200).json({ message: "Suppression Dislike" });
                  })
                  .catch((error) => res.status(400).json({ error }));
              }
            })
        }  
}