
const Sauce = require("../models/Sauce-model");
const fs = require("fs");

// ==================================================================================
// "GET" ==> Get all sauces in DataBase
// ==================================================================================
exports.getAllSauce = (req, res, next) => {
    
    Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({ error }));
}


// ==================================================================================
// "GET" ==> Get one sauce by ID in DataBase
// ==================================================================================
exports.getOneSauce = (req, res, next) => {
    
    Sauce.findOne({ _id: req.params.id })
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({ error }));
}


// ==================================================================================
// "POST" ==> Create one sauce in DataBase
// ==================================================================================
exports.createSauce = (req, res, next) => {
    
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    
    const sauce = new Sauce({
        userId: req.body.userId,
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get("host")}/pictures/${req.file.filename}`,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: []
    });

    sauce.save()
    .then(() => res.status(201).json({ message: "Sauce enregistrée !" }))
    .catch(error => res.status(400).json({ error }));
}


// ==================================================================================
// "PUT" ==> Modify one sauce by ID in DataBase
// ==================================================================================
exports.modifySauce = (req, res, next) => {
    
    const sauceObject = 
    req.file
    ? {...JSON.parse(req.body.sauce), imageUrl: `${req.protocol}://${req.get("host")}/pictures/${req.file.filename}`}
    : {...req.body}

    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
    .then(() => res.status(200).json({ message: "Sauce modifiée !"}))
    .catch(error => res.status(404).json({ error }));
}


// ==================================================================================
// "DELETE" ==> Delete one sauce by ID in DataBase
// ==================================================================================
exports.deleteOneSauce = (req, res, next) => {
    
    Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
        const fileName = sauce.imageUrl.split("/pictures/")[1];
        
        fs.unlink(`pictures/${fileName}`, () => {

            Sauce.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: "Sauce supprimée !"}))
            .catch(error => res.status(404).json({ error }));
        });
    })
    .catch(error => res.status(500).json({ error }));
}


// ==================================================================================
// "POST" ==> Like, no opinion, dislike a sauce in DataBase
// ==================================================================================
exports.likeDislikeSauce = (req, res, next) => {

    Sauce.findOne({ _id: req.params.id })
    .then(sauce => {

        const userId = req.body.userId;
        const like = req.body.like;
        const likeArray = sauce.usersLiked;
        const dislikeArray = sauce.usersDisliked;

        if (like === 1) {
            likeArray.push(userId);
            sauce.likes ++;
            sauce.save();
        }

        else if (like === -1) {
            dislikeArray.push(userId);
            sauce.dislikes ++;
            sauce.save();
        }

        else if (like === 0) {
            
            if (likeArray.includes(userId)) {
                removeUser(likeArray, userId);
                sauce.likes --;
            }
    
            else if (dislikeArray.includes(userId)) {
                removeUser(dislikeArray, userId);
                sauce.dislikes --;
            }

            sauce.save();
        }
    })
    .then(() => res.status(200).json({ message: "Like modifiée !"}))
    .catch(error => res.status(400).json({ error }));
}


// Search userID index in like/dislike array
const removeUser = (array, userId) => {
    const userIndex = array.indexOf(userId);
    array.splice(userIndex, 1);
}