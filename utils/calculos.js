function calcularSaldo(cuentas, detalle = false) {
   cuentas.forEach((cuenta) => {
      let ingresos = [0];
      let gastos = [0];

      if (cuenta.saldo_inicial) ingresos.push(cuenta.saldo_inicial);

      if (cuenta.movimientos.length != 0) {
         cuenta.movimientos.forEach((mov) => {
            if (mov.id_tipo_mov === 2 || mov.id_tipo_mov === 3) {
               gastos.push(mov.monto);
            } else if (mov.id_tipo_mov === 1) {
               ingresos.push(mov.monto);
            }
         });
      }

      ingresos = ingresos.reduce((acc, curr) => acc + curr);
      gastos = gastos.reduce((acc, curr) => acc + curr);

      cuenta.saldo = ingresos - gastos;
      if (!detalle) delete cuenta.movimientos;
   });
}

module.exports = { calcularSaldo };
