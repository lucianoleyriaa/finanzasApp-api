const { PrismaClient } = require("@prisma/client");

const { categoria } = new PrismaClient();

exports.getCategorias = async (req, res) => {
   const id_tipo_mov = +req.params.id
   try {
      const categorias = await categoria.findMany({
         where: {
            id_tipo_mov: id_tipo_mov
         },
         select: {
            id: true,
            nombre: true
         }
      });

      res.status(200).json({
         status: "OK",
         categories: categorias,
      });
   } catch (e) {
      console.log(e);
   }
};

exports.getCategories = async (req, res) => {
   try {
      const categories = await categoria.findMany({
         select: {
            nombre: true,
            id: true,
            descripcion: true,
            tipo_movimiento: {
               select: {
                  nombre: true,
                  id: true,
               }
            }
         }
      })

      res.status(200).json({
         message: 'OK',
         categories
      });
   } catch (e) {
      console.log(e)
   }
}

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
