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
    console.log({sauceObject})
    console.log({sauce})
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
exports.findSauce = (req,res,next) => {
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


exports.likeDislikeSauce = (req, res, next) => {
  // 1. Trouver la sauce dans la DB
  Sauce.findOne({ _id: req.params.id })
      .then(sauce => {
          // 2. Réinitialiser ses like et dislike
          resetUserLikeAndDislike(sauce);

          // 3. Mettre à jour ses like et dislike
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
          sauce.save()
              .then(() => res.status(200).json({ message: 'Sauce modifiée' }))
              .catch(error => res.status(400).json({ error }));
      })
      .catch(error => res.status(400).json({ error }));

  function resetUserLikeAndDislike(sauce) {
      // chercher le "UserLiked" ou "UserDisliked" index de l'utilisateur actuel
      const indexUserLiked = sauce.usersLiked.indexOf(req.body.userId);
      const indexUserDisliked = sauce.usersDisliked.indexOf(req.body.userId);

      if (indexUserLiked > -1) {
          // L'utilisateur à été trouvé dans la list des like
          sauce.usersLiked.splice(indexUserLiked, 1);
          sauce.likes--;
      }
      if (indexUserDisliked > -1) {
          // L'utilisateur à été trouvé dans la liste des dislike
          sauce.usersDisliked.splice(indexUserDisliked, 1);
          sauce.dislikes--;
      }
  }
}