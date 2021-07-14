
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");


const sauceRoutes = require("./routes/sauce-routes.js");
const userRoutes = require("./routes/user-routes.js");

const app = express();

// =================================================================================
// Create promise to interact with DataBase
// =================================================================================
mongoose.connect("mongodb+srv://seraphin:E23xb138@cluster0.cahn8.mongodb.net/Projet_06_DataBase?retryWrites=true&w=majority",
{
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("Connexion à MongoDB réussie !"))
.catch(() => console.log("Connexion à MongoDB échouée !"));


// =================================================================================
// Disable CORS errors
// =================================================================================
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
    next();
});


app.use(bodyParser.json());

app.use("/pictures", express.static(path.join(__dirname, "pictures")));
app.use("/api/auth", userRoutes);
app.use("/api/sauces", sauceRoutes);


module.exports = app;