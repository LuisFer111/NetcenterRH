let allEmployees = [];
let filteredEmployees = [];
let currentPage = 1;
const pageSize = 8;

// Función para 'aplanar' empleados
function flattenEmployees(data) {
    const result = [];
    function recurse(emp) {
        result.push(emp);
        if (emp.Subordinados && emp.Subordinados.length > 0) {
            emp.Subordinados.forEach(sub => recurse(sub));
        }
    }
    for (const empresaKey in data) {
        data[empresaKey].empleados.forEach(emp => recurse(emp));
    }
    return result;
}

// Cargar JSON con Fetch
async function loadEmployees() {
    try {
        const response = await fetch(`./Data/empleados_final.json?t=${new Date().getTime()}`);
        const jsonData = await response.json();
        allEmployees = flattenEmployees(jsonData);
        populateCompanyFilter(allEmployees);
        
        await obtenerDatosVentas();

        console.log("✅ Empleados cargados correctamente.");
        filteredEmployees = allEmployees;
        renderGrid(currentPage);
    } catch (error) {
        console.error("❌ Error al cargar empleados:", error);
    }
}
