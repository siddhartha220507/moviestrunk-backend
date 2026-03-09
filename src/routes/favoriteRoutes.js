const express = require("express");
const favoriteController = require("../controllers/favorite.controller");
const { protect } = require("../middleware/authMiddleware");

const favoriteRouter = express.Router();

// All favorite routes require the user to be logged in
favoriteRouter.use(protect);

favoriteRouter.post("/add", favoriteController.addFavoriteController);
favoriteRouter.get("/", favoriteController.getFavoritesController);
favoriteRouter.delete("/remove/:movieId", favoriteController.removeFavoriteController);

module.exports = favoriteRouter;
