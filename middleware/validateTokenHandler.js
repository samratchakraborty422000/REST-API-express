const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");
require("dotenv").config();
const validateToken = asyncHandler(async (req, res, next) => {
  let token;
  let authHeader = req.headers.Authorization || req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer")) {
    token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
      console.log(err,decoded,"error and decoded");

      if (err) {
        res.status(401);
        throw new Error("User is not authorized");
      }
      const user = await userModel.findOne(
        { _id: decoded.id },
        { password: 0 }
      );

      if (!user) {
        return res.status(404).send({
          status: false,
          message: "User not found",
        });
      }

      req.user = user;
      next();
    });

    if (!token) {
      res.status(401);
      throw new Error("User is not authorized or token is missing");
    }
  }
});

module.exports = validateToken;
