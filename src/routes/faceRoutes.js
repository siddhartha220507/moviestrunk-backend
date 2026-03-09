const express = require("express");
const multer = require("multer");
const { celebrityMatch } = require("../controllers/face.controller.js");

const router = express.Router();

// Use memory storage so we don't have to save/delete files from the disk
const upload = multer({ storage: multer.memoryStorage() });

router.post("/celebrity", upload.single("image"), celebrityMatch);

module.exports = router;
