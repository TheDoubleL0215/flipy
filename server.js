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
    console.log(req.body)
    db.query('SELECT * FROM users WHERE username = ? OR email = ?', [req.body.username, req.body.email], (error, result) => {
        if(error){
            console.log("Hiba a '/registerNewUser'-nél ", error)
        }
        if(result.length > 0){
            //console.log(result)
            return res.json({exist: true})
        }else{
            db.query('INSERT INTO users SET ?', {
                username: req.body.username,
                email: req.body.email,
                pwd: sha256(req.body.pwd),
                flipy_id: crypto.randomBytes(5).toString('hex')
            }, (error, result) => {
                if(error){
                    console.log("Hiba a /registerNewUser adatbázisával", error)
                }else{
                    //console.log(result)
                    res.json({exist: false})
                }
            })

        }
    })
})

app.post('/loginUser', (req, res) => {
    //Expected: {username, pwd}
    //console.log(req.body)
    db.query('SELECT * FROM users WHERE username = ?', [req.body.username], (error, result) => {
        //console.log("találat: ", result)
        if(error){
            console.log("Hiba a '/loginUser'-nél ", error)
        }
        if(result.length == 1){
            result.forEach(record => {
                if(record.pwd == sha256(req.body.pwd)){
                    const token = jwt.sign({username: record.username, flipy_id: record.flipy_id}, process.env.JWT_SERVER_ACCES_TOKEN)
                    // Sütik beállítása
                    var inFifteenMinutes = new Date(new Date().getTime() + 15 * 60 * 1000);
                    res.cookie("token", token, { httpOnly: true , expires: inFifteenMinutes})
                    // Válasz küldése
                    res.json({exist: true, pwd_valid: true, jwt_token: token})
                    //res.redirect('/home')
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