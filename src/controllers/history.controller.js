const historyModel = require("../models/history.model");

async function addHistoryController(req, res) {
    try {
        const { movieId, title, posterPath } = req.body;
        const userId = req.user.id;

        // Optionally, check if they already watched it and update the watchedAt time
        const existingHistory = await historyModel.findOne({ userId, movieId });

        if (existingHistory) {
            existingHistory.watchedAt = Date.now();
            await existingHistory.save();
            
            return res.status(200).json({
                message: "Watch history updated",
                history: existingHistory
            });
        }

        const newHistory = await historyModel.create({
            userId,
            movieId,
            title,
            posterPath
        });

        res.status(201).json({
            message: "Added to watch history",
            history: newHistory
        });

    } catch (error) {
        res.status(500).json({ message: "Failed to add history", error: error.message });
    }
}

async function getHistoryController(req, res) {
    try {
        const userId = req.user.id;
        
        const history = await historyModel.find({ userId }).sort({ watchedAt: -1 });

        res.status(200).json({
            message: "History fetched successfully",
            history
        });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch history", error: error.message });
    }
}

async function clearHistoryController(req, res) {
    try {
        const userId = req.user.id;

        await historyModel.deleteMany({ userId });

        res.status(200).json({
            message: "Watch history cleared successfully"
        });
    } catch (error) {
        res.status(500).json({ message: "Failed to clear history", error: error.message });
    }
}


module.exports = {
    addHistoryController,
    getHistoryController,
    clearHistoryController
};
