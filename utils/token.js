const JWT = require("jsonwebtoken");

const createToken = async (id) => {
   const token = JWT.sign({ id }, process.env.JWT_SECRET_KEY);
   return token;
};

const decodeToken = async (token) => {
   return JWT.verify(token, process.env.JWT_SECRET_KEY);
};

module.exports = { createToken, decodeToken };
