// utils.js
function normalizarNombre(str) {
  return str
    .toUpperCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, ' ')
    .trim();
}

function getLogoUrl(empresa) {
  if (empresa === "TAFER") {
    return "./imagenes/TAFER.png";
  } else if (empresa === "VILLAGROUP") {
    return "./imagenes/VILLAGROUP.png";
  } else if (empresa === "BALFER") {
    return "./imagenes/BALFER.png";
  } else {
    return "./imagenes/default.png";
  }
}

function getSilhouetteUrl(genero) {
  if (genero === "Mujer") {
    return "./imagenes/siluetamujer.png";
  } else {
    return "./imagenes/siluetahombre.png";
  }
}
