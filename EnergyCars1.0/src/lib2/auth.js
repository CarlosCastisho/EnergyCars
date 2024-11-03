const pool = require('../database');

// Función para verificar si hay un conflicto de horario
async function verificarReserva(RESERVA_FECHA, RESERVA_HORA_INI, RESERVA_HORA_FIN, ID_EST_RES, ID_SURTIDOR) {
    const consulta =
        `SELECT * FROM reservas 
        WHERE ID_EST_RES = ? 
        AND ID_SURTIDOR = ? 
        AND RESERVA_FECHA = ? 
        AND ((? BETWEEN RESERVA_HORA_INI AND RESERVA_HORA_FIN) OR (? BETWEEN RESERVA_HORA_INI AND RESERVA_HORA_FIN))`;
    const [existeReserva] = await pool.query(consulta, [RESERVA_FECHA, RESERVA_HORA_INI, RESERVA_HORA_FIN, ID_EST_RES, ID_SURTIDOR]);
    return existeReserva.length > 0;
}

// Función para insertar una nueva reserva
async function hacerReserva(RESERVA_FECHA, RESERVA_HORA_INI, RESERVA_HORA_FIN, RESERVA_IMPORTE, ID_USER, ID_EST_RES, ID_SURTIDOR) {
    const nueva_Reserva = {
        RESERVA_FECHA,
        RESERVA_HORA_INI,
        RESERVA_HORA_FIN,
        RESERVA_IMPORTE,
        ID_USER,
        ID_EST_RES,
        ID_SURTIDOR
    };

    try {
        await pool.query('INSERT INTO reservas SET ?', [nueva_Reserva]);
    } catch (error) {
        console.error("Error al agregar una reserva", error);
        throw error;
    }
}

// Función para cancelar una reserva
async function cancelarReserva(ID_RESERVA) {
    try {
        await pool.query('UPDATE reservas SET RESERVA_ESTADO = ? WHERE ID_RESERVA = ?', [ID_EST_RES, ID_RESERVA]);
    } catch (error) {
        console.error("Error al cancelar la reserva", error);
        throw error;
    }
}

async function buscarEstacion() {
    try {
        return await pool.query('SELECT * FROM estaciones_carga');
    } catch (error) {
        console.error("Error fetching charging stations:", error);
        throw error; // Re-lanza el error para que el llamador sepa manejarlo 
    }
}

async function costoCarga(tiempo, kw) {
    try {
        const [priceData] = await pool.query(
            'SELECT PRECIO_KW FROM precios WHERE ID_TIEMPO_CARGA = ? AND ID_MEDIDA = ?',
            [tiempo, kw]
        );

        if (priceData) {
            const precioTotal = priceData.PRECIO_KW * tiempo;
            return { precio: precioTotal };
        } else {
            return null; // O puedes lanzar un error aquí, según tus necesidades
        }
    } catch (error) {
        console.error(error);
        throw error; // O maneja el error de otra manera, como devolver un objeto de error
    }
}


module.exports = {
    verificarReserva,
    hacerReserva,
    cancelarReserva,
    buscarEstacion,
    costoCarga
};