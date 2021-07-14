const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");
const { createToken, verifyToken, decodeToken } = require("../utils/token");
const { decode } = require("jsonwebtoken");

const { usuario } = new PrismaClient();

exports.login = async (req, res) => {
   const { nombreUsuario, password } = req.body;

   try {
      const user = await usuario.findUnique({
         where: {
            usuario: nombreUsuario,
         },
         select: {
            id: true,
            nombre: true,
            apellido: true,
            usuario: true,
            password: true,
         },
      });

      if (!user) {
         return res.status(400).json({
            status: "Fail",
            message: "El usuario o la contraseña son incorrectos!",
         });
      }

      const checkPass = await bcrypt.compare(password, user.password);

      if (!checkPass) {
         return res.status(400).json({
            status: "Fail",
            message: "El usuario o la contraseña son incorrectos!2",
         });
      }

      const token = await createToken(user.id);

      delete user.password;
      user.token = token;

      res.status(200).json({
         status: "OK",
         user,
      });
   } catch (e) {
      console.log(e);
   }
};

exports.signup = async (req, res) => {
   const { nombre, apellido, nombreUsuario, password } = req.body;

   try {
      const pass = await bcrypt.hash(password, 12);

      const nuevoUsuario = await usuario.create({
         data: { nombre, apellido, usuario: nombreUsuario, password: pass },
         select: {
            id: true,
            nombre: true,
            apellido: true,
            usuario: true,
         },
      });

      res.status(201).json({
         status: "OK",
         message: "Usuario creado correctamente!",
         nuevoUsuario,
      });
   } catch (e) {
      console.log(e);
   }
};

exports.protect = async (req, res, next) => {
   const token = req.headers.authorization.split(" ")[1];

   try {
      const decodedToken = await decodeToken(token);

      const user = await usuario.findUnique({
         where: {
            id: decodedToken.id,
         },
      });

      if (!user) {
         return res.status(404).json({
            status: "Fail",
            message:
               "El usuario al que le pertenece dicho token, ya no existe!",
         });
      }

      req.user = user;

      next();
   } catch (e) {
      console.log(e);
   }
};
