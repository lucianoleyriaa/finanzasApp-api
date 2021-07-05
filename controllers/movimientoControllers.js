const { PrismaClient } = require("@prisma/client");
const { refactorizarMovOuput } = require("../utils/refactor");

const { movimiento } = new PrismaClient();

exports.getMovimientos = async (req, res) => {
   try {
      const movimientos = await movimiento.findMany({
         where: {
            id_cuenta: +req.params.id_cuenta,
         },
         select: {
            id: true,
            fecha: true,
            nombre: true,
            cuenta: {
               select: {
                  nombre: true,
               },
            },
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
         },
      });

      refactorizarMovOuput(movimientos);

      res.status(200).json({
         status: "OK",
         movimientos,
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
            id: +req.params.id
         },
         data: req.body
      })

      res.status(200).json({
         status: 'OK',
         movActualizado
      })
   } catch (e) {
      console.log(e);
   }
};
exports.deleteMovimiento = async (req, res) => {
   try {
      await movimiento.delete({
         where: {
            id: +req.params.id
         }
      })

      res.status(204).json({})
   } catch (e) {
      console.log(e);
   }
};
