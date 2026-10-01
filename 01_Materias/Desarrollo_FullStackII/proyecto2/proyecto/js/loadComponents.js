/* js/loadComponents.js — carga header, footer e info-box en cada página.
   Las rutas son relativas al HTML que ejecuta el script (todas las páginas
   están en la raíz del proyecto), por eso NO llevan "../". */
document.addEventListener('DOMContentLoaded', () => {
    cargarComponente('header-container', 'components/header.html', updateCartCount);
    cargarComponente('footer-container', 'components/footer.html');
    cargarComponente('info-box-container', 'components/info-box.html', initInfoBox);
});

async function cargarComponente(id, ruta, callback) {
    const contenedor = document.getElementById(id);
    if (!contenedor) return; // esta página no usa este componente

    try {
        const respuesta = await fetch(ruta);
        if (!respuesta.ok) {
            throw new Error(`No se encontró ${ruta} (${respuesta.status})`);
        }
        contenedor.innerHTML = await respuesta.text();
        if (callback) callback();
    } catch (error) {
        console.error(`Error cargando ${ruta}:`, error);
        contenedor.innerHTML = `<p style="color:red">Error al cargar ${ruta}</p>`;
    }
}



function updateCartCount() {
    // Contador del carrito (el header llega después del DOMContentLoaded)
    let total = 0;
    try {
        const carrito = JSON.parse(localStorage.getItem('kateye_carrito')) || [];
        total = carrito.reduce((acc, i) => acc + (Number(i.cantidad) || 0), 0);
    } catch (e) { /* carrito vacío */ }
    document.querySelectorAll('.cart-count').forEach(el => el.textContent = total);
}

function initInfoBox() {
    const infoModalEl = document.getElementById('infoModal');
    if (infoModalEl) {
        const infoModal = new bootstrap.Modal(infoModalEl);
        // Mostrar el modal después de un breve retraso para que el usuario se ubique
        setTimeout(() => {
            infoModal.show();
        }, 1500);
    }
}
