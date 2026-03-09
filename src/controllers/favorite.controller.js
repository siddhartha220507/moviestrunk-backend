const favoriteModel = require("../models/favorite.model");

async function addFavoriteController(req, res) {
    try {
        const { movieId, title, posterPath } = req.body;
        const userId = req.user.id; // From authMiddleware

        // Check if already favorited
        const isAlreadyAdded = await favoriteModel.findOne({ userId, movieId });
        
        if (isAlreadyAdded) {
            return res.status(409).json({ message: "Movie already in favorites" });
        }

        const newFavorite = await favoriteModel.create({
            userId,
            movieId,
            title,
            posterPath
        });

        res.status(201).json({
            message: "Added to favorites successfully",
            favorite: newFavorite
        });

    } catch (error) {
        res.status(500).json({ message: "Failed to add favorite", error: error.message });
    }
}

async function getFavoritesController(req, res) {
    try {
        const userId = req.user.id;
        
        const favorites = await favoriteModel.find({ userId }).sort({ addedAt: -1 });

        res.status(200).json({
            message: "Favorites fetched successfully",
            favorites
        });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch favorites", error: error.message });
    }
}

async function removeFavoriteController(req, res) {
    try {
        const { movieId } = req.params;
        const userId = req.user.id;

        const deletedFavorite = await favoriteModel.findOneAndDelete({ userId, movieId });

        if (!deletedFavorite) {
            return res.status(404).json({ message: "Movie not found in favorites" });
        }

        res.status(200).json({
            message: "Removed from favorites successfully"
        });
    } catch (error) {
        res.status(500).json({ message: "Failed to remove favorite", error: error.message });
    }
}

module.exports = {
    addFavoriteController,
    getFavoritesController,
    removeFavoriteController
};
