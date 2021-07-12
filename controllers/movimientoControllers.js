const { PrismaClient } = require("@prisma/client");
const { refactorizarMovOuput } = require("../utils/refactor");
const { calcularSaldo } = require("../utils/calculos");
const { filterUpdates } = require("../utils/filter");

const { movimiento, cuenta } = new PrismaClient();

exports.getMovimientos = async (req, res) => {
   try {
      const movCuenta = await cuenta.findUnique({
         where: {
            id: +req.params.id_cuenta,
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
            },
         },
      });

      if (!movCuenta) {
         return res.status(400).json({
            status: "Fail",
            message: "La cuenta a la que intenta acceder no existe!",
         });
      }

      calcularSaldo([movCuenta], true);
      refactorizarMovOuput(movCuenta.movimientos);

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
   const { nombre, id_categoria, monto, id_tipo_mov, id_cuenta_destino } =
      req.body;

   try {
      if (+id_tipo_mov === 2 || +id_tipo_mov === 3) {
         const saldoCuen = await cuenta.findUnique({
            where: {
               id: +id_cuenta,
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
                  },
               },
            },
         });

         if (!saldoCuen) {
            return res.status(400).json({
               status: "Fail",
               message:
                  "La cuenta en la que desea registrar un movimiento no existe!",
            });
         }

         calcularSaldo([saldoCuen]);

         if (saldoCuen.saldo <= 0 || saldoCuen.saldo < monto) {
            return res.status(400).json({
               status: "Fail",
               message:
                  "El saldo de esta cuenta es inferior al monto ingresado!",
            });
         }
      }

      if (+id_tipo_mov === 3) {
         const transferencia = await movimiento.create({
            data: {
               nombre: "Transferencia",
               id_categoria: 8,
               monto,
               id_tipo_mov: 1,
               id_cuenta: +id_cuenta_destino,
            },
         });
      }

      const movimientoNuevo = await movimiento.create({
         data: {
            nombre,
            id_categoria,
            monto,
            id_tipo_mov,
            id_cuenta: +id_cuenta,
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
      const movActualizado = await movimiento.update({
         where: {
            id: +req.params.id,
         },
         data: updates,
      });

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
