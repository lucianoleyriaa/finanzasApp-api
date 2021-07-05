const { PrismaClient } = require("@prisma/client");

const { categoria } = new PrismaClient();

exports.getCategorias = async (req, res) => {
   try {
      const categorias = await categoria.findMany({});

      res.status(200).json({
         status: "OK",
         categorias,
      });
   } catch (e) {
      console.log(e);
   }
};

exports.createCategoria = async (req, res) => {
   try {
      const nuevaCategoria = await categoria.create({
         data: req.body,
      });

      res.status(201).json({
         status: "OK",
         nuevaCategoria,
      });
   } catch (e) {
      console.log(e);
   }
};

exports.updateCategoria = async (req, res) => {
   try {
      const categoriaActualizada = await categoria.update({
         where: {
            id: +req.params.id,
         },
         data: req.body,
      });

      res.status(200).json({
         status: "OK",
         categoriaActualizada,
      });
   } catch (e) {
      console.log(e);
   }
};

exports.deleteCategoria = async (req, res) => {
   try {
   } catch (e) {
      console.log(e);
   }
};
