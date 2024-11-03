function calcularHoraFin() {
    const horaInicio = document.getElementById('reserva_hora_ini').value;
    const tiempoCarga = parseInt(document.getElementById('reserva_hora_time').value, 10);

    if (horaInicio) {
        const [horas, minutos] = horaInicio.split(':').map(Number);
        const fecha = new Date();
        fecha.setHours(horas);
        fecha.setMinutes(minutos + tiempoCarga);

        const horaFin = fecha.toTimeString().slice(0, 5);
        document.getElementById('reserva_hora_fin').value = horaFin;
    }
};

// Función para cancelar una reserva
async function cancelarReserva(ID_RESERVA) {
    try {
        await pool.query('UPDATE reservas SET RESERVA_ESTADO = ? WHERE ID_RESERVA = ?', ['CANCELADA', ID_RESERVA]);
    } catch (error) {
        console.error("Error al cancelar la reserva", error);
        throw error;
    }
}