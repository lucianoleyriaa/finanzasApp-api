const refactorizarMovOuput = (movimientos) => {
   movimientos.forEach((mov) => {
      mov.cuenta = mov.cuenta.nombre;
      mov.categoria = mov.categoria.nombre;
      mov.tipo_movimiento = mov.tipo_movimiento.nombre;
   });
};

module.exports = { refactorizarMovOuput };
