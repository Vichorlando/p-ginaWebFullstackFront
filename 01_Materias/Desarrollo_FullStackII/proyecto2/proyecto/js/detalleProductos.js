/* js/detalleProductos.js — lógica de la vista de detalle.
   Requiere data.js y carrito.js cargados antes. */


/* ---------- Obtener el id desde la URL ---------- */
const params = new URLSearchParams(window.location.search);
const idProducto = Number(params.get("id"));
const producto = PRODUCTOS.find(p => p.id === idProducto);

const contenedorDetalle = document.getElementById("detalle-producto");

/* ---------- Si el producto no existe ---------- */
if (!producto) {
    contenedorDetalle.innerHTML = `
        <div class="col-12 text-center">
            <div class="alert alert-warning my-5">
                <h1 class="h3">Producto no encontrado</h1>
                <p class="lead">El producto que buscas no está disponible.</p>
                <a href="productos.html" class="btn btn-primary mt-3">← Volver al catálogo</a>
            </div>
        </div>
    `;
} else {
    /* ---------- Render del detalle ---------- */
    const miniaturasHTML = producto.imagenes.map((src, i) => `
        <div class="col-3">
            <img class="img-fluid border rounded-3 cursor-pointer ${i === 0 ? 'border-primary' : ''}" 
                 src="${src}" alt="${producto.nombre} ${i + 1}" data-indice="${i}" 
                 onerror="this.onerror=null;this.src='${IMG_PLACEHOLDER}'">
        </div>
    `).join("");

    contenedorDetalle.innerHTML = `
        <!-- Galería -->
        <div class="col-md-6">
            <img id="imagen-principal" class="img-fluid rounded-3 mb-3" src="${producto.imagenes[0]}" alt="${producto.nombre}" 
                 onerror="this.onerror=null;this.src='${IMG_PLACEHOLDER}'">
            <div class="row g-2" id="miniaturas">
                ${miniaturasHTML}
            </div>
        </div>

        <!-- Información -->
        <div class="col-md-6">
            <span class="badge bg-secondary mb-2">${producto.categoria}</span>
            <h1>${producto.nombre}</h1>
            <p class="mb-3" id="precio-unitario">${precioHTML(producto, "h2")}</p>
            <p class="lead">${producto.descripcion}</p>

            <!-- Selector de cantidad -->
            <div class="row align-items-center mb-4">
                 <div class="col-auto">
                    <label for="cantidad" class="col-form-label">Cantidad:</label>
                 </div>
                 <div class="col-auto">
                    <div class="input-group" style="width: 150px;">
                        <button class="btn btn-outline-secondary" type="button" id="btn-menos">−</button>
                        <input type="text" id="cantidad" class="form-control text-center" value="1" min="1" max="${MAX_UNIDADES_POR_PRODUCTO}">
                        <button class="btn btn-outline-secondary" type="button" id="btn-mas">+</button>
                    </div>
                </div>
            </div>

            <!-- Recuadro añadir al carrito -->
            <div class="card bg-light p-3">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <span class="h5">Subtotal</span>
                    <strong id="subtotal" class="h5 text-primary">${formatearPrecio(producto.precio)}</strong>
                </div>
                <div class="d-grid">
                    <button id="btn-agregar" class="btn btn-primary btn-lg">Añadir al carrito</button>
                </div>
            </div>
        </div>
    `;

    /* ---------- Galería: cambiar imagen principal ---------- */
    const imagenPrincipal = document.getElementById("imagen-principal");
    const miniaturas = document.getElementById("miniaturas");

    miniaturas.addEventListener("click", e => {
        const mini = e.target.closest("img[data-indice]");
        if (!mini) return;
        imagenPrincipal.src = producto.imagenes[Number(mini.dataset.indice)];
        miniaturas.querySelectorAll("img[data-indice]")
            .forEach(m => m.classList.remove("border-primary"));
        mini.classList.add("border-primary");
    });

    /* ---------- Selector de cantidad ---------- */
    const inputCantidad = document.getElementById("cantidad");
    const subtotal = document.getElementById("subtotal");

    function actualizarSubtotal() {
        let c = parseInt(inputCantidad.value, 10);
        if (isNaN(c) || c < 1) c = 1;
        if (c > MAX_UNIDADES_POR_PRODUCTO) c = MAX_UNIDADES_POR_PRODUCTO;
        inputCantidad.value = c;
        subtotal.textContent = formatearPrecio(producto.precio * c);
    }

    document.getElementById("btn-menos").addEventListener("click", () => {
        inputCantidad.value = Math.max(1, parseInt(inputCantidad.value, 10) - 1);
        actualizarSubtotal();
    });

    document.getElementById("btn-mas").addEventListener("click", () => {
        inputCantidad.value = Math.min(MAX_UNIDADES_POR_PRODUCTO, parseInt(inputCantidad.value, 10) + 1);
        actualizarSubtotal();
    });

    inputCantidad.addEventListener("input", actualizarSubtotal);

    /* ---------- Añadir al carrito ---------- */
    document.getElementById("btn-agregar").addEventListener("click", e => {
        const cantidad = parseInt(inputCantidad.value, 10) || 1;
        const agregadas = agregarAlCarrito(producto, cantidad);

        const btn = e.currentTarget;
        const original = "Añadir al carrito";
        btn.textContent = agregadas > 0
            ? `✓ Añadido (${agregadas})`
            : `Máximo ${MAX_UNIDADES_POR_PRODUCTO} por producto`;
        btn.classList.add("agregado");
        setTimeout(() => {
            btn.textContent = original;
            btn.classList.remove("agregado");
        }, 1200);
    });
}

/* ---------- Productos relacionados (misma categoría) ---------- */
const seccionRelacionados = document.getElementById("relacionados");
const carrusel = document.getElementById("carrusel-relacionados");

const relacionados = producto
    ? PRODUCTOS.filter(p => p.categoria === producto.categoria && p.id !== producto.id)
    : [];

if (relacionados.length > 0 && carrusel) {
    seccionRelacionados.hidden = false;
    carrusel.innerHTML = relacionados.map(p => `
        <div class="col">
            <div class="card h-100 shadow-sm">
                 <a href="detalleProductos.html?id=${p.id}" class="text-decoration-none text-dark">
                    <img src="${p.imagenes[0]}" class="card-img-top" alt="${p.nombre}" 
                         style="height: 150px; object-fit: cover;" onerror="this.onerror=null;this.src='${IMG_PLACEHOLDER}'">
                </a>
                <div class="card-body">
                    <h6 class="card-title"><a href="detalleProductos.html?id=${p.id}" class="text-decoration-none text-dark">${p.nombre}</a></h6>
                    <p class="card-text mb-0">${precioHTML(p, "fs-6")}</p>
                </div>
            </div>
        </div>
    `).join("");
}
