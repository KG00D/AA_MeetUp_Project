const jwt = require('jsonwebtoken');
const { jwtConfig } = require('../config');
const { User } = require('../db/models');

const { secret, expiresIn } = jwtConfig;

const setTokenCookie = (res, user) => {
    const token = jwt.sign(
      { data: user.toSafeObject() },
      secret,
      { expiresIn: parseInt(expiresIn) }
    );

    const isProduction = process.env.NODE_ENV === "production";

    res.cookie('token', token, {
      maxAge: expiresIn * 1000,
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction && "Lax"
    });

    return token;
};

const restoreUser = (req, res, next) => {
    const { token } = req.cookies;

    if (!token) {
        console.log("JWT token not provided.");
        return next();
    }

    return jwt.verify(token, secret, null, async (err, jwtPayload) => {
        if (err) {
            console.log("JWT verification failed:", err.message);
            return next();
        }

        try {
            const { id } = jwtPayload.data;
            req.user = await User.scope('currentUser').findByPk(id);
        } catch (e) {
            console.error("Error retrieving user:", e.message);
            res.clearCookie('token');
            return next();
        }

        if (!req.user) {
            console.log("User not found or invalid.");
            res.clearCookie('token');
        }

        return next();
    });
};

const requireAuth = function (req, res, next) {
    if (req.user) {
        return next();
    } else {
        return res.status(401).json({
            message: "Unauthorized",
            statusCode: 401
        });
    }
};

module.exports = { setTokenCookie, restoreUser, requireAuth };
