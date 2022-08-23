const app = require('./app')

const http = require('http')
const server = http.createServer((req,res)=>{
    res.end('serveur créé !')
})
server.listen(3000)

app.set('port', 3000)

app.use((req,res)=>{
    res.json({message:"requête réussie"})
})