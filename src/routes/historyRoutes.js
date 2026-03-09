const express = require("express");
const historyController = require("../controllers/history.controller");
const { protect } = require("../middleware/authMiddleware");

const historyRouter = express.Router();

// All history routes require the user to be logged in
historyRouter.use(protect);

historyRouter.post("/add", historyController.addHistoryController);
historyRouter.get("/", historyController.getHistoryController);
historyRouter.delete("/clear", historyController.clearHistoryController);

module.exports = historyRouter;
