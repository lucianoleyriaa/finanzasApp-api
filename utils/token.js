const JWT = require("jsonwebtoken");

const createToken = async (id) => {
   const token = JWT.sign({ id }, process.env.JWT_SECRET_KEY);
   return token;
};

const decodeToken = async (token) => {
   let result;
   result = JWT.verify(
      token,
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1h" },
      (err, decode) => {
         if (err) {
            return { error: true, message: err.message };
         }

         return decode;
      }
   );

   return result;
};

module.exports = { createToken, decodeToken };
