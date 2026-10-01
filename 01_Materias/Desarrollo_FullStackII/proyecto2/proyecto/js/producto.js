/* js/producto.js — catálogo: filtros, tarjetas y botón Añadir.
   Requiere data.js y carrito.js cargados antes. */
const TEXTO_BOTON = "Añadir al carrito";

const gridProductos = document.getElementById("grid-productos");
const sinResultados = document.getElementById("sin-resultados");
const contFiltroCategorias = document.getElementById("filtro-categorias");

// Las categorías salen de los propios productos (no hay que mantener otra lista)
const CATEGORIAS = [...new Set(PRODUCTOS.map(p => p.categoria))];

// Si llegamos desde el menú del header (productos.html?categoria=Labios)
const parametroCategoria = new URLSearchParams(window.location.search).get("categoria");
const categoriaInicial = CATEGORIAS.includes(parametroCategoria) ? parametroCategoria : null;

function renderFiltroCategorias() {
    if (!contFiltroCategorias) return;
    contFiltroCategorias.innerHTML = CATEGORIAS.map(c => `
        <div class="form-check">
            <input class="form-check-input filtro-categoria" type="checkbox" value="${c}" id="cat-${c.replace(/\s/g, '-')}"
                   ${!categoriaInicial || categoriaInicial === c ? "checked" : ""}>
            <label class="form-check-label" for="cat-${c.replace(/\s/g, '-')}">${c}</label>
        </div>
    `).join("");
    contFiltroCategorias.querySelectorAll(".filtro-categoria")
        .forEach(chk => chk.addEventListener("change", renderProductos));
}

function aplicarFiltros() {
    const categorias = [...document.querySelectorAll(".filtro-categoria:checked")]
        .map(c => c.value);
    const min = Number(document.getElementById("precio-min").value) || 0;
    const max = Number(document.getElementById("precio-max").value) || Infinity;

    return PRODUCTOS.filter(p => {
        const okCategoria = categorias.length === 0 || categorias.includes(p.categoria);
        const okPrecio = p.precio >= min && p.precio <= max;
        return okCategoria && okPrecio;
    });
}

function renderProductos() {
    if (!gridProductos) return;
    const lista = aplicarFiltros();
    gridProductos.innerHTML = "";
    if (sinResultados) sinResultados.hidden = lista.length > 0;

    lista.forEach(p => {
        const cardWrapper = document.createElement("div");
        cardWrapper.className = "col";
        cardWrapper.innerHTML = `
            <div class="card h-100 shadow-sm">
                <a href="detalleProductos.html?id=${p.id}" class="text-decoration-none text-dark">
                    <img src="${p.imagenes[0]}" class="card-img-top" alt="${p.nombre}" 
                         style="height: 250px; object-fit: cover;" onerror="this.onerror=null;this.src='${IMG_PLACEHOLDER}'">
                </a>
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">${p.nombre}</h5>
                    <p class="card-text h4 text-primary">${formatearPrecio(p.precio)}</p>
                </div>
                <div class="card-footer bg-transparent border-top-0 pt-0">
                    <button class="btn btn-primary w-100 btn-agregar" data-id="${p.id}">${TEXTO_BOTON}</button>
                </div>
            </div>
        `;
        gridProductos.appendChild(cardWrapper);
    });
}

/* ---------- Eventos ---------- */
// Añadir al carrito (delegación de eventos)
gridProductos.addEventListener("click", e => {
    const btn = e.target.closest(".btn-agregar");
    if (!btn) return;
    e.preventDefault();

    const producto = PRODUCTOS.find(p => p.id === Number(btn.dataset.id));
    if (!producto) return;

    const agregadas = agregarAlCarrito(producto);

    btn.textContent = agregadas > 0
        ? "✓ Añadido"
        : `Máx. ${MAX_UNIDADES_POR_PRODUCTO} unidades`;
    btn.classList.toggle("agregado", agregadas > 0);
    setTimeout(() => {
        btn.textContent = TEXTO_BOTON;
        btn.classList.remove("agregado");
    }, 1200);
});

// Filtros de precio y limpiar
document.getElementById("precio-min").addEventListener("input", renderProductos);
document.getElementById("precio-max").addEventListener("input", renderProductos);

document.getElementById("btn-limpiar-filtros").addEventListener("click", () => {
    document.querySelectorAll(".filtro-categoria").forEach(c => c.checked = true);
    document.getElementById("precio-min").value = 0;
    document.getElementById("precio-max").value = 100000;
    renderProductos();
});

/* ---------- Inicialización ---------- */
renderFiltroCategorias();
renderProductos();
