
const bcrypt = require("bcrypt");
const User = require("../models/User-model");
const jwt = require("jsonwebtoken");


// ==================================================================================
// "POST" ==> User Sign In
// ==================================================================================
exports.signup = (req, res, next) => {

    bcrypt.hash(req.body.email, 12)
    .then(email => {

        bcrypt.hash(req.body.password, 12)
        .then(hash => {

            const user = new User({
                email: email,
                password: hash
            })

            user.save()
            .then(() => res.status(201).json({ message: "Utilisateur créé !" }))
            .catch(error => res.status(400).json({ error }));

        }).catch(error => res.status(501).json({ error }));

    }).catch(error => res.status(500).json({ error }));
};


// ==================================================================================
// "POST" ==> User Login
// ==================================================================================
exports.login = (req, res, next) => {
    
    User.find()
    .then( async (users) => {
        
        let userArray = [];
        
        for (i = 0; i < users.length; i++) {
            let user = users[i];

            await bcrypt.compare(req.body.email, users[i].email)
            .then(emailValid => {
                
                if(emailValid) return userArray.push(user);
                else return;
                
            }).catch(error => res.status(501).json({ error }));
        }


        const userIdInsideDB = userArray[0]._id;
        const passwordHashed = userArray[0].password;
        
        bcrypt.compare(req.body.password, passwordHashed)
        .then(passwordValid => {
            if(!passwordValid) return res.status(401).json({ message: "Mot de passe incorrect !" });

            res.status(200).json({
                userId: userIdInsideDB,                
                token: jwt.sign(
                    { userId: userIdInsideDB },
                    "RANDOM_TOKEN_SECRET",
                    { expiresIn: "24h" }
                )
            });

        }).catch(error => res.status(502).json({ error }));

    }).catch(error => res.status(500).json({ error }));
};