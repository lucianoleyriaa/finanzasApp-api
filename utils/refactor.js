const refactorizarMovOuput = (cuenta) => {
    if (cuenta.movimientos) {
        cuenta.movimientos.forEach((mov) => {
            mov.categoria = mov.categoria.nombre;
            mov.tipo_movimiento = mov.tipo_movimiento.nombre;
        });
    }
};

const refactorOutput = (movs) => {
    const movements = [];
    movs.forEach(m => {
        movements.push({
            id: m.id,
            date: m.fecha,
            name: m.nombre,
            type: {
                id: m.tipo_movimiento.id,
                name: m.tipo_movimiento.nombre,
            },
            category: {
                id: m.categoria.id,
                name: m.categoria.nombre,
            },
            amount: m.monto
        });
    });

    return movements;
}

// export interface Movement {
//     id: number,
//     date: string,
//     name: string,
//     type: {
//         id: number, name: string
//     },
//     id_account: number,
//     category: {
//         id: number,
//         name: string
//     }
// }

module.exports = { refactorizarMovOuput, refactorOutput };
