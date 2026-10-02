/* js/data.js — datos compartidos por productos.html y detalleProductos.html */
const IMG_PLACEHOLDER = "data:image/svg+xml;utf8," + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600">' +
    '<rect width="100%" height="100%" fill="#eef1f4"/>' +
    '<text x="50%" y="50%" font-family="Arial" font-size="26" fill="#98a2b3" ' +
    'text-anchor="middle" dominant-baseline="middle">Sin imagen</text></svg>'
);

// Catálogo de productos cosméticos (las categorías del filtro salen de aquí)
const PRODUCTOS = [
    {
        id: 1, nombre: "Base Líquida Mate", precio: 12990, precioAnterior: 16990, categoria: "Rostro",
        imagenes: ["img/Base líquida mate.jpg"],
        descripcion: "Base líquida de acabado mate y cobertura media, de textura ligera y buena duración durante el día."
    },
    {
        id: 2, nombre: "Corrector Cremoso", precio: 8990, precioAnterior: 12990, categoria: "Rostro",
        imagenes: ["img/Corrector Cremoso.jpg"],
        descripcion: "Corrector de textura cremosa para difuminar ojeras e imperfecciones con facilidad."
    },
    {
        id: 3, nombre: "Delineador Líquido Negro", precio: 6990, precioAnterior: 9990, categoria: "Ojos",
        imagenes: ["img/Delineador Líquido Negro.jpg"],
        descripcion: "Delineador de punta fina y trazo preciso, color negro intenso y secado rápido."
    },
    {
        id: 4, nombre: "Máscara de Pestañas Volumen", precio: 9990, categoria: "Ojos",
        imagenes: ["img/Máscara de Pestañas Volumen.jpg"],
        descripcion: "Máscara que aporta volumen y definición a las pestañas sin formar grumos."
    },
    {
        id: 5, nombre: "Labial Mate Rosa Nude", precio: 7990, categoria: "Labios",
        imagenes: ["img/Labial Mate Rosa Nude.jpg"],
        descripcion: "Labial de acabado mate en un tono rosa nude versátil para el día a día."
    },
    {
        id: 6, nombre: "Brillo Labial Hidratante", precio: 5990, categoria: "Labios",
        imagenes: ["img/Brillo Labial Hidratante.jpg"],
        descripcion: "Brillo transparente de textura no pegajosa que deja los labios suaves y luminosos."
    },
    {
        id: 7, nombre: "Esmalte Gel Lila", precio: 4990, categoria: "Uñas",
        imagenes: ["img/Esmalte Gel Lila.jpg"],
        descripcion: "Esmalte de efecto gel en tono lila pastel, de brillo duradero y fácil aplicación."
    },
    {
        id: 8, nombre: "Crema Hidratante Facial", precio: 15990, categoria: "Cuidado de la piel",
        imagenes: ["img/Crema Hidratante Facial.jpg"],
        descripcion: "Crema facial de absorción rápida para hidratar la piel durante todo el día."
    },
    {
        id: 9, nombre: "Set de Brochas", precio: 19990, categoria: "Accesorios",
        imagenes: ["img/Set de Brochas.jpg"],
        descripcion: "Set de brochas de cerdas suaves para rostro y ojos, con estuche de guardado."
    }
];

function precioHTML(p, tamano = "h4") {
    if (!p.precioAnterior || p.precioAnterior <= p.precio) {
        return `<span class="${tamano} text-primary">${formatearPrecio(p.precio)}</span>`;
    }
    const descuento = Math.round((1 - p.precio / p.precioAnterior) * 100);
    return `
        <span class="text-muted text-decoration-line-through small">${formatearPrecio(p.precioAnterior)}</span>
        <span class="${tamano} text-danger ms-1">${formatearPrecio(p.precio)}</span>
        <span class="badge bg-danger ms-1">-${descuento}%</span>
    `;
}