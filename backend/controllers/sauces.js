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
    // Valeur de like dans la requête
    const like = req.body.like
    // Valeur de userId dans la requête
    const userId = req.body.userId
    // Id de la sauce dans les paramètres de la requête
    const productId = req.params.id

  
    // cas 0 : L'utilisateur aime le produit ( like )
        // Nous avons besoin de l'user Id à insérer dans le tableau 'usersLiked'(??model??)
        // Nous devons prendre la valeur de like(??requête??), et la modifier en conséquence (+1)

    // cas 1 : L'utilisateur annule son like/dislike
        // Nous avons besoin de l'userId, afin de le retirer du tableau 'usersLiked' ou 'usersDisliked'(??model??)
        // Nous devons redéfinir une valeur neutre ( 0 ) à Like et Dislike(??requête??)

    // cas 2 : L'utilisateur n'aime pas le produit ( dislike )
        // Nous avons besoin de l'userId à insérer dans le tableau 'usersDisliked'(??model??)
        // Nous devons définir la valeur de dislike(??requête??) a +1
}