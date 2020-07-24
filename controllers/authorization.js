const handleAuthorization = (req, res, jwt, jwtSecretKey, db) => {

    jwt.verify(req.params.token, jwtSecretKey, (err, decoded) => {
        err
        ? res.send(err)
        : db('login')
        .where('email', '=', decoded.email)
        .update({is_confirmed: true}, ['username', 'email'])
        .then(data => res.redirect('http://localhost:3000/login'))
    });

}

module.exports = {
    handleAuthorization: handleAuthorization
}