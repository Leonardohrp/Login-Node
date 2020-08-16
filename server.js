const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
const { json } = require('express')
const sqllite = require('sqlite3').verbose()

// Configura string para hash
require('dotenv').config()

// Setando a view engine para .ejs
app.set('view-engine', 'ejs')

// Setando servidor para usar json
app.use(express.json())

// Dentro do método POST o parametro req torna a DOM acessivel
app.use(express.urlencoded({extended: false}))

app.get('/index', (req, res) => {
  res.render('index.ejs')
})

app.get('/login', (req, res) => {
    res.render('login.ejs')
})

app.post('/login', async (req, res) => {
  var email = ''
  var password = ''
  try {
    await new Promise ((resolve, reject) => {
      let db = new sqllite.Database('./model/arquivo.db')
      db.get('SELECT email, password FROM usuarios WHERE email = ?', req.body.email, (err, row) => {
        if(!row){
          console.log('Email não cadastrado')
          return res.redirect('/login')
        }
        email = row.email
        password = row.password
        db.close()
        resolve();
      })
    }, 0)

    if (await bcrypt.compare(req.body.password, password)) {
      console.log('Logado com sucesso')
      return res.redirect('/index')
    }
    else {
      var elemento = req.document.createElement('p');
      var textNode = req.document.createTextNode('Senha Incorreta')
      elemento.appendChild(textNode)
      res.body.appendChild(elemento)
      console.log('Senha incorreta')
      return res.redirect('/login')
    }
  } catch (err) {
    res.status(500).send
  }
})

// Rota para renderizar tela de cadastro
app.get('/cadastro', (req, res) => {
    res.render('cadastro.ejs')
})

// Inserir dados no banco
app.post('/cadastro', async (req, res) => {
    try{
        let db = new sqllite.Database('./model/arquivo.db')
        const hashPassword = await bcrypt.hash(req.body.password, 10)
        await db.run('INSERT INTO usuarios (nome, email, password) VALUES (?,?,?)', req.body.name, req.body.email, hashPassword)
        db.close() 
        res.redirect('/login')
    } catch {
        db.close()
        res.redirect('/cadastro')
    }
})

app.listen(3001)