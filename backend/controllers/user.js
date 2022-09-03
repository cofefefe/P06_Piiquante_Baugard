// Security dependancies, hash passworld, create token
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
//Import User Model
const User = require('../models/user')


exports.signup = (req, res, next) => {
    // crypt the password
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            // create new User
            const user = new User({
                email :    req.body.email,
                password : hash,
            })
            // save the user
            user.save()
                .then((r) => {
                    console.log("r", r)
                    return res.status(201).json({message: "utilisateur créé !"})
                    }
                )
                .catch((error) => {
                    return res.status(400).json({error})
                })
        })
        .catch((error)=> res.status(500).json({error}))
};


exports.login = (req, res, next) => {
    User.findOne({email:req.body.email})
        .then((user)=>{
            if(!user){
                return res.status(401).json({message:"Paire identifiant/mot de passe incorrect"})
            }
            bcrypt.compare(req.body.password, user.password)
                .then((valid)=>{
                    if(!valid){
                        return res.status(401).json({message:"Paire identifiant/mot de passe incorrect"})
                    }
                    res.status(200).json({
                        userId : user._id,
                        token : jwt.sign(
                            { userId:user._id },
                            "RANDOM_TOKEN_SECRET",
                            { expiresIn:'24h'}
                        )
                    })
                })
                .catch((error)=> res.status(500).json({error}))
        })
        .catch((error)=> res.status(500).json({error}))
};