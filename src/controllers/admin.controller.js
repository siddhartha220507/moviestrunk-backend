const Movie = require("../models/movie.model");

const addMovie = async (req, res) => {
    try {
        const movie = await Movie.create(req.body);
        res.status(201).json(movie);
    } catch (error) {
        res.status(500).json({ message: "Failed to add movie", error: error.message });
    }
};

const getMovies = async (req, res) => {
    try {
        const movies = await Movie.find();
        res.status(200).json(movies);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch movies", error: error.message });
    }
};

const updateMovie = async (req, res) => {
    try {
        const movie = await Movie.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!movie) return res.status(404).json({ message: "Movie not found" });
        res.status(200).json(movie);
    } catch (error) {
        res.status(500).json({ message: "Failed to update movie", error: error.message });
    }
};

const deleteMovie = async (req, res) => {
    try {
        const movie = await Movie.findByIdAndDelete(req.params.id);
        if (!movie) return res.status(404).json({ message: "Movie not found" });
        res.status(200).json({ message: "Movie deleted" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete movie", error: error.message });
    }
};

const getAllUsers = async (req, res) => {
    try {
        // Find all users except the ones with the "admin" role
        const userModel = require("../models/user.model");
        const users = await userModel.find({ role: { $ne: "admin" } }).select("-password");
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Failed to get users", error: error.message });
    }
};

const banUser = async (req, res) => {
    try {
        const userModel = require("../models/user.model");
        const user = await userModel.findById(req.params.id);
        
        if (!user) return res.status(404).json({ message: "User not found" });
        if (user.role === "admin") return res.status(403).json({ message: "Cannot ban an admin" });

        user.isBanned = !user.isBanned; // Toggle ban status
        await user.save();

        res.status(200).json({ 
            message: `User successfully ${user.isBanned ? 'banned' : 'unbanned'}`,
            user 
        });
    } catch (error) {
        res.status(500).json({ message: "Failed to update ban status", error: error.message });
    }
};

const deleteUser = async (req, res) => {
    try {
        const userModel = require("../models/user.model");
        const user = await userModel.findById(req.params.id);

        if (!user) return res.status(404).json({ message: "User not found" });
        if (user.role === "admin") return res.status(403).json({ message: "Cannot delete an admin" });

        await userModel.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete user", error: error.message });
    }
};

module.exports = {
    addMovie,
    getMovies,
    updateMovie,
    deleteMovie,
    getAllUsers,
    banUser,
    deleteUser
};
