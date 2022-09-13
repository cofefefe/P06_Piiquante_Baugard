const jwt = require('jsonwebtoken')
const path = require('path')

// Initialzing Dotenv for security
require("dotenv").config({
    path: path.resolve(__dirname, './routes/.env')
});

module.exports = (req, res, next) => {
    try {
        // .split(' ')[1] give back the secund part of 'authorization', Cancel 'bearer' and callback token
        const token = req.headers.authorization.split(' ')[1];
        // Verify token with the key token
        const decodedToken = jwt.verify(token, process.env.TOKEN )
        const userId = decodedToken.userId
        if (req.body.userId && req.body.userId !== userId) {
            throw `Vous n'y êtes pas autorisé !`
        } else {
            next()
        }
    } catch (error) {
        res.status(401).json({error})
    }
}