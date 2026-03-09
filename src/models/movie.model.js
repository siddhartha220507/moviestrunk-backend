const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({
    title: String,
    poster: String,
    description: String,
    releaseDate: String,
    trailer: String,
    genre: String,
    category: String
}, { timestamps: true });

module.exports = mongoose.model("Movie", movieSchema);
