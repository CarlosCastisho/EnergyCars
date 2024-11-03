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
    } catch (error){
        console.error("Error al agregar una reserva", error);
        throw error;
    }
}

// Función para cancelar una reserva
// Función para cancelar una reserva
async function cancelarReserva(ID_RESERVA) {
    try {
        await pool.query('UPDATE reservas SET RESERVA_ESTADO = ? WHERE ID_RESERVA = ?', ['CANCELADA', ID_RESERVA]);
    } catch (error) {
        console.error("Error al cancelar la reserva", error);
        throw error;
    }
}


module.exports = {
    verificarReserva,
    hacerReserva,
    cancelarReserva
};