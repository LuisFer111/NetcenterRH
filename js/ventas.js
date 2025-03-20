let ventasPorEmpleado = {};

async function obtenerDatosVentas() {
    const url = 'https://script.google.com/macros/s/AKfycby4Ucrp6ifF2uvPYxGend-9Xn3ws0AH_HgeME6VarWR73CC6y6Rnj0jEm4_2Y2eojdhww/exec';
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        ventasPorEmpleado = {};

        data.forEach(fila => {
            const nombreLimpio = normalizarNombre(fila["nombre"] || "");
            ventasPorEmpleado[nombreLimpio] = {
                ventas_totales: parseFloat(fila["ventas_totales"] || 0),
                volumen_total: parseFloat(fila["volumen_total"] || 0)
            };
        });

        console.log("✅ Ventas cargadas correctamente:", ventasPorEmpleado);
    } catch (error) {
        console.error("❌ Error al obtener los datos de ventas:", error);
    }
}

function generarGraficaVentas(ventas) {
    const ctx = document.getElementById("ventasChart").getContext("2d");

    if (window.miGrafica) window.miGrafica.destroy();

    window.miGrafica = new Chart(ctx, {
        type: "bar",
        data: {
            labels: ["Enero", "Febrero", "Marzo"],
            datasets: [{
                label: "Volumen",
                data: [ventas.volumen.enero, ventas.volumen.febrero, ventas.volumen.marzo],
                backgroundColor: ["#1E88E5", "#43A047", "#FB8C00"]
            }]
        },
        options: { responsive: true }
    });
}

