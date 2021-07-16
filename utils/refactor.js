const refactorizarMovOuput = (cuenta) => {
   if (cuenta.movimientos) {
      cuenta.movimientos.forEach((mov) => {
         mov.categoria = mov.categoria.nombre;
         mov.tipo_movimiento = mov.tipo_movimiento.nombre;
      });
   }
};

module.exports = { refactorizarMovOuput };
