const { PrismaClient } = require("@prisma/client");
const { calcularSaldo } = require("../utils/calculos");

const { cuenta } = new PrismaClient();

exports.getCuentas = async (req, res) => {
   try {
      const cuentas = await cuenta.findMany({
         where: {
            estado: true,
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
   try {
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
      const cuentaActualizada = await cuenta.update({
         where: {
            id: +req.params.id,
         },
         data: req.body,
      });

      res.status(200).json({
         status: "OK",
         cuentaActualizada,
      });
   } catch (e) {
      console.log(e);
   }
};

exports.deleteCuenta = async (req, res) => {
   try {
      await cuenta.update({
         where: {
            id: +req.params.id,
         },
         data: {
            estado: false,
         },
      });

      res.status(204).json({});
   } catch (e) {
      console.log(e);
   }
};
