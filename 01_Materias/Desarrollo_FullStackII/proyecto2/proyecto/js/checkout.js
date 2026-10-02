/* js/checkout.js — página de resumen y confirmación de compra.
   Requiere data.js y carrito.js cargados antes (usa obtenerCarrito,
   guardarCarrito, totalCarrito, formatearPrecio e IMG_PLACEHOLDER). */
(function () {
    const CLAVE_PEDIDO = "kateye_ultimo_pedido";

    const vistaVacia = document.getElementById("checkout-vacio");
    const vistaContenido = document.getElementById("checkout-contenido");
    const vistaConfirmacion = document.getElementById("checkout-confirmacion");
    const form = document.getElementById("form-checkout");

    const esc = s => String(s).replace(/[&<>"']/g, c =>
        ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

    /* ---------- Resumen del pedido ---------- */
    function renderResumen() {
        const carrito = obtenerCarrito();

        if (carrito.length === 0) {
            vistaVacia.hidden = false;
            vistaContenido.hidden = true;
            return false;
        }
        vistaVacia.hidden = true;
        vistaContenido.hidden = false;

        document.getElementById("resumen-items").innerHTML = carrito.map(i => `
            <div class="d-flex align-items-center mb-3">
                <img src="${esc(i.imagen)}" alt="${esc(i.nombre)}" class="rounded me-3"
                     style="width: 64px; height: 64px; object-fit: cover;"
                     onerror="this.onerror=null;this.src='${IMG_PLACEHOLDER}'">
                <div class="flex-grow-1">
                    <div class="fw-semibold">${esc(i.nombre)}</div>
                    <small class="text-muted">${i.cantidad} × ${formatearPrecio(i.precio)}</small>
                </div>
                <strong>${formatearPrecio(i.precio * i.cantidad)}</strong>
            </div>
        `).join("");

        const ahorro = carrito.reduce(
            (acc, i) => acc + (i.precioAnterior ? (i.precioAnterior - i.precio) * i.cantidad : 0), 0);
        document.getElementById("fila-ahorro").hidden = ahorro === 0;
        document.getElementById("resumen-ahorro").textContent = formatearPrecio(ahorro);
        document.getElementById("resumen-total").textContent = formatearPrecio(totalCarrito());
        return true;
    }

    /* ---------- Validación ---------- */
    const reglas = {
        "co-nombre": v => !v ? "Ingresa tu nombre." : "",
        "co-correo": v => !v ? "Ingresa tu correo."
            : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? "Ingresa un correo válido." : "",
        "co-telefono": v => !v ? "Ingresa tu teléfono."
            : !/^(\+?56)?\s?9[\s\d]{8,10}$/.test(v) ? "Ingresa un celular chileno válido." : "",
        "co-direccion": v => !v ? "Ingresa tu dirección." : "",
        "co-comuna": v => !v ? "Ingresa tu comuna." : ""
    };

    function validarCampo(id) {
        const input = document.getElementById(id);
        const mensaje = reglas[id](input.value.trim());
        input.classList.toggle("is-invalid", mensaje !== "");
        document.getElementById("error-" + id).textContent = mensaje;
        return mensaje === "";
    }

    Object.keys(reglas).forEach(id => {
        const input = document.getElementById(id);
        input.addEventListener("blur", () => validarCampo(id));
        input.addEventListener("input", () => {
            if (input.classList.contains("is-invalid")) validarCampo(id);
        });
    });

    /* ---------- Confirmar compra ---------- */
    form.addEventListener("submit", e => {
        e.preventDefault();

        const ids = Object.keys(reglas);
        const resultados = ids.map(validarCampo);
        const primerError = ids.find((id, n) => !resultados[n]);
        if (primerError) {
            document.getElementById(primerError).focus();
            return;
        }

        const carrito = obtenerCarrito();
        if (carrito.length === 0) { renderResumen(); return; }

        const pedido = {
            numero: "KE-" + Date.now().toString().slice(-6),
            fecha: new Date().toISOString(),
            cliente: {
                nombre: document.getElementById("co-nombre").value.trim(),
                correo: document.getElementById("co-correo").value.trim(),
                telefono: document.getElementById("co-telefono").value.trim(),
                direccion: document.getElementById("co-direccion").value.trim(),
                comuna: document.getElementById("co-comuna").value.trim()
            },
            pago: form.elements["pago"].value,
            items: carrito.map(i => ({ id: i.id, nombre: i.nombre, precio: i.precio, cantidad: i.cantidad })),
            total: totalCarrito()
        };

        // No hay backend: el pedido queda solo en el navegador
        try { localStorage.setItem(CLAVE_PEDIDO, JSON.stringify(pedido)); } catch (err) { /* sin almacenamiento */ }

        guardarCarrito([]); // vacía el carrito y actualiza los contadores

        document.getElementById("conf-numero").textContent = pedido.numero;
        document.getElementById("conf-total").textContent = formatearPrecio(pedido.total);
        document.getElementById("conf-correo").textContent = pedido.cliente.correo;
        vistaContenido.hidden = true;
        vistaVacia.hidden = true;
        vistaConfirmacion.hidden = false;
        vistaConfirmacion.scrollIntoView({ behavior: "smooth", block: "start" });
    });

    renderResumen();
})();
