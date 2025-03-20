// ventas.js

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
        ventas: {
          enero: parseFloat(fila["enero"]["sales"] || 0),
          febrero: parseFloat(fila["febrero"]["sales"] || 0),
          marzo: parseFloat(fila["marzo"]["sales"] || 0)
        },
        volumen: {
          enero: parseFloat(fila["enero"]["volumen"] || 0),
          febrero: parseFloat(fila["febrero"]["volumen"] || 0),
          marzo: parseFloat(fila["marzo"]["volumen"] || 0)
        },
        sales_with_dates: {
          enero: parseFloat(fila["enero"]["sales_with_dates"] || 0),
          febrero: parseFloat(fila["febrero"]["sales_with_dates"] || 0),
          marzo: parseFloat(fila["marzo"]["sales_with_dates"] || 0)
        },
        ventas_totales: parseFloat(fila["ventas_totales"] || 0),
        volumen_total: parseFloat(fila["volumen_total"] || 0),
        average_package_price: parseFloat(fila["average_package_price"] || 0),
        tiempo_en_empresa: fila["tiempo_empresa"] || "N/A"
      };
    });

    console.log("✅ Ventas cargadas correctamente:", ventasPorEmpleado);

  } catch (error) {
    console.error("❌ Error al obtener los datos de ventas:", error);
  }
}

function mostrarVentasEnPagina(ventas) {
  document.querySelectorAll(".employeeCard").forEach(card => {
    const nombreEmpleado = normalizarNombre(card.querySelector("h3").textContent);
    const ventasEmpleado = ventas[nombreEmpleado];

    // Evitar duplicados
    const existente = card.querySelector(".ventas-info");
    if (existente) existente.remove();

    const ventasElemento = document.createElement("div");
    ventasElemento.classList.add("ventas-info");
    ventasElemento.style.fontSize = "12px";
    ventasElemento.style.marginTop = "8px";
    ventasElemento.style.padding = "5px";
    ventasElemento.style.borderTop = "1px solid #eee";

    if (ventasEmpleado) {
      ventasElemento.innerHTML = `
        <strong style="color:#007bff;">Ventas Marzo: ${ventasEmpleado.ventas.marzo}</strong>
        <br><strong style="color:#28a745;">Volumen Marzo: $${ventasEmpleado.volumen.marzo.toLocaleString()}</strong>
        <div style="background:#e9ecef; width:100%; height:8px; border-radius:4px; margin-top:5px;">
          <div style="
            width:${Math.min(ventasEmpleado.ventas.marzo * 2, 100)}%; 
            height:100%; 
            background:#007bff; 
            border-radius:4px;">
          </div>
        </div>
      `;
    } else {
      ventasElemento.innerHTML = `
        <strong style="color:#ccc;">Ventas Marzo: No disponible</strong>
      `;
    }

    card.appendChild(ventasElemento);
  });
}

function generarGraficaVentas(ventas) {
  const ctx = document.getElementById("ventasChart").getContext("2d");

  if (window.miGrafica) {
    window.miGrafica.destroy();
  }

  window.miGrafica = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Enero", "Febrero", "Marzo"],
      datasets: [
        {
          label: "Volumen",
          data: [ventas.volumen.enero, ventas.volumen.febrero, ventas.volumen.marzo],
          backgroundColor: ["#1E88E5", "#43A047", "#FB8C00"],
          borderRadius: 5,
        }
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: function(tooltipItem) {
              let value = tooltipItem.raw || 0;
              return `Volumen: $${value.toLocaleString("en-US", {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function(value) {
              return `$${value.toLocaleString("en-US", {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
            }
          }
        }
      },
    }
  });
}


