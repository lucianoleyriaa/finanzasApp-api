function calcularSaldo(cuentas, detalle = false) {
   cuentas.forEach((cuenta) => {
      let ingresos = [0];
      let gastos = [0];

      if (cuenta.saldo_inicial) ingresos.push(cuenta.saldo_inicial);

      cuenta.movimientos.forEach((mov) => {
         if (mov.tipo_movimiento.nombre === "Gasto") {
            gastos.push(mov.monto);
         } else if (mov.tipo_movimiento.nombre === "Ingreso") {
            ingresos.push(mov.monto);
         }
      });

      ingresos = ingresos.reduce((acc, curr) => acc + curr);
      gastos = gastos.reduce((acc, curr) => acc + curr);

      cuenta.saldo = ingresos - gastos;
      if (!detalle) delete cuenta.movimientos;
   });
}

module.exports = { calcularSaldo };
