const handleRegister = (req, res, bcrypt, jwt, jwtSecretKey, nodemailer, dotenv, db) => {

    const {username, email, password} = req.body;

    dotenv.config()

    const hash = bcrypt.hashSync(password, 10, (err, hash) => {
        err ? console.log(err) : hash
    });

    db('login')
    .insert({
        username: username,
        email: email,
        hash: hash
    })
    .returning(['username', 'email'])
    .then(user => {
        db('register')
        .insert(...user)
        .returning('email')
        .then(userEmail => res.json(userEmail))
        .catch(err => res.status(400).json('Errore durante la registrazione'))
    })
    .catch(err => res.status(400).json('Errore durante la registrazione'));
    
    const token = jwt.sign(
        { email: email, username: username }, 
        jwtSecretKey,
        { expiresIn: '1d'}
    );

    const authorizationLink = `http://localhost:3001/authorization/${token}`;

    const senderUser = {
        user: 'tommasovasari@tommasovasari.com',
        pass: process.env.SENDER_PASS
    };

    let transporter = nodemailer.createTransport({
        host: 'smtp.dreamhost.com',
        port: 465,
        secure: true,
        auth: senderUser
    });

    let messageText = `
        <h3>Ciao, ${username}</h3>
        <a href='${authorizationLink}'>Conferma il tuo account</a>
    `

    transporter.sendMail(
        {
            from: '"Tommaso Vasari" <tommasovasari@tommasovasari.com>',
            to: `${email}`,
            subject: "Conferma il tuo account...",
            html: messageText
        },
        (err, info) => {
            err
            ? console.log('Errore: ', err)
            : console.log('Email inviata correttamente!')
        }
    );

}

module.exports = {
    handleRegister: handleRegister
}