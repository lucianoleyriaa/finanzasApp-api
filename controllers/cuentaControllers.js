const { PrismaClient } = require("@prisma/client");
const { calcularSaldo } = require("../utils/calculos");

const { cuenta } = new PrismaClient();

exports.getCuentas = async (req, res) => {
   try {
      const cuentas = await cuenta.findMany({
         where: {
            estado: true,
            id_usuario: req.user.id,
         },
         select: {
            id: true,
            fecha_creacion: true,
            nombre: true,
            saldo_inicial: true,
            estado: true,
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
            },
         },
      });

      calcularSaldo(cuentas);

      res.status(200).json({
         status: "OK",
         cuentas,
      });
   } catch (e) {
      console.log(e);
   }
};

exports.createCuenta = async (req, res) => {
   const data = req.body;
   data.id_usuario = req.user.id;

   try {
      const countExist = await cuenta.count({
         where: {
            nombre: data.nombre,
            id_usuario: req.user.id,
         },
      });

      if (countExist > 0) {
         return res.status(404).json({
            status: "Fail",
            message:
               "No se pudo crear la cuenta debido a que ya existe una con ese nombre!",
         });
      }

      const nuevaCuenta = await cuenta.create({
         data,
      });

      res.status(201).json({
         status: "OK",
         nuevaCuenta,
      });
   } catch (e) {
      console.log(e);
   }
};

exports.updateCuenta = async (req, res) => {
   try {
      const cuentaActualizada = await cuenta.updateMany({
         where: {
            id: +req.params.id,
            id_usuario: req.user.id,
         },
         data: req.body,
      });

      if (cuentaActualizada.count === 0) {
         return res.status(400).json({
            status: "Fail",
            message: "La cuenta que intenta actualizar no existe!",
         });
      }

      res.status(200).json({
         status: "OK",
         message: "La cuenta se actualizo correctamente!",
      });
   } catch (e) {
      console.log(e);
   }
};

exports.deleteCuenta = async (req, res) => {
   try {
      const deleteAccount = await cuenta.updateMany({
         where: {
            id: +req.params.id,
            id_usuario: req.user.id,
         },
         data: {
            estado: false,
         },
      });

      if (deleteAccount.count === 0) {
         return res.status(400).json({
            status: "Fail",
            message: "La cuenta que intenta eliminar no existe!",
         });
      }

      res.status(204).json({});
   } catch (e) {
      console.log(e);
   }
};
