const express = require("express");

const { protect } = require("../middleware/authMiddleware.js");
const admin = require("../middleware/adminMiddleware.js");

const {
    addMovie,
    getMovies,
    updateMovie,
    deleteMovie,
    getAllUsers,
    banUser,
    deleteUser
} = require("../controllers/admin.controller.js");

const router = express.Router();

router.post("/movie", protect, admin, addMovie);
router.get("/movies", protect, admin, getMovies);
router.put("/movie/:id", protect, admin, updateMovie);
router.delete("/movie/:id", protect, admin, deleteMovie);

// Users management
router.get("/users", protect, admin, getAllUsers);
router.put("/user/ban/:id", protect, admin, banUser);
router.delete("/user/:id", protect, admin, deleteUser);

module.exports = router;
