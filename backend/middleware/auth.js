const jwt = require('jsonwebtoken')
const path = require('path')

// Initialzing Dotenv for security and give the path of .env
require("dotenv").config({
    path: path.resolve(__dirname, '../.env')
});

module.exports = (req, res, next) => {
    try {
        // split to delete 'bearer' and take just token after the white space
        const token = req.headers.authorization.split(' ')[1]
        // verify token auth with the key token
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET')
        // retrieve the user linked with this token
        const userId = decodedToken.userId;
        // if the user is not the creator of the sauce
        if (req.body.userId && req.body.userId !== userId) {
            throw 'User ID non valable !';
        }
        // if he's the creator, continue to the next middleware according client request
        else {
            next();
        }
    } catch (error) {
        res.status(401).json({ error: error | 'Requête non authentifiée !' });
    }
}