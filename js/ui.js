// ui.js

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
          ...
        </div>
      `;
    }
  
    // Generar contenido HTML (lo extraigo de tu código)
    detailDiv.innerHTML = `
      <!-- TU CÓDIGO HTML COMPLETO PARA DETALLE -->
    `;
  
    employeesGrid.style.display = "none";
    detailDiv.style.display = "block";
  
    // Ajustar el tamaño del nombre
    const nombreElem = document.getElementById('nombreEmpleado');
    if (emp.Nombre.length > 25) {
      nombreElem.style.fontSize = "18px";
    } else {
      nombreElem.style.fontSize = "22px";
    }
  
    if (ventas) {
      setTimeout(() => generarGraficaVentas(ventas), 300);
    }
  }
  
  // Renderizar el grid de empleados
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
      // Crear la tarjeta
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
  
      card.appendChild(img);
      card.appendChild(name);
      card.appendChild(puesto);
      card.appendChild(extension);
  
      // Evento click
      card.addEventListener('click', () => {
        showEmployeeDetail(emp);
      });
  
      // Mostrar ventas en tarjeta
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
  
  // Actualizar paginación
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
  
  // Eventos de paginación
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
  
  // Búsqueda y sugerencias
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
  