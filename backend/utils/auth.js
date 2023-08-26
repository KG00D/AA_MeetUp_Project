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
    res.setHeader('Cache-Control', 'no-store');
    
    const { token } = req.cookies;
    req.user = null;
  
    return jwt.verify(token, secret, null, async (err, jwtPayload) => {
      if (err) {
        console.error("JWT verification failed:", err);
        return next();
      }
  
      try {
        const { id } = jwtPayload.data;
        req.user = await User.scope('currentUser').findByPk(id);

        if (!req.user) {
            console.error("User not found for ID:", id);
            res.clearCookie('token');
        }

      } catch (e) {
        console.error("Error fetching user:", e);
        res.clearCookie('token');
        return next();
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
      })
    }
};

module.exports = { setTokenCookie, restoreUser, requireAuth };
