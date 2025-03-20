function normalizarNombre(str) {
    return str
        .toUpperCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, ' ')
        .trim();
}

function getLogoUrl(empresa) {
    switch (empresa) {
        case "TAFER": return "./imagenes/TAFER.png";
        case "VILLAGROUP": return "./imagenes/VILLAGROUP.png";
        case "BALFER": return "./imagenes/BALFER.png";
        default: return "./imagenes/default.png";
    }
}

function getSilhouetteUrl(genero) {
    return genero === "Mujer" ? "./imagenes/siluetamujer.png" : "./imagenes/siluetahombre.png";
}
