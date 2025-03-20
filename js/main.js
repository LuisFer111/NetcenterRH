// main.js

document.addEventListener("DOMContentLoaded", async () => {
  await loadEmployees(); // Carga empleados desde JSON
  document.getElementById('employeesGrid').style.display = "none"; // Ocultamos el grid al inicio

  // Una vez cargados, también mostramos ventas
  mostrarVentasEnPagina(ventasPorEmpleado);
});
