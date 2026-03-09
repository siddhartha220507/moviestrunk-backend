const mongoose = require("mongoose");

const favoriteSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    movieId: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    posterPath: {
        type: String
    },
    addedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

const favoriteModel = mongoose.model("favorites", favoriteSchema);

module.exports = favoriteModel;
