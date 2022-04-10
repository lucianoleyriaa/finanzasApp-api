function calcularSaldo(cuentas, detalle = false) {
    // Refactorizar - Verificar si se esta usando esta funcion
    cuentas.forEach((cuenta) => {
        let ingresos = [0];
        let gastos = [0];

        // if (cuenta.saldo_inicial) ingresos.push(cuenta.saldo_inicial);

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

const calcTotal = (movs) => {
    let total = 0;
    let incomes = 0;
    let outcomes = 0;

    movs.forEach((m) => {
        if (m.type.name === 'outcome' || m.type.name === 'transfer') {
            outcomes = outcomes + m.amount;
        } else if (m.type.name === 'income') {
            incomes = incomes + m.amount
        }
    });

    total = incomes - outcomes;
    return total;
}

module.exports = { calcularSaldo, calcTotal };
