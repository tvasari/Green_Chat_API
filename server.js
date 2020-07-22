const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const knex = require('knex');
const cors = require('cors');
const bcrypt = require('bcrypt');
const helmet = require('helmet');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

const register = require('./controllers/register.js');

app.use(helmet());
app.use(cors());
app.use(express.json());

const db = knex({
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        user: 'postgres',
        password: 'test',
        database: 'the_green_chat'
    }
})

const jwtSecretKey = ':Q}5?$!K"@Fo+K5';

app.get('/', (req, res) => {
    res.send('it is working')
})
app.post('/register', (req, res) => register.handleRegister(req, res, bcrypt, jwt, jwtSecretKey, nodemailer, dotenv, db));
app.get('/authorization/:token', (req, res) => {
    jwt.verify(req.params.token, jwtSecretKey, (err, decoded) => {
        err
        ? res.send(err)
        : db('login')
        .where('email', '=', decoded.email)
        .update({is_confirmed: true}, ['username', 'email'])
        .then(data => res.redirect('http://localhost:3000/login'))
    });
})

io.on('connection', socket => {
    console.log('a client connected')
    socket.on('chat message', msg => {
        io.emit('chat message', msg)
    })
});

http.listen(3001, console.log(`listening to port 3001`));