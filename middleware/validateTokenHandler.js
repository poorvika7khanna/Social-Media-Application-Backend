const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const Blacklist = require("../models/blacklist");

const validateToken = asyncHandler(async(req,res,next) => {
    let token;
    let authHeader = req.headers.authorization || req.headers.Authorization;
    if(authHeader && authHeader.startsWith("Bearer")) {
        token = authHeader.split(" ")[1];
        const tokenBlacklisted = await Blacklist.findOne({ token });
        if(tokenBlacklisted)
        {
            res.status(401);
            throw new Error("Token is invalid");
        }
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err,decodedData) => {
            if(err)
            {
                res.status(401);
                throw new Error("User is not authorized");
            }
            req.user = decodedData.user;
            next();
        });
    }
    if(!token) {
        res.status(401);
        throw new Error("User is not authorized or token is missing");
    }
});

module.exports = validateToken;