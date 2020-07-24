const handleLogin = (req, res, bcrypt, db) => {

    const {username, password} = req.body;

    db('login')
    .where({username: username})
    .select('hash', 'is_confirmed')
    .then(credentials => {
        bcrypt.compare(
            password, 
            credentials[0].hash, 
            (err, result) => err ? res.json(err) : res.json(result)
        )
        // TODO check if password and is_confirmed are true and then change route to dashboard on the front end
    })
    .catch(err => res.json(err))
}

module.exports = {
    handleLogin: handleLogin
}