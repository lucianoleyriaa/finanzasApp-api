const { PrismaClient } = require("@prisma/client");
const { refactorizarMovOuput } = require("../utils/refactor");
const { calcularSaldo } = require("../utils/calculos");
const { filterUpdates } = require("../utils/filter");
const { checkAccountBeforeTransfer } = require("../utils/utilidades");

const { movimiento, cuenta, tipo_movimiento } = new PrismaClient();

exports.getMovimientos = async (req, res) => {
   try {
      const movCuenta = await cuenta.findMany({
         where: {
            id: +req.params.id_cuenta,
            id_usuario: req.user.id,
         },
         select: {
            id: true,
            fecha_creacion: true,
            nombre: true,
            saldo_inicial: true,
            movimientos: {
               select: {
                  id: true,
                  fecha: true,
                  nombre: true,
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
                  monto: true,
               },
               orderBy: {
                  fecha: "desc",
               },
            },
         },
      });

      if (movCuenta.length === 0) {
         return res.status(400).json({
            status: "Fail",
            message: "La cuenta a la que intenta acceder no existe!",
         });
      }

      calcularSaldo(movCuenta, true);
      refactorizarMovOuput(movCuenta);

      res.status(200).json({
         status: "OK",
         movCuenta,
      });
   } catch (e) {
      console.log(e);
   }
};

exports.createMovimiento = async (req, res) => {
   const { id_cuenta } = req.params;
   const { nombre, id_categoria, monto, id_tipo_mov, id_cuenta_destino, fecha, } = req.body;

   try {
      if (+id_tipo_mov === 2 || +id_tipo_mov === 3) {
         const saldoCuen = await cuenta.findMany({
            where: {
               id: +id_cuenta,
               id_usuario: req.user.id,
            },
            select: {
               saldo_inicial: true,
               movimientos: {
                  select: {
                     id: true,
                     monto: true,
                     id_tipo_mov: true,
                     tipo_movimiento: {
                        select: {
                           nombre: true,
                        },
                     },
                     fecha: true,
                  },
               },
            },
         });

         if (saldoCuen.length === 0) {
            return res.status(400).json({
               status: "Fail",
               message:
                  "La cuenta en la que desea registrar un movimiento no existe!",
            });
         }

         calcularSaldo(saldoCuen);

         if (saldoCuen[0].saldo <= 0 || saldoCuen[0].saldo < monto) {
            return res.status(400).json({
               status: "Fail",
               message:
                  "El saldo de esta cuenta es inferior al monto ingresado!",
            });
         }
      }

      if (+id_tipo_mov === 3) {
         const existsAccount = await checkAccountBeforeTransfer(
            cuenta,
            req.user.id,
            id_cuenta_destino
         );

         if (!existsAccount) {
            return res.status(404).json({
               status: "Fail",
               message:
                  "La cuenta a la que se le quiere realizar la transferencia no existe!",
            });
         }

         await movimiento.create({
            data: {
               nombre: "Transferencia",
               id_categoria: 10,
               monto,
               id_tipo_mov: 1,
               id_cuenta: +id_cuenta_destino,
               fecha,
            },
         });
      }

      const movimientoNuevo = await movimiento.create({
         data: {
            nombre,
            id_categoria: +id_categoria ? +id_categoria : 10,
            monto,
            id_tipo_mov,
            id_cuenta: +id_cuenta,
            fecha,
         },
         select: {
            nombre: true,
            categoria: {
               select: {
                  nombre: true,
               },
            },
            monto: true,
            tipo_movimiento: {
               select: {
                  nombre: true,
               },
            },
            id_tipo_mov: true,
            id_cuenta: true,
            fecha: true,
         },
      });

      res.status(201).json({
         status: "OK",
         movimientoNuevo,
      });
   } catch (e) {
      console.log(e);
      if (e.meta.field_name === "id_cuenta") {
         res.status(400).json({
            status: "Fail",
            message: "La cuenta no existe!",
         });
      }
   }
};

exports.updateMovimiento = async (req, res) => {
   const allowedUpdates = ["nombre", "monto", "id_categoria", "id_tipo_mov"];
   const updates = filterUpdates(req.body, allowedUpdates);

   try {
      const cuentas = await cuenta.findMany({
         where: { id_usuario: req.user.id },
         select: { id: true },
      });

      const idUserAccounts = cuentas.map((el) => el.id);

      const movActualizado = await movimiento.updateMany({
         where: {
            id: +req.params.id,
            id_cuenta: {
               in: idUserAccounts,
            },
         },
         data: updates,
      });

      if (movActualizado.count === 0) {
         return res.status(404).json({
            status: "Fail",
            message:
               "El movimiento o la cuenta que quiere actualizar no existe!",
         });
      }

      res.status(200).json({
         status: "OK",
         movActualizado,
      });
   } catch (e) {
      if (e.code === "P2025") {
         return res.status(400).json({
            status: "Fail",
            message: "El movimiento que quiere actualizar no existe!",
         });
      }
   }
};

exports.deleteMovimiento = async (req, res) => {
   try {
      await movimiento.delete({
         where: {
            id: +req.params.id,
         },
      });

      res.status(204).json({});
   } catch (e) {
      console.log(e);
   }
};

exports.getMovementType = async (req, res) => {
   try {
      const movementTypes = await tipo_movimiento.findMany();

      res.status(200).json({
         status: "OK",
         movementTypes
      });
   } catch (e) {
      console.log(e);
   }
}
