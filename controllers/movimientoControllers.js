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
   } catch (e) {
      console.log(e);
   }
};
exports.deleteMovimiento = async (req, res) => {
   try {
   } catch (e) {
      console.log(e);
   }
};
