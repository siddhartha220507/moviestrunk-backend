const adminMiddleware = (req, res, next) => {
    // Assuming req.user is populated by the authMiddleware (identifyUser)
    if (req.user && req.user.role !== "admin") {
        return res.status(403).json({ message: "Admin access only" });
    }
    next();
};

module.exports = adminMiddleware;
