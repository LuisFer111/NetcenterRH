// ui.js
// 2) Mostrar el detalle del empleado
function showEmployeeDetail(emp) {
  const logoUrl = getLogoUrl(emp.Empresa);
  const siluetaUrl = getSilhouetteUrl(emp.Genero);
  const detailDiv = document.getElementById('employeeDetail');
  const employeesGrid = document.getElementById('employeesGrid');

  const llaveEmpleado = normalizarNombre(emp.Nombre);
  const ventas = ventasPorEmpleado[llaveEmpleado];

  let ventasTexto = `<p><strong>Datos de Ventas:</strong> No disponible</p>`;
  if (ventas) {
    ventasTexto = `
      <div style="display: flex; gap: 20px; align-items: flex-start; border:1px solid #ccc; padding:10px; border-radius:5px; background:#f9f9f9;">
        <!-- Sección de información de ventas -->
        <div style="flex: 1; padding-right: 20px;">
          <p><strong>Ventas Totales:</strong> <span style="color:#007bff;">${ventas.ventas_totales}</span></p>
          <p><strong>Volumen Total:</strong> <span style="color:#007bff;">$${ventas.volumen_total.toLocaleString('en-US',{minimumFractionDigits:2, maximumFractionDigits:2})}</span></p>
          <p><strong>Avg. Package Price:</strong> <span style="color:#007bff;">$${ventas.average_package_price.toLocaleString('en-US',{minimumFractionDigits:2, maximumFractionDigits:2})}</span></p>
          <ul style="list-style:none; padding:0; margin:0;">
            <li>
              <strong>Enero:</strong> ${ventas.ventas.enero} ventas |
              <span style="color:#007bff;">
                $${ventas.volumen.enero.toLocaleString("en-US",{minimumFractionDigits:2, maximumFractionDigits:2})}
              </span>
            </li>
            <li>
              <strong>Febrero:</strong> ${ventas.ventas.febrero} ventas |
              <span style="color:#007bff;">
                $${ventas.volumen.febrero.toLocaleString("en-US",{minimumFractionDigits:2, maximumFractionDigits:2})}
              </span>
            </li>
            <li>
              <strong>Marzo:</strong> ${ventas.ventas.marzo} ventas |
              <span style="color:#007bff;">
                $${ventas.volumen.marzo.toLocaleString("en-US",{minimumFractionDigits:2, maximumFractionDigits:2})}
              </span>
            </li>
          </ul>
        </div>
        <!-- Sección de la gráfica -->
        <div style="width:300px; height:200px; flex-shrink:0; margin-top:23px; transform:translateX(-15px);">
          <canvas id="ventasChart"></canvas>
        </div>
      </div>
    `;
  }

  // Tabla principal
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
        <td colspan="2" class="editable-field" style="padding:2px 5px;">
          <strong>ID:</strong> <span id="idValue">${emp.ID || "N/A"}</span>
          <i class="fa-regular fa-pen-to-square edit-icon" onclick="habilitarEdicion('ID')"></i>
        </td>
        <td colspan="2" class="editable-field" style="padding:2px 5px;">
          <strong>CELULAR:</strong>
          <span id="celularValue">${emp.Celular || "N/A"}</span>
          <i class="fa-regular fa-pen-to-square edit-icon" onclick="habilitarEdicion('Celular')"></i>
        </td>
      </tr>
      <tr>
        <td colspan="2" class="editable-field" style="padding:2px 5px;">
          <strong>EXTENSIÓN:</strong>
          <span id="extensionValue">${emp["Extension Telefonica"] || "N/A"}</span>
          <i class="fa-regular fa-pen-to-square edit-icon" onclick="habilitarEdicion('Extension Telefonica')"></i>
        </td>
        <td colspan="2" class="editable-field" style="padding:2px 5px;">
          <strong>E-MAIL:</strong>
          <span id="e-mailValue">${emp["E-mail"] || "N/A"}</span>
          <i class="fa-regular fa-pen-to-square edit-icon" onclick="habilitarEdicion('E-mail')"></i>
        </td>
      </tr>
      <tr>
        <td colspan="2" class="editable-field" style="padding:2px 5px;">
          <strong>DEPARTAMENTO:</strong>
          <span id="departamentoValue">${emp.Departamento || "No especificado"}</span>
          <i class="fa-regular fa-pen-to-square edit-icon" onclick="habilitarEdicion('Departamento')"></i>
        </td>
        <td colspan="2" class="editable-field" style="padding:2px 5px;">
          <strong>JEFE DIRECTO:</strong>
          <span id="jefeValue">${emp["Jefe Inmediato"] || "No especificado"}</span>
          <i class="fa-regular fa-pen-to-square edit-icon" onclick="habilitarEdicion('Jefe Inmediato')"></i>
        </td>
      </tr>
      <tr>
        <td colspan="2" class="editable-field" style="padding:2px 5px;">
          <strong>TURNO:</strong>
          <span id="turnoValue">${emp.Turno || "No asignado"}</span>
          <i class="fa-regular fa-pen-to-square edit-icon" onclick="habilitarEdicion('Turno')"></i>
        </td>
        <td colspan="2" class="editable-field" style="padding:2px 5px;">
          <strong>INICIALES CERTIFICADO:</strong>
          <span id="inicialesValue">${emp["Iniciales Certificado"] || "No registradas"}</span>
          <i class="fa-regular fa-pen-to-square edit-icon" onclick="habilitarEdicion('Iniciales Certificado')"></i>
        </td>
      </tr>
      <tr>
        <td colspan="2" class="editable-field" style="padding:2px 5px;">
          <strong>FECHA DE INGRESO:</strong>
          <span id="fechaValue">${emp["Fecha de Ingreso"] || "No disponible"}</span>
          <i class="fa-regular fa-pen-to-square edit-icon" onclick="habilitarEdicion('Fecha de Ingreso')"></i>
        </td>
        <td colspan="2" class="editable-field" style="padding:2px 5px;">
          <strong>STATUS:</strong>
          <span id="statusValue">${emp.Status || "No disponible"}</span>
          <i class="fa-regular fa-pen-to-square edit-icon" onclick="habilitarEdicion('Status')"></i>
        </td>
      </tr>
      <tr>
        <td colspan="4" class="editable-field" style="padding:2px 5px;">
          <strong>NOMENCLATURA:</strong>
          <span id="nomenclaturaValue">${emp.Nomenclatura || "No especificada"}</span>
          <i class="fa-regular fa-pen-to-square edit-icon" onclick="habilitarEdicion('Nomenclatura')"></i>
        </td>
      </tr>
      <tr>
        <td colspan="4" class="editable-field" style="padding:2px 5px;">
          <strong>CAMPAÑA:</strong>
          <span id="campanaValue">${emp.Campana || "No especificada"}</span>
          <i class="fa-regular fa-pen-to-square edit-icon" onclick="habilitarEdicion('Campana')"></i>
        </td>
      </tr>
    </tbody>
  </table>
</div>
      <tr>
  <td colspan="4" style="padding:2px 5px;">
    <strong>ANTIGÜEDAD:</strong>
    <span id="antiguedadValue" style="color:#333;">
      ${ventasPorEmpleado[llaveEmpleado]?.tiempo_en_empresa || "N/A"}
    </span>
  </td>
</tr>
</tbody>
</table>

<div style="margin-top:10px;">
  ${ventasTexto}
</div>
  `;

  employeesGrid.style.display = "none";
  detailDiv.style.display = "block";

  // Ajustar tamaño del nombre si es largo
  const nombreElem = document.getElementById('nombreEmpleado');
  if (emp.Nombre.length > 25) {
    nombreElem.style.fontSize = "18px";
  } else {
    nombreElem.style.fontSize = "22px";
  }

  if (ventas) {
    setTimeout(() => generarGraficaVentas(ventas), 300);
  }
  // Referencias a botones e inputs
const editarBtn = document.getElementById('editarCelularBtn');
const guardarBtn = document.getElementById('guardarCelularBtn');
const celularSpan = document.getElementById('celularEmpleado');
const inputCelular = document.getElementById('inputCelular');

editarBtn.addEventListener('click', () => {
  inputCelular.style.display = 'inline-block';
  guardarBtn.style.display = 'inline-block';

  editarBtn.style.display = 'none';
  celularSpan.style.display = 'none';
});

guardarBtn.addEventListener('click', async () => {
  const nuevoNumero = inputCelular.value.trim();
  if (!nuevoNumero) return alert("Ingresa un número válido.");

  try {
    // 1) Tu URL base del Apps Script (terminada en /exec)
    const baseUrl = "https://script.google.com/macros/s/AKfycbwuI0hvzcCOXGzm-t4S2cSCK1NMYOV21FuRmB8pkOL_pKaLKiHI5OzbXcQDq7g78maG/exec"; // Ajusta a tu URL final

    // 2) Armamos la query con ?accion=update & nombre= ... & celular= ...
    const url = `${baseUrl}?accion=update&nombre=${encodeURIComponent(emp.Nombre)}&celular=${encodeURIComponent(nuevoNumero)}`;

    // 3) Hacemos un fetch GET
    const response = await fetch(url);
    const resultado = await response.json();

    if (resultado.status === 'success') {
      celularSpan.textContent = nuevoNumero;
      emp.Celular = nuevoNumero;
      alert("✅ Celular actualizado correctamente (vía GET).");
    } else {
      alert("❌ No se pudo actualizar. " + (resultado.message || ''));
    }
  } catch (error) {
    alert("❌ Error al enviar los datos: " + error.message);
  }

  // Ocultar input y volver al modo vista
  inputCelular.style.display = 'none';
  guardarBtn.style.display = 'none';
  editarBtn.style.display = 'inline-block';
  celularSpan.style.display = 'inline-block';
});
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
    // Habilita la edición del campo específico
function habilitarEdicion(campo) {
  const span = document.getElementById(campo.replace(/\s+/g, '').toLowerCase() + 'Value');
  const valorActual = span.textContent;
  span.innerHTML = `
    <input type="text" id="${campo.replace(/\s+/g, '')}Input" value="${valorActual}" style="width:70%;padding:3px;">
    <button onclick="guardarCampo('${campo}')" style="margin-left:5px;padding:3px 8px;">Guardar</button>
  `;
}

// Guarda el campo editado en Google Sheets usando GET
async function guardarCampo(campo) {
  const input = document.getElementById(`${campo}Input`);
  const nuevoValor = input.value.trim();
  const nombreEmpleado = document.getElementById('nombreEmpleado').textContent.trim();

  const url = `https://script.google.com/macros/s/AKfycbzwHiJ7gUX6bOn5NpRFvqpAiFQNJQPa3W_LpITyOpJRi8FAV1xb_QLxBFhiBtyoVvhO/exec?nombre=${encodeURIComponent(nombreEmpleado)}&campo=${encodeURIComponent(campo)}&valor=${encodeURIComponent(nuevoValor)}`;

  try {
    const response = await fetch(url);
    const text = await response.text();
    const data = JSON.parse(text);

    if (data.status === 'success') {
      alert('✅ Actualizado correctamente');
      document.getElementById(`${campo.toLowerCase()}Value`).textContent = nuevoValor;
    } else {
      alert('⚠️ Error: ' + data.message);
    }
  } catch (err) {
    alert('❌ Error en la solicitud: ' + err.message);
    console.error("Error detallado:", err);
  }
}

