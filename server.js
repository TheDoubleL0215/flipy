const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const mysql = require('mysql')
const dotenv = require('dotenv')
const sha256 = require('js-sha256')
const jwt = require("jsonwebtoken")
const cookieParser = require("cookie-parser")
const crypto = require('crypto')

dotenv.config({
    path: './.env'
})

const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use(cookieParser())

app.use("/", express.static(__dirname, + '/'));


const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
})

db.connect((err) =>{
    if(err){
        console.log("Az adatbázis hibája: ", err)
    }else{
        console.log("Adatbázis csatlakozva ... http://localhost/phpmyadmin/")
    }
})

app.get('/home', authenticateToken, (req, res) => {
    fs.readFile(path.join(__dirname, 'public', 'home.html'), 'utf8', (err, data) => {
        if (err) {
            console.error('Hiba a HTML fájl olvasása közben:', err);
            res.status(500).send('Internal Server Error');
            return;
        }
        res.send(data);
    });
});

app.get('/', (req, res) => {
    fs.readFile(path.join(__dirname, 'public', 'login.html'), 'utf8', (err, data) => {
        if (err) {
            console.error('Hiba a HTML fájl olvasása közben:', err);
            res.status(500).send('Internal Server Error');
            return;
        }
        res.send(data);
    });
});

app.get('/newDeck', authenticateToken, (req, res) => {
    fs.readFile(path.join(__dirname, 'public', 'newDeck.html'), 'utf8', (err, data) => {
        if (err) {
            console.error('Hiba a HTML fájl olvasása közben:', err);
            res.status(500).send('Internal Server Error');
            return;
        }
        res.send(data);
    });
});

app.get('/register', (req, res) => {
    fs.readFile(path.join(__dirname, 'public', 'register.html'), 'utf8', (err, data) => {
        if (err) {
            console.error('Hiba a HTML fájl olvasása közben:', err);
            res.status(500).send('Internal Server Error');
            return;
        }
        res.send(data);
    });
});






app.post('/registerNewUser', (req, res) =>{
    //Expected: {username, email, pwd}
    //console.log(req.body)
    db.query('SELECT * FROM users WHERE username = ? OR email = ?', [req.body.username, req.body.email], (error, result) => {
        if(error){
            console.log("Hiba a '/registerNewUser'-nél ", error)
        }
        if(result.length > 0){
            //console.log(result)
            return res.json({exist: true})
        }else{
            let createFlipyId = crypto.randomBytes(5).toString('hex')
            db.query('INSERT INTO users SET ?', {
                username: req.body.username,
                email: req.body.email,
                pwd: sha256(req.body.pwd),
                flipy_id: createFlipyId
            }, (error, result) => {
                if(error){
                    console.log("Hiba a /registerNewUser adatbázisával", error)
                }else{
                    //console.log(result)
                    res.json({exist: false})
                    createUsersTable(createFlipyId)
                }
            })

        }
    })
})


function createUsersTable(flipyInDb) {
    const sql = `
    CREATE TABLE IF NOT EXISTS ${flipyInDb} (
        id INT(11) NOT NULL AUTO_INCREMENT,
        flipy_id INT NOT NULL,
        username VARCHAR(30) NOT NULL,
        deck_name VARCHAR(100) NOT NULL,
        description VARCHAR(255) NOT NULL,
        term VARCHAR(100) NOT NULL,
        definition VARCHAR(100) NOT NULL,
        PRIMARY KEY (id)
      )
    `;
    db.query(sql, (err, result) => {
      if (err) throw err;
    });
}

app.post('/loginUser', (req, res) => {
    //Expected: {username, pwd}
    //console.log(req.body)
    db.query('SELECT * FROM users WHERE username = ?', [req.body.username], (error, result) => {
        //console.log("találat: ", result)
        if(error){
            console.log("Recent hiba: Hiba a '/loginUser'-nél ", error)
        }
        if(result.length == 1){
            result.forEach(record => {
                if(record.pwd == sha256(req.body.pwd)){
                    const token = jwt.sign({username: record.username, flipy_id: record.flipy_id}, process.env.JWT_SERVER_ACCES_TOKEN)
                    // Sütik beállítása
                    var inFifteenMinutes = new Date(new Date().getTime() + 15 * 60 * 1000);
                    res.cookie("token", token, { httpOnly: true, expires: inFifteenMinutes})
                    // Válasz küldése
                    //res.redirect('/home')
                    res.json({exist: true, pwd_valid: true, jwt_token: token})
                }else{
                    //console.log("Hibás bejelentkezés!")
                    res.json({exist: true, pwd_valid: false})
                };
            });
        }else{
            //console.log("Nincs ilyen felhasználó!")
            res.json({exist: false, pwd_valid: false})
        }

    })
})

app.get('/doesUserHaveSet', authenticateToken, (req, res) => {
    const verifiedUser = jwt.verify(req.cookies.token, process.env.JWT_SERVER_ACCES_TOKEN,)
    db.query(`SELECT * FROM ${verifiedUser.flipy_id}`, (error, result) => {
        if(error){
            console.log("Hiba a 'haveDatasets'-nél ", error)
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            if(result.length > 0){
                res.json({haveDb: true})
            }else{
                res.json({haveDb: false})
            }
    
        }
    });
})

app.post('/createNewDeck', authenticateToken, (req, res) => {
    // deckElements = {deckName, deckDescr, allTermValues, allDefValues}
    const verifiedUser = jwt.verify(req.cookies.token, process.env.JWT_SERVER_ACCES_TOKEN,)
    console.log(req.body)
    for(var x = 0; x < req.body.allTermValues.length; x++){
        db.query(`INSERT INTO ${verifiedUser.flipy_id} (id, flipy_id, username, deck_name, description, term, definition) VALUES (0, '${verifiedUser.flipy_id}', '${verifiedUser.username}', '${req.body.deckName}', '${req.body.deckDescr}', '${req.body.allTermValues[x]}', '${req.body.allDefValues[x]}')`, (err, result) => {
            if (err) {
                console.log(err)
                res.json({savedToDb: false})
            }
        })

    }
    res.json({savedToDb: true})
})


function authenticateToken(req, res, next) {
    const token = req.cookies.token;
    if (token == null) return res.redirect('/');
    jwt.verify(token, process.env.JWT_SERVER_ACCES_TOKEN, (err, user) => {
        if (err) {
            res.clearCookie('token');
            return res.redirect('/');
        }
    });

    next()
}







app.listen(PORT, () =>{
    console.log(`A szerver fur a http://localhost:${PORT}`);
})