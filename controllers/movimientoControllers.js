const { PrismaClient } = require("@prisma/client");
const { refactorizarMovOuput } = require("../utils/refactor");
const { calcularSaldo } = require("../utils/calculos");

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
                  categoria: {
                     select: {
                        nombre: true,
                     },
                  },
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

      movArr = [movCuenta];
      calcularSaldo(movArr, true);
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
   const { nombre, id_categoria, monto, id_tipo_mov } = req.body;

   try {
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
   }
};

exports.updateMovimiento = async (req, res) => {
   try {
      const movActualizado = await movimiento.update({
         where: {
            id: +req.params.id,
         },
         data: req.body,
      });

      res.status(200).json({
         status: "OK",
         movActualizado,
      });
   } catch (e) {
      console.log(e);
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
