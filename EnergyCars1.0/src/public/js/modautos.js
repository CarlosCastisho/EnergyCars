
// Objeto que contiene los modelos para cada marca */
const modelosPorMarca = {
    Ford: ["Mustang Mach-E", "E-Transit"],
    MercedesBenz: ["EQA"],
    Audi: ["E-Tron"],
    Porsche: ["Taycan"],
    Nissan: ["Leaf"],
    Coradir: ["Tito"],
    Renault: ["Kwid E-Tech", "Megane E-Tech"]
};

// Función que actualiza los modelos según la marca seleccionada*/
function actualizarModelos() {
    const marcaSeleccionada = document.getElementById("veh_marca").value;
    const modeloSelect = document.getElementById("veh_modelo");

    // Limpiar las opciones anteriores*/
    modeloSelect.innerHTML = '<option value="" disabled selected>Selecciona un modelo</option>';

    // Obtener los modelos correspondientes a la marca seleccionada*/
    if (modelosPorMarca[marcaSeleccionada]) {
        modelosPorMarca[marcaSeleccionada].forEach(modelo => {
            const option = document.createElement("option");
            option.value = modelo;
            option.text = modelo;
            modeloSelect.appendChild(option);
        });
    }
}
