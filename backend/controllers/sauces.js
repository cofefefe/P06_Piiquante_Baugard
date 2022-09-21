// import models and dependancies to manage files (fs), middleware auth to manage security, and to access body request (bodyParser).
const Sauce = require('../models/sauces')
const fs = require('fs')
const auth = require('../middleware/auth')
const bodyParser = require('body-parser')

// Create an object 'sauce'
exports.addSauce = (req,res,next) => {
    // take all datas of the sauce
    const sauceObject = JSON.parse(req.body.sauce)
    // Deleting the secund id
    delete sauceObject._id
    // use sauce's models to create an object
  const sauce = new Sauce({
    // retrieve all key/values and specify default values
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
  })
}

// Delete a sauce
exports.deleteSauce = (req, res, next) => {
    // Find the sauce by id
    Sauce.findOne({ _id: req.params.id})
        .then(sauce => {
            // retrieve filename by path of img
                const filename = sauce.imageUrl.split('/images/')[1]
                // Delete the img of sauce removed
                fs.unlink(`images/${filename}`, () => {
                    Sauce.deleteOne({_id: req.params.id})
                        .then(() => { res.status(200).json({message: 'Objet supprimé !'})})
                        .catch(error => res.status(401).json({ error }))
                });
            })
        .catch( error => {
            res.status(500).json({ error });
            console.log({error})
        });
 };

// Modify sauce and update our new data
exports.modifySauce = (req, res, next) => {
    // Retrieve this sauce from data base by id with findOne method
    Sauce.findOne({ _id: req.params.id }) 
    .then((sauce) => {
        console.log("req.body.sauce", JSON.parse(req.body.sauce))

        let sauceObject = {...req.body.sauce};
        sauceObject.imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;

        // Delete the old image
        // retrieve the file name thanks to their url
        const filename = sauce.imageUrl.split("/images/")[1];
        fs.unlink(`images/${filename}`, function () {
            // Update the new sauce object with the new data
            Sauce.updateOne({_id: req.params.id}, {...sauceObject, _id: req.params.id})
                .then(() => res.status(200).json({message: 'Sauce modifiée !'}))
                .catch(error => res.status(400).json({error}));
        });
    })
}
  
// Find sauce
exports.findSauce = (req,res,next) => {
    // Using id to find the and show the sauce
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
        // Using id to find the and show all sauces
    Sauce.find()
    .then((sauces)=>{
        res.status(200).json(sauces)
        })
        .catch((error)=>{
            res.status(400).json({error})
        })
}


exports.likeDislikeSauce = (req, res, next) => {
  // Find the sauce in the data base
  Sauce.findOne({ _id: req.params.id })
      .then(sauce => {
          // reset like and dislike 
          resetUserLikeAndDislike(sauce);

          // Updating like and dislike with incrementation
          switch (req.body.like) {
              case 1:
                  // Like
                  sauce.usersLiked.push(req.body.userId);
                  sauce.likes++;
                  break;
              case -1:
                  // Dislike
                  sauce.usersDisliked.push(req.body.userId);
                  sauce.dislikes++;
                  break;
          }
          // Save new value of like/dislike
          sauce.save()
              .then(() => res.status(200).json({ message: 'Sauce modifiée' }))
              .catch(error => res.status(400).json({ error }));
      })
      .catch(error => res.status(400).json({ error }));

  function resetUserLikeAndDislike(sauce) {
      // Find users who liked and disliked the sauce
      const indexUserLiked = sauce.usersLiked.indexOf(req.body.userId);
      const indexUserDisliked = sauce.usersDisliked.indexOf(req.body.userId);

      if (indexUserLiked > -1) {
          // if user liked the sauce
          sauce.usersLiked.splice(indexUserLiked, 1);
          sauce.likes--;
      }
      if (indexUserDisliked > -1) {
          // if user disliked the sauce
          sauce.usersDisliked.splice(indexUserDisliked, 1);
          sauce.dislikes--;
      }
  }
}