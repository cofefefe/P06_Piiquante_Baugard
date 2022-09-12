const jwt = require('jsonwebtoken')
const path = require('path')

require("dotenv").config({
    path: path.resolve(__dirname, './routes/.env')
});

module.exports = (req, res, next) => {
    try {
        // .split(' ')[1] retourne la deuxième partie de l'autorisation et pas le bearer "bearer xxxxxxx"
        const token = req.headers.authorization.split(' ')[1];
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