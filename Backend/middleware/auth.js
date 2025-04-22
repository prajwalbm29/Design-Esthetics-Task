const JWT = require('jsonwebtoken');
const userModel = require('../model/user');

const isLoggedIn = async (req, res, next) => {
    try {
        const decode = JWT.verify(req.headers.authorization, process.env.JWT_SECRET);
        req.user = decode;
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: "Unauthorized.! Please login." });
    }
};

const isAdmin = async (req, res, next) => {
    try {
        const user = await userModel.findById(req.user._id);
        if (!user.isAdmin) {
            return res.status(401).json({ success: false, message: "Unauthorized.! login using Admin credentials." });
        } else {
            next();
        }
    } catch (error) {
        console.log("Error in verify admin middleware", error);
        return res.status(401).json({
            success: false,
            message: "Unauthorized Admin",
            error: error.message,
        })
    }
};

module.exports = {
    isLoggedIn,
    isAdmin,
}