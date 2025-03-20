function showEmployeeDetail(emp) {
    const detailDiv = document.getElementById('employeeDetail');
    const employeesGrid = document.getElementById('employeesGrid');

    const logoUrl = getLogoUrl(emp.Empresa);
    const siluetaUrl = getSilhouetteUrl(emp.Genero);
    const llaveEmpleado = normalizarNombre(emp.Nombre);
    const ventas = ventasPorEmpleado[llaveEmpleado];

    let ventasTexto = `<p><strong>Datos de Ventas:</strong> No disponible</p>`;
    if (ventas) {
        ventasTexto = `
            <div style="display: flex; gap: 20px;">
                <div style="flex: 1;">
                    <p><strong>Ventas Totales:</strong> ${ventas.ventas_totales}</p>
                    <p><strong>Volumen Total:</strong> $${ventas.volumen_total.toLocaleString()}</p>
                </div>
                <div style="width: 200px; height: 150px;">
                    <canvas id="ventasChart"></canvas>
                </div>
            </div>`;
    }

    detailDiv.innerHTML = `
        <div style="display:flex; align-items:center;">
            <img class="logo-empresa" src="${logoUrl}" />
            <div style="flex-grow:1;">
                <h2>${emp.Nombre}</h2>
                <p><strong>${emp.Puesto}</strong></p>
            </div>
            <img class="silueta" src="${siluetaUrl}" />
        </div>
        <table>
            <tr>
                <td><strong>ID:</strong> ${emp.ID || "N/A"}</td>
                <td><strong>Celular:</strong> ${emp.Celular || "N/A"}</td>
            </tr>
            <tr>
                <td><strong>Extensión:</strong> ${emp["Extension Telefonica"] || "N/A"}</td>
                <td><strong>E-mail:</strong> ${emp["E-mail"] || "N/A"}</td>
            </tr>
        </table>
        ${ventasTexto}`;

    employeesGrid.style.display = "none";
    detailDiv.style.display = "block";

    if (ventas) setTimeout(() => generarGraficaVentas(ventas), 300);
}
