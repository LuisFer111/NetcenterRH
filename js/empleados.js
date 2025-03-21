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

async function loadEmployees() {
  try {
    const response = await fetch('https://docs.google.com/spreadsheets/d/e/2PACX-1vSkIP8g5l__DthD32Rh0GicEiRBvo17EXKptc_Ea8DIF6KICuJ_jINCjO-6mxz8eCv9CAXApzEIjyJ0/pub?gid=59987663&single=true&output=csv');
    const csvData = await response.text();

    // Convertir CSV a objetos JavaScript
    allEmployees = csvToObjects(csvData);
    console.log(allEmployees);

    populateCompanyFilter(allEmployees);
    await obtenerDatosVentas();

    filteredEmployees = allEmployees;
    renderGrid(currentPage);
    console.log("✅ Empleados cargados correctamente desde CSV.");
  } catch (error) {
    console.error("❌ Error al cargar empleados desde CSV:", error);
  }
}
// Función auxiliar para convertir CSV a objetos JavaScript
function csvToObjects(csv) {
  const rows = csv.split('\n').map(row => row.split(','));
  const headers = rows.shift();
  return rows.map(row => {
    return row.reduce((acc, cur, i) => {
      acc[headers[i].trim()] = cur.trim();
      return acc;
    }, {});
  });
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
