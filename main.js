const express = require('express');
//para criação de rotas dinamicas
const multer = require('multer');
//para lidar com as imagens
const cors = require('cors');
//para permitir a conexão entre o back e o front
const path = require('path');
//para lidar com o caminho das imagens
const bcrypt = require('bcrypt')

const app = express();

app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use(cors())

var {usuario} = require('./models')
var {duvida} = require('./models');
var {comentario} = require('./models');

const storage = multer.diskStorage({
    destination:(req, file, cb) => {
        if(file.fieldname == "pfp"){
            cb(null, 'upload/pfp')
        }
        else if (file.fieldname == "banner"){
            cb(null, 'upload/banner')
        }
        else if (file.fieldname == "duvida"){
            cb(null, 'upload/duvida')
        }
        else if (file.fieldname == "imgComentario"){
            cb(null, 'upload/imgComentario')
        }
    },
    filename:function(req, file, cb){
        cb(null, Date.now() + "_" + file.originalname)
    },
})
//configurando multer, destino das imagens e o nome delas

const upload = multer({storage:storage})
//aplicando a minha configuração ao multer e guardando em uma variavel para não precisar repetir

app.get('/usuarios', async function(req, res){
    const usuarios = await usuario.findAll()
    res.json(usuarios)
})
//rota para obter os usuarios

app.get('/duvidas', async function(req, res){
    const duvidas = await duvida.findAll({include:[{model:comentario, as:'comentario'}]})
    res.json(duvidas)
})
//rota para obter os duvidas

app.get('/comentarios', async function(req, res){
    const comentarios = await comentario.findAll()
    res.json(comentarios)
})

app.post('/login', async function(req, res){
    const {email, senha} = req.body
    const usuarioFound = await usuario.findAll({
        where:{
            email: email,
        }
    })  
    if(!usuarioFound[0]){
        return res.json(404)
    }
      const checkPassword = await bcrypt.compare(senha, usuarioFound[0].senha)
       if (!checkPassword) {
        return  res.json(401);
      }else{res.json(usuarioFound[0])}
})

app.get('/usuario/pfp/:id', async function(req, res){
    const user = await usuario.findByPk(req.params.id)
    if(!user||!user.pfp){
        return res.status(404).json({message:"imagem não encontrada"})
    }
    const pfp = path.resolve(user.pfp)
    res.sendFile(pfp)
})
//rota para obter a foto de perfil do usuario(pfp)

app.get('/duvida/img/:id', async function(req, res){
    const duvidaEncontrada = await duvida.findByPk(req.params.id)
    if(!duvidaEncontrada||!duvidaEncontrada.duvidaImg){
        return res.status(404).json({message:"imagem não encontrada"})
    }
    const duvidaImagem = path.resolve(duvidaEncontrada.duvidaImg)
    res.sendFile(duvidaImagem)
})
//rota para obter a foto de perfil do usuario(pfp)

app.get('/usuario/banner/:id', async function(req, res){
    const user = await usuario.findByPk(req.params.id)
    if(!user||!user.banner){
        return res.status(404).json({message:"imagem não encontrada"})
    }
    const banner = path.resolve(user.banner)
    res.sendFile(banner)
})
// rota para obter a foto de banner do usuario(banner)

app.get('/comentario/img/:id', async function(req, res){
    const comentarioEncontrado = await comentario.findByPk(req.params.id)
    if(!comentarioEncontrado||!comentarioEncontrado.imgComentario){
        return res.status(404).json({message:"imagem não encontrada"})
    }
    const comentarioImagem = path.resolve(comentarioEncontrado.imgComentario)
    res.sendFile(comentarioImagem)
})

app.post('/usuario', upload.fields([{
    name:'pfp', maxCount:1
},
{
    name:'banner', maxCount:1
}
]), async function (req, res){
    const {nome, cpf, email, senha, desc} = req.body
    const salt = await bcrypt.genSalt(10)
    const senhacrypto = await bcrypt.hash(senha, salt)
    const newusuario = await usuario.create({nome, cpf, email, senha:senhacrypto, desc, pfp:req.files['pfp'][0].path, banner:req.files['banner'][0].path})
    res.json (newusuario)
})
//rota para adicionar um usuario

app.post('/duvida', upload.fields([{
    name:'duvida', maxCount:1
},
]), async function (req, res){
    const {titulo, materia, conteudo, descDuvida, usuarioId} = req.body
    const newduvida = await duvida.create({ titulo, materia, conteudo, descDuvida, duvidaImg:req.files['duvida'][0].path, usuarioId})
    res.json (newduvida)
})

app.delete('/usuario/:id', async function(req, res){
    const usuarioApagado = await usuario.findByPk(req.params.id)
    const usuarios = await usuario.destroy({where:{id:Number(req.params.id)}})   
    res.json(usuarioApagado)
})

app.post('/comentario', upload.fields([{
    name:'imgComentario', maxCount:1
},
]), async function (req, res){
    const {texto, resposta, usuarioId, duvidaId} = req.body
    const newcomentario = await comentario.create({ texto, resposta, imgComentario:req.files['imgComentario'][0].path, usuarioId, duvidaId})
    res.json (newcomentario)
})

app.put('/alterarUsuario', upload.fields([{
    name:'pfp', maxCount:1
},
{
    name:'banner', maxCount:1
}
]), async function (req, res){
    const {id, nome, cpf, email, senha, desc} = req.body
    const salt = await bcrypt.genSalt(10)
    const senhacrypto = await bcrypt.hash(senha, salt)
    const newusuario = await usuario.update({nome, cpf, email, senha:senhacrypto, desc, pfp:req.files['pfp'][0].path, banner:req.files['banner'][0].path}, {where:{ id: id}})
    res.json (newusuario)
})

app.get('/usuario/:id', async function(req, res){
    const usuarioEncontrado = await usuario.findByPk(req.params.ids
        
    )
    res.json(usuarioEncontrado)
})

app.listen(3000);