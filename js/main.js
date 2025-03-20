document.addEventListener("DOMContentLoaded", async () => {
    await loadEmployees(); // Cargar empleados
    mostrarVentasEnPagina(ventasPorEmpleado); // Mostrar ventas en el grid
});
