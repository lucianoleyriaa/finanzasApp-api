const { PrismaClient } = require("@prisma/client");
const { calcularSaldo } = require("../utils/calculos");

const { cuenta, movimiento } = new PrismaClient();

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
            nombre: data.name,
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
         data: {
            nombre: data.name,
            saldo_inicial: data.amount,
            usuario: {
               connect: {
                  id: data.id_usuario
               }
            }
         }
      });

      await movimiento.create({
         data: {
            id_cuenta: nuevaCuenta.id,
            nombre: "Saldo inicial",
            monto: data.amount,
            id_tipo_mov: 1,
            fecha: (new Date(Date.now())).toLocaleDateString(),
            id_categoria: 1
         }
      })

      nuevaCuenta.saldo = nuevaCuenta.saldo_inicial;

      const newAccount = {
         estado: nuevaCuenta.estado,
         fecha_creacion: nuevaCuenta.fecha_creacion,
         id: nuevaCuenta.id,
         nombre: nuevaCuenta.nombre,
         saldo: nuevaCuenta.saldo,
         saldo_inicial: nuevaCuenta.saldo_inicial
      }

      res.status(201).json({
         status: "OK",
         newAccount,
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
