const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");
const { createToken, verifyToken, decodeToken } = require("../utils/token");
const { decode } = require("jsonwebtoken");
const { calcularSaldo } = require("../utils/calculos");

const { usuario, cuenta } = new PrismaClient();

exports.me = async (req, res) => {
   const user = req.user;
   try {
      const userAccounts = await cuenta.findMany({
         where: {
            estado: true,
            id_usuario: user.id
         },
         select: {
            id: true,
            nombre: true,
            estado: true,
            fecha_creacion: true,
            saldo_inicial: true,
            movimientos: {
               select: {
                  id: true,
                  fecha: true,
                  nombre: true,
                  monto: true,
                  categoria: {
                     select: {
                        nombre: true,
                     },
                  },
                  id_tipo_mov: true,
                  tipo_movimiento: {
                     select: {
                        nombre: true,
                     },
                  },
               },
            }
         }
      });

      calcularSaldo(userAccounts);
      user.userAccounts = userAccounts;

      delete user.password;
      delete user.usuario;
      delete user.fecha_modificacion;

      const result = { user }

      res.status(200).json({
         status: 'OK',
         result,
      });
   } catch (e) {

   }
}

exports.login = async (req, res) => {
   const { username, password } = req.body;

   try {
      const user = await usuario.findUnique({
         where: {
            usuario: username,
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
         return res.status(401).json({
            status: "Fail",
            message: "El usuario o la contraseña son incorrectos!",
         });
      }

      const checkPass = await bcrypt.compare(password, user.password);

      if (!checkPass) {
         return res.status(401).json({
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
   if (
      !req.headers.authorization ||
      !req.headers.authorization.startsWith("Bearer ")
   ) {
      return res.status(401).json({
         status: "Fail",
         message: "Debes iniciar sesion para poder acceder a esta ruta!",
      });
   }

   const token = req.headers.authorization.split(" ")[1];

   try {
      const decodedToken = await decodeToken(token);

      if (decodedToken.error && decodedToken.error === true) {
         return res.status(401).json({
            status: "Fail",
            message:
               "No tiene autorizacion para acceder a esta ruta. Por favor inicia sesion!",
         });
      }

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
