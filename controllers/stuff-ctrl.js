
const Thing = require("../models/Thing-model");

// ==================================================================================
// "POST" ==> Create one object in DataBase
// ==================================================================================
exports.createThing = (req, res, next) => {
    
    delete req.body._id;
    const thing = new Thing({
        ...req.body
    });
    
    thing.save()
    .then(() => res.status(201).json({ message: "Objet enregistré !" }))
    .catch(error => res.status(400).json({ error }));
}


// ==================================================================================
// "PUT" ==> Modify one object by ID in DataBase
// ==================================================================================
exports.modifyThing = (req, res, next) => {
    
    Thing.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
    .then(() => res.status(200).json({ message: "Objet modifié !"}))
    .catch(error => res.status(404).json({ error }));
}


// ==================================================================================
// "DELETE" ==> Delete one object by ID in DataBase
// ==================================================================================
exports.deleteOneThing = (req, res, next) => {
    
    Thing.deleteOne({ _id: req.params.id })
    .then(() => res.status(200).json({ message: "Objet supprimé !"}))
    .catch(error => res.status(404).json({ error }));
}


// ==================================================================================
// "GET" ==> Get one object by ID in DataBase
// ==================================================================================
exports.getOneThing = (req, res, next) => {
    Thing.findOne({ _id: req.params.id })
    .then(thing => res.status(200).json(thing))
    .catch(error => res.status(404).json({ error }));
}


// ==================================================================================
// "GET" ==> Get all objects in DataBase
// ==================================================================================
exports.getAllThing = (req, res, next) => {
    
    Thing.find()
    .then(things => res.status(200).json(things))
    .catch(error => res.status(400).json({ error }));
}