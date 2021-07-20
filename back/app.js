
require("dotenv").config();

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");


const sauceRoutes = require("./routes/sauce-routes.js");
const userRoutes = require("./routes/user-routes.js");


// =================================================================================
// Create promise to interact with DataBase
// =================================================================================
mongoose.connect(process.env.ATLAS_URI,
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