// Security dependancies, hash passworld, create token
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const bodyParser = require('body-parser')
const dotenv = require('dotenv')
const path = require('path')
//Import User Model
const User = require('../models/user')
const regex = require('../middleware/checking_mail_password')
// Retrieve .env for token key
dotenv.config({
    path: path.resolve(__dirname, '.env')
});

exports.signup = (req, res, next) => {
    const password = req.body.password
    const email = req.body.email
    if (!regex.clientEmailVerification(email) || !regex.clientPasswordVerification(password)) {
        return res.status(400).json({ message: "Votre mot de passe doit contenir 8 caractère et a minima un nombre et une lettre" })
    }
    bcrypt.hash(password, 10)
        .then(hash => {
            // create new User with mongoose schema
            const user = new User({
                email: email,
                password: hash,
            })
            // save the user
            user.save()
                .then(() => {
                    return res.status(201).json({ message: "utilisateur créé !" })
                }
                )
                .catch((error) => {
                    return res.status(400).json({ error })
                })
        })
        .catch((error) => res.status(500).json({ error }))
}



exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
        .then((user) => {
            if (!user) {
                return res.status(401).json({ message: "Paire identifiant/mot de passe incorrect" })
            }
            bcrypt.compare(req.body.password, user.password)
                .then((valid) => {
                    if (!valid) {
                        return res.status(401).json({ message: "Paire identifiant/mot de passe incorrect" })
                    }
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id },
                            process.env.TOKEN,
                            { expiresIn: '24h' }
                        )
                    })
                })
                .catch((error) => res.status(500).json({ error }))
        })
        .catch((error) => res.status(500).json({ error }))
};