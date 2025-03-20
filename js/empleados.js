// empleados.js

let allEmployees = [];
let filteredEmployees = [];
let currentPage = 1;
const pageSize = 8;

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

// Cargar los empleados desde ./Data/empleados_final.json
async function loadEmployees() {
  try {
    const response = await fetch(`./Data/empleados_final.json?t=${new Date().getTime()}`);
    const jsonData = await response.json();

    allEmployees = flattenEmployees(jsonData);
    populateCompanyFilter(allEmployees);

    await obtenerDatosVentas(); // Cargar ventas

    // Comprobación de nombres contra ventas
    console.log("🚩 Comprobación de nombres de empleados contra ventas:");
    allEmployees.forEach(emp => {
      const llaveEmpleado = normalizarNombre(emp.Nombre);
      if (ventasPorEmpleado[llaveEmpleado]) {
        console.log("✅ Nombre coincide:", llaveEmpleado);
      } else {
        console.log("❌ Sin ventas para:", llaveEmpleado);
      }
    });

    filteredEmployees = allEmployees;
    renderGrid(currentPage);
    console.log("✅ Empleados cargados correctamente.");
  } catch (error) {
    console.error("❌ Error al cargar empleados:", error);
  }
}

// Llenar el select con empresas únicas
function populateCompanyFilter(employees) {
  const companyFilter = document.getElementById('companyFilter');
  const companySet = new Set();

  employees.forEach(emp => {
    if (emp.Empresa) {
      companySet.add(emp.Empresa);
    }
  });

  companyFilter.innerHTML = '<option value="">-- Selecciona una empresa --</option>';
  companySet.forEach(empresa => {
    const option = document.createElement('option');
    option.value = empresa;
    option.textContent = empresa;
    companyFilter.appendChild(option);
  });
}

// Manejo de filtro (empresa)
const companyFilter = document.getElementById('companyFilter');
companyFilter.addEventListener('change', (e) => {
  const selectedCompany = e.target.value;
  const employeesGrid = document.getElementById('employeesGrid');
  const employeeDetail = document.getElementById('employeeDetail');

  if (selectedCompany === "") {
    filteredEmployees = [];
    employeesGrid.style.display = "none";
    employeeDetail.style.display = "none";
  } else {
    filteredEmployees = allEmployees.filter(emp => emp.Empresa === selectedCompany);
    employeesGrid.style.display = "grid";
    employeeDetail.style.display = "none";
  }

  renderGrid(currentPage);
});
