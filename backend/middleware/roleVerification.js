// middleware/roleVerification.js
module.exports = function roleVerification(allowedRoles) {
    return (req, res, next) => {
        const userRole = req.user && req.user.role; // Assumes `req.user.role` is set after authentication

        if (!userRole || !allowedRoles.includes(userRole)) {
            return res.status(403).json({ success: false, message: "Access denied." });
        }
        next();
    };
};