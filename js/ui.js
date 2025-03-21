// ui.js

// 1) Función para mostrar campos adicionales (si los quieres)
function generateEmployeeAttributes(emp) {
  let html = "";
  const ignoreKeys = ["FotoUrl", "Subordinados", "Nombre", "Empresa", "ID", "Celular",
                      "Extension Telefonica", "E-mail", "Departamento", "Jefe Inmediato",
                      "Turno", "Iniciales Certificado", "Fecha de Ingreso", "Status",
                      "Nomenclatura", "Campaña", "Puesto"];
  // Agrega o quita claves si no deseas ignorarlas

  let subordinatesStr = "N/A";
  if (emp.Subordinados && emp.Subordinados.length > 0) {
    subordinatesStr = emp.Subordinados.map(s => s.Nombre).join(", ");
  }

  // Añade un "Subordinados" al final
  // Si ya lo muestras en la tabla, omite esto
  for (const key in emp) {
    if (!ignoreKeys.includes(key)) {
      const value = emp[key] || "N/A";
      html += `<p><strong>${key}:</strong> ${value}</p>`;
    }
  }
  // Subordinados si no lo muestras arriba
  // html += `<p><strong>Subordinados:</strong> ${subordinatesStr}</p>`;

  return html;
}

// 2) Mostrar el detalle del empleado
function showEmployeeDetail(emp) {
  const logoUrl = getLogoUrl(emp.Empresa);
  const siluetaUrl = getSilhouetteUrl(emp.Genero);
  const detailDiv = document.getElementById('employeeDetail');
  const employeesGrid = document.getElementById('employeesGrid');

  const llaveEmpleado = normalizarNombre(emp.Nombre);
  const ventas = ventasPorEmpleado[llaveEmpleado];

  // Por defecto
  let ventasTexto = `<p><strong>Datos de Ventas:</strong> No disponible</p>`;
  if (ventas) {
    ventasTexto = `
    <div style="display: flex; gap: 20px; align-items: flex-start; border:1px solid #ccc; padding:10px; border-radius:5px; background:#f9f9f9;">
      <!-- Sección de información de ventas -->
      <div style="flex: 1; padding-right: 20px;">
        <p><strong>Ventas Totales:</strong> <span style="color:#007bff;">${ventas.ventas_totales}</span></p>
        <p><strong>Volumen Total:</strong> <span style="color:#007bff;">$${ventas.volumen_total.toLocaleString('en-US',{ minimumFractionDigits:2, maximumFractionDigits:2 })}</span></p>
        <p><strong>Avg. Package Price:</strong> <span style="color:#007bff;">$${ventas.average_package_price.toLocaleString('en-US',{ minimumFractionDigits:2, maximumFractionDigits:2 })}</span></p>
        <ul style="list-style:none; padding:0; margin:0;">
          <li><strong>Enero:</strong> ${ventas.ventas.enero} ventas | $${ventas.volumen.enero.toLocaleString()}</li>
          <li><strong>Febrero:</strong> ${ventas.ventas.febrero} ventas | $${ventas.volumen.febrero.toLocaleString()}</li>
          <li><strong>Marzo:</strong> ${ventas.ventas.marzo} ventas | $${ventas.volumen.marzo.toLocaleString()}</li>
        </ul>
      </div>
      <!-- Sección de la gráfica -->
      <div style="width:300px; height:200px; flex-shrink:0; margin-top:23px; transform:translateX(-15px);">
        <canvas id="ventasChart"></canvas>
      </div>
    </div>
    `;
  }

  // Tabla principal (ID, Celular, etc.)
  detailDiv.innerHTML = `
  <div style="display:flex; align-items:center; gap:20px; margin-bottom:10px; position:relative;">
    <img class="logo-empresa" src="${logoUrl}" alt="Logo Empresa" style="max-width:120px;"/>
    <div style="flex-grow:1;">
      <h2 id="nombreEmpleado" style="margin:0; color:#333; white-space:nowrap; overflow:hidden;">
        ${emp.Nombre}
      </h2>
      <p style="font-size:14px; color:#666;"><strong>${emp.Puesto}</strong></p>
    </div>
    <img class="silueta" src="${siluetaUrl}" alt="Silueta Empleado"
      style="position:absolute; right:-10px; top:0; width:120px; height:120px;"/>
  </div>

  <div style="margin-top:25px;">
    <table style="width:100%; border-collapse:collapse; margin-top:15px; border-top:1px solid #ccc;">
      <tbody>
        <tr>
          <td colspan="2" style="padding:2px 5px;">
            <strong>ID:</strong> <span>${emp.ID || "N/A"}</span>
          </td>
          <td colspan="2" style="padding:2px 5px;">
            <strong>CELULAR:</strong> <span>${emp.Celular || "N/A"}</span>
          </td>
        </tr>
        <tr>
          <td colspan="2" style="padding:2px 5px;">
            <strong>EXTENSIÓN:</strong> <span>${emp["Extension Telefonica"] || "N/A"}</span>
          </td>
          <td colspan="2" style="padding:2px 5px;">
            <strong>E-MAIL:</strong> <span>${emp["E-mail"] || "N/A"}</span>
          </td>
        </tr>
        <tr>
          <td colspan="2" style="padding:2px 5px;">
            <strong>DEPARTAMENTO:</strong> <span>${emp.Departamento || "No especificado"}</span>
          </td>
          <td colspan="2" style="padding:2px 5px;">
            <strong>JEFE DIRECTO:</strong> <span>${emp["Jefe Inmediato"] || "No especificado"}</span>
          </td>
        </tr>
        <tr>
          <td colspan="2" style="padding:2px 5px;">
            <strong>TURNO:</strong> <span>${emp.Turno || "No asignado"}</span>
          </td>
          <td colspan="2" style="padding:2px 5px;">
            <strong>INICIALES CERTIFICADO:</strong> <span>${emp["Iniciales Certificado"] || "No registradas"}</span>
          </td>
        </tr>
        <tr>
          <td colspan="2" style="padding:2px 5px;">
            <strong>FECHA DE INGRESO:</strong> <span>${emp["Fecha de Ingreso"] || "No disponible"}</span>
          </td>
          <td colspan="2" style="padding:2px 5px;">
            <strong>STATUS:</strong> <span>${emp.Status || "No disponible"}</span>
          </td>
        </tr>
        <tr>
          <td colspan="4" style="padding:2px 5px;">
            <strong>NOMENCLATURA:</strong> <span>${emp.Nomenclatura || "No especificada"}</span>
          </td>
        </tr>
        <tr>
          <td colspan="4" style="padding:2px 5px;">
            <strong>CAMPAÑA:</strong> <span>${emp.Campaña || "No especificada"}</span>
          </td>
        </tr>
        <tr>
          <td colspan="4" style="padding:2px 5px;">
            <strong>ANTIGÜEDAD:</strong> <span>${ventasPorEmpleado[normalizarNombre(emp.Nombre)]?.tiempo_en_empresa || "N/A"}</span>
          </td>
        </tr>
        <tr>
          <td colspan="4" style="padding:2px 5px;">
            <strong>SUBORDINADOS:</strong> <span>${
              emp.Subordinados && emp.Subordinados.length > 0
                ? emp.Subordinados.map(sub => sub.Nombre).join(", ")
                : "No tiene subordinados"
            }</span>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Aquí mostramos la sección de ventas (ventasTexto) -->
    <div style="margin-top:10px;">
      ${ventasTexto}
    </div>

    <!-- Mostrar campos extra (opcional) -->
    <div style="margin-top:15px; background:#f1f1f1; padding:10px; border-radius:5px;">
      <h3>Otros campos del JSON (opcional)</h3>
      ${generateEmployeeAttributes(emp)}
    </div>
  </div>
  `;

  // Ocultamos el grid y mostramos el detalle
  employeesGrid.style.display = "none";
  detailDiv.style.display = "block";

  // Ajustar el tamaño del nombre si es muy largo
  const nombreElem = document.getElementById('nombreEmpleado');
  if (emp.Nombre.length > 25) {
    nombreElem.style.fontSize = "18px";
  } else {
    nombreElem.style.fontSize = "22px";
  }

  // Llamamos a generarGraficaVentas si existen datos de ventas
  if (ventas) {
    setTimeout(() => generarGraficaVentas(ventas), 300);
  }
}

// 3) Renderizar GRID
function renderGrid(page) {
  const employeesGrid = document.getElementById('employeesGrid');
  if (filteredEmployees.length === 0) {
    employeesGrid.style.display = "none";
    return;
  }
  employeesGrid.style.display = "grid";
  employeesGrid.innerHTML = '';

  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const pageEmployees = filteredEmployees.slice(startIndex, endIndex);

  pageEmployees.forEach(emp => {
    const card = document.createElement('div');
    card.classList.add('employeeCard');

    const img = document.createElement('img');
    img.src = getLogoUrl(emp.Empresa);

    const name = document.createElement('h3');
    name.textContent = emp.Nombre || "Sin nombre";

    const puesto = document.createElement('p');
    puesto.textContent = emp.Puesto || "Puesto no especificado";

    const extension = document.createElement('p');
    extension.textContent = `Ext: ${emp["Extension Telefonica"] || 'N/A'}`;

    // Click => detalle
    card.addEventListener('click', () => {
      showEmployeeDetail(emp);
    });

    card.appendChild(img);
    card.appendChild(name);
    card.appendChild(puesto);
    card.appendChild(extension);

    // Mostrar ventas breves en la card
    const nombreEmpleado = normalizarNombre(emp.Nombre);
    const ventasEmpleado = ventasPorEmpleado[nombreEmpleado];
    let ventasElemento = document.createElement("p");
    ventasElemento.classList.add("ventas-info");

    if (ventasEmpleado) {
      ventasElemento.innerHTML = `
        <strong>Ventas (Marzo):</strong> ${ventasEmpleado.ventas.marzo}
      `;
    } else {
      ventasElemento.innerHTML = "<strong>Ventas Marzo:</strong> No disponible";
    }
    ventasElemento.style.fontWeight = "bold";
    ventasElemento.style.color = "#007bff";

    card.appendChild(ventasElemento);
    employeesGrid.appendChild(card);
  });

  updatePaginationControls();
  mostrarVentasEnPagina(ventasPorEmpleado);
}

// 4) Controles de paginación
function updatePaginationControls() {
  const totalEmployees = filteredEmployees.length;
  const totalPages = Math.ceil(totalEmployees / pageSize);

  const pageInfo = document.getElementById('pageInfo');
  pageInfo.textContent = `Página ${currentPage} de ${totalPages}`;

  const prevButton = document.getElementById('prevPage');
  const nextButton = document.getElementById('nextPage');

  prevButton.disabled = (currentPage === 1);
  nextButton.disabled = (currentPage === totalPages || totalPages === 0);
}

// 5) Botones de paginación
document.getElementById('prevPage').addEventListener('click', () => {
  if (currentPage > 1) {
    currentPage--;
    renderGrid(currentPage);
  }
});
document.getElementById('nextPage').addEventListener('click', () => {
  const totalPages = Math.ceil(filteredEmployees.length / pageSize);
  if (currentPage < totalPages) {
    currentPage++;
    renderGrid(currentPage);
  }
});

// 6) Búsqueda y sugerencias
const searchInput = document.getElementById('searchInput');
const resultsInfo = document.getElementById('resultsInfo');

searchInput.addEventListener('input', () => {
  const query = searchInput.value.trim().toLowerCase();
  const suggestionsList = document.getElementById('suggestions');
  if (!query) {
    suggestionsList.innerHTML = '';
    resultsInfo.textContent = '';
    return;
  }
  const filtered = allEmployees.filter(emp => {
    const nombre = (emp.Nombre || "").toLowerCase();
    const extension = (emp["Extension Telefonica"] || "").toLowerCase();
    const puesto = (emp.Puesto || "").toLowerCase();
    return (
      nombre.includes(query) ||
      extension.includes(query) ||
      puesto.includes(query)
    );
  });
  resultsInfo.textContent = '';
  renderSuggestions(filtered.slice(0, 10));
});

function renderSuggestions(results) {
  const suggestionsList = document.getElementById('suggestions');
  suggestionsList.innerHTML = '';
  results.forEach(emp => {
    const li = document.createElement('li');
    li.textContent = `${emp.Nombre} (Ext: ${emp["Extension Telefonica"] || 'N/A'})`;
    li.addEventListener('click', () => {
      showEmployeeDetail(emp);
      suggestionsList.innerHTML = '';
      searchInput.value = '';
      resultsInfo.textContent = '';
    });
    suggestionsList.appendChild(li);
  });
}
