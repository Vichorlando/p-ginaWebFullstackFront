/* js/index.js — lista vertical con todo el catálogo en el inicio.
   Requiere data.js y carrito.js cargados antes. */
const TEXTO_BOTON_INDEX = "Agregar al carrito";
const listaProductos = document.getElementById("lista-productos");

/*Lista los producto con los descuentos*/
function renderListaProductos() {
    listaProductos.innerHTML = PRODUCTOS.map(p => `
        <div class="card shadow-sm">
            <div class="row g-0 align-items-center">
                <div class="col-md-3">
                    <img src="${p.imagenes[0]}" class="img-fluid rounded-start w-100" alt="${p.nombre}"
                         style="height: 200px; object-fit: cover;" onerror="this.onerror=null;this.src='${IMG_PLACEHOLDER}'">
                </div>
                <div class="col-md-6">
                    <div class="card-body">
                        <h5 class="card-title">${p.nombre}</h5>
                        <p class="card-text text-muted mb-1">${p.categoria}</p>
                        <p class="card-text">${p.descripcion}</p>
                    </div>
                </div>
                <div class="col-md-3 p-3 text-center">
                    <p class="card-text mb-0">${precioHTML(p)}</p> 
                    <button type="button" class="btn btn-primary w-100 mb-2 btn-agregar" data-id="${p.id}">${TEXTO_BOTON_INDEX}</button>
                    <a href="detalleProductos.html?id=${p.id}" class="btn btn-outline-primary w-100">Ver detalle</a>
                </div>
            </div>
        </div>
    `).join("");
}

listaProductos.addEventListener("click", e => {
    const btn = e.target.closest(".btn-agregar");
    if (!btn) return;
    const producto = PRODUCTOS.find(p => p.id === Number(btn.dataset.id));
    if (!producto) return;

    const agregadas = agregarAlCarrito(producto);
    btn.textContent = agregadas > 0 ? "✓ Añadido" : `Máx. ${MAX_UNIDADES_POR_PRODUCTO} unidades`;
    setTimeout(() => { btn.textContent = TEXTO_BOTON_INDEX; }, 1200);
});

renderListaProductos();
