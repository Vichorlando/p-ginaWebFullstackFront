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
        id: 1, nombre: "Base Líquida Mate", precio: 12990, categoria: "Rostro",
        imagenes: ["img/base-liquida-1.jpg", "img/base-liquida-2.jpg"],
        descripcion: "Base líquida de acabado mate y cobertura media, de textura ligera y buena duración durante el día."
    },
    {
        id: 2, nombre: "Corrector Cremoso", precio: 8990, categoria: "Rostro",
        imagenes: ["img/corrector-1.jpg", "img/corrector-2.jpg"],
        descripcion: "Corrector de textura cremosa para difuminar ojeras e imperfecciones con facilidad."
    },
    {
        id: 3, nombre: "Delineador Líquido Negro", precio: 6990, categoria: "Ojos",
        imagenes: ["img/delineador-1.jpg", "img/delineador-2.jpg"],
        descripcion: "Delineador de punta fina y trazo preciso, color negro intenso y secado rápido."
    },
    {
        id: 4, nombre: "Máscara de Pestañas Volumen", precio: 9990, categoria: "Ojos",
        imagenes: ["img/mascara-1.jpg", "img/mascara-2.jpg", "img/mascara-3.jpg"],
        descripcion: "Máscara que aporta volumen y definición a las pestañas sin formar grumos."
    },
    {
        id: 5, nombre: "Labial Mate Rosa Nude", precio: 7990, categoria: "Labios",
        imagenes: ["img/labial-1.jpg", "img/labial-2.jpg"],
        descripcion: "Labial de acabado mate en un tono rosa nude versátil para el día a día."
    },
    {
        id: 6, nombre: "Brillo Labial Hidratante", precio: 5990, categoria: "Labios",
        imagenes: ["img/brillo-labial-1.jpg", "img/brillo-labial-2.jpg"],
        descripcion: "Brillo transparente de textura no pegajosa que deja los labios suaves y luminosos."
    },
    {
        id: 7, nombre: "Esmalte Gel Lila", precio: 4990, categoria: "Uñas",
        imagenes: ["img/esmalte-1.jpg", "img/esmalte-2.jpg"],
        descripcion: "Esmalte de efecto gel en tono lila pastel, de brillo duradero y fácil aplicación."
    },
    {
        id: 8, nombre: "Crema Hidratante Facial", precio: 15990, categoria: "Cuidado de la piel",
        imagenes: ["img/crema-facial-1.jpg", "img/crema-facial-2.jpg"],
        descripcion: "Crema facial de absorción rápida para hidratar la piel durante todo el día."
    },
    {
        id: 9, nombre: "Set de Brochas", precio: 19990, categoria: "Accesorios",
        imagenes: ["img/brochas-1.jpg", "img/brochas-2.jpg", "img/brochas-3.jpg"],
        descripcion: "Set de brochas de cerdas suaves para rostro y ojos, con estuche de guardado."
    }
];
