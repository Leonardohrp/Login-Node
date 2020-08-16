const sqllite = require('sqlite3').verbose()
var db = new sqllite.Database('./model/arquivo.db')


db.run('CREATE TABLE if not exists usuarios (id INTEGER PRIMARY KEY AUTOINCREMENT,nome TEXT NOT NULL, email TEXT NOT NULL UNIQUE, password TEXT NOT NULL )')

db.close()





    

