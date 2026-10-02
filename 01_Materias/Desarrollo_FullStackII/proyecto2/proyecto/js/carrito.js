/* js/carrito.js — carrito de compras (localStorage + panel lateral).
   Requiere js/data.js cargado antes (usa PRODUCTOS e IMG_PLACEHOLDER).

   REGLAS DEL CARRITO
   1. La cantidad de cada producto es un entero entre 1 y MAX_UNIDADES_POR_PRODUCTO.
   2. Si se intenta superar el máximo, se limita y se avisa al usuario.
   3. Un producto que llega a 0 unidades se elimina del carrito.
   4. Un mismo producto no se duplica: se suma a su línea existente.
   5. Nombre, precio e imagen se leen siempre del catálogo, no de localStorage:
      si alguien edita el dato guardado a mano, el precio no cambia.
   6. Los ítems con datos corruptos o cuyo id ya no existe en el catálogo se descartan.
   7. El carrito se guarda en localStorage y se comparte entre todas las páginas.
   8. No se puede ir a pagar con el carrito vacío. */
const CLAVE_CARRITO = "kateye_carrito";
const MAX_UNIDADES_POR_PRODUCTO = 10;

/* Lee y SANEA lo guardado (reglas 1, 5 y 6) */
function obtenerCarrito() {
    let guardado;
    try {
        guardado = JSON.parse(localStorage.getItem(CLAVE_CARRITO));
    } catch (e) {
        return [];
    }
    if (!Array.isArray(guardado)) return [];

    return guardado.reduce((lista, item) => {
        const p = PRODUCTOS.find(prod => prod.id === Number(item && item.id));
        const cantidad = Math.floor(Number(item && item.cantidad));
        if (!p || !(cantidad >= 1)) return lista;
        lista.push({
            id: p.id,
            nombre: p.nombre,
            precio: p.precio,
            precioAnterior: p.precioAnterior > p.precio ? p.precioAnterior : null,
            imagen: p.imagenes[0],
            cantidad: Math.min(cantidad, MAX_UNIDADES_POR_PRODUCTO)
        });
        return lista;
    }, []);
}

function guardarCarrito(carrito) {
    localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito));
    actualizarContadorCarrito();
}

/* Devuelve cuántas unidades se agregaron realmente (0 si ya estaba en el máximo) */
function agregarAlCarrito(producto, cantidad = 1) {
    const carrito = obtenerCarrito();
    const existente = carrito.find(i => i.id === producto.id);
    const actual = existente ? existente.cantidad : 0;
    const permitido = Math.max(0, Math.min(cantidad, MAX_UNIDADES_POR_PRODUCTO - actual));
    if (permitido === 0) return 0;

    if (existente) {
        existente.cantidad += permitido;
    } else {
        carrito.push({
            id: producto.id,
            nombre: producto.nombre,
            precio: producto.precio,
            imagen: producto.imagenes[0],
            cantidad: permitido
        });
    }
    guardarCarrito(carrito);
    renderCarrito();
    return permitido;
}

function cambiarCantidad(id, delta) {
    const carrito = obtenerCarrito();
    const item = carrito.find(i => i.id === id);
    if (!item) return;
    item.cantidad = Math.min(item.cantidad + delta, MAX_UNIDADES_POR_PRODUCTO);
    guardarCarrito(carrito.filter(i => i.cantidad > 0));
    renderCarrito();
}

function eliminarDelCarrito(id) {
    guardarCarrito(obtenerCarrito().filter(i => i.id !== id));
    renderCarrito();
}

function totalCarrito() {
    return obtenerCarrito().reduce((acc, i) => acc + i.precio * i.cantidad, 0);
}

function actualizarContadorCarrito() {
    const total = obtenerCarrito().reduce((acc, i) => acc + i.cantidad, 0);
    // botón flotante (si la página lo tiene) + icono del header
    document.querySelectorAll("#contador-carrito, .cart-count")
        .forEach(el => el.textContent = total);
}

function formatearPrecio(valor) {
    return "$" + valor.toLocaleString("es-CL");
}

function renderCarrito() {
    const contenedor = document.getElementById("items-carrito");
    if (!contenedor) return;
    const carrito = obtenerCarrito();

    if (carrito.length === 0) {
        contenedor.innerHTML = '<p class="text-center text-muted mt-4">Tu carrito está vacío</p>';
    } else {
        contenedor.innerHTML = carrito.map(i => `
            <div class="d-flex align-items-center mb-3">
                <img src="${i.imagen}" alt="${i.nombre}" class="img-fluid rounded me-3" style="width: 80px; height: 80px; object-fit: cover;"
                     onerror="this.onerror=null;this.src='${IMG_PLACEHOLDER}'">
                <div class="flex-grow-1">
                    <h6 class="mb-1">${i.nombre}</h6>
                    <p class="${i.precioAnterior
                        ? `<span class="text-muted text-decoration-line-through small me-1">${formatearPrecio(i.precioAnterior)}</span>
                        <span class="text-danger fw-semibold">${formatearPrecio(i.precio)}</span>`
                        : `<span class="text-muted">${formatearPrecio(i.precio)}</span>`}</p>
                    <div class="d-flex align-items-center">
                        <button class="btn btn-sm btn-outline-secondary" data-accion="menos" data-id="${i.id}">−</button>
                        <span class="mx-2">${i.cantidad}</span>
                        <button class="btn btn-sm btn-outline-secondary" data-accion="mas" data-id="${i.id}"
                                ${i.cantidad >= MAX_UNIDADES_POR_PRODUCTO ? "disabled" : ""}>+</button>
                    </div>
                </div>
                <button class="btn btn-sm btn-outline-danger ms-3" data-accion="eliminar" data-id="${i.id}"
                        aria-label="Eliminar"><i class="bi-trash-fill"></i></button>
            </div>
        `).join("");
    }

    const totalEl = document.getElementById("total-carrito");
    if(totalEl) totalEl.textContent = formatearPrecio(totalCarrito());
    actualizarAhorroDOM();
}


/* ---------- INICIALIZACIÓN Y EVENTOS ---------- */
function initCarritoEventListeners() {
    const itemsContainer = document.getElementById("items-carrito");
    if (itemsContainer) {
        itemsContainer.addEventListener("click", e => {
            const btn = e.target.closest("button[data-accion]");
            if (!btn) return;
            const id = Number(btn.dataset.id);
            if (btn.dataset.accion === "mas") cambiarCantidad(id, 1);
            if (btn.dataset.accion === "menos") cambiarCantidad(id, -1);
            if (btn.dataset.accion === "eliminar") eliminarDelCarrito(id);
        });
    }

    const checkoutBtn = document.getElementById("btn-ir-pagar");
    if(checkoutBtn) {
        checkoutBtn.addEventListener("click", () => {
            if (obtenerCarrito().length === 0) {
                // Idealmente, usar un modal de Bootstrap aquí en vez de alert.
                // Por ahora, se mantiene el alert para no sobre-complicar el script.
                alert("Tu carrito está vacío.");
                return;
            }
            window.location.href = "checkout.html";
        });
    }

    // Render inicial y actualización del contador al cargar la página
    actualizarContadorCarrito();
    renderCarrito();
}

//Cuanto se ahorra en el carrito (suma de descuentos)
function ahorroCarrito() {
    return obtenerCarrito().reduce(
        (acc, i) => acc + (i.precioAnterior ? (i.precioAnterior - i.precio) * i.cantidad : 0), 0); // acc = acumulador, i = item
}

function actualizarAhorroDOM() {
    const totalAhorrado = ahorroCarrito();
    const elemAhorro = document.getElementById('total-ahorro');
    const contenedorAhorro = document.getElementById('contenedor-ahorro');

    if (elemAhorro && contenedorAhorro) {
        if (totalAhorrado > 0) {
            elemAhorro.textContent = totalAhorrado.toLocaleString(); // Formatea el número
            contenedorAhorro.classList.remove('d-none');
            contenedorAhorro.style.display = 'flex'; // Muestra el contenedor si hay ahorro
        } else {
            contenedorAhorro.style.display = 'none'; // Oculta si no hay ahorro
        }
    }
}
document.addEventListener("DOMContentLoaded", initCarritoEventListeners);
