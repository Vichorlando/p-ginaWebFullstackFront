# Interacciones y flujos

## 1. Ciclo de carga de una página pública

1. El navegador parsea el HTML. Los `<script>` están al final del `<body>`.
2. Se dispara `DOMContentLoaded`. `loadComponents.js` registra su listener antes que los demás scripts.
3. `cargarFontAwesome()` añade un `<link>` a cdnjs.
4. `cargarComponente()` hace `fetch` de `header.html`, `footer.html` y, si existe `#info-box-container`, de `info-box.html`.
5. Cada parcial se inyecta con `innerHTML` y luego corre su callback:
   - `initHeader()`: pone el contador del carrito y registra el menú de categorías.
   - `initInfoBox()`: registra el cierre.
6. En paralelo, `carrito.js` ejecuta `initCarrito()` y `producto.js` o `detalleProductos.js` renderizan su contenido.

**Consecuencia:** el header aparece de forma asíncrona. Si `fetch` falla (por ejemplo con `file://`), el contenedor muestra `<p style="color:red">Error al cargar ...</p>` y el contador del carrito queda sin inicializar.

## 2. Flujos de usuario

### 2.1 Navegación

```
Logo / Inicio → index.html
Productos → productos.html
Categorías ▾ → productos.html?categoria=<Rostro|Ojos|Labios|Uñas|Cuidado de la piel|Accesorios>
Blogs → Blogs.html → Blog1.html | Blog2.html (flecha de regreso)
Nosotros · Contacto
Ingresar → iniciarSesion.html · Registrarse → registroUsuario.html
Icono 🛒 del header → productos.html (no abre el panel)
```

### 2.2 Compra (el flujo principal)

```
productos.html
 ├─ filtrar (categorías / precio)
 ├─ "Añadir al carrito"  ──┐
 └─ clic en la tarjeta → detalleProductos.html?id=N
        ├─ cambiar imagen (miniaturas)
        ├─ elegir cantidad 1–10 (−, +, input)
        └─ "Añadir al carrito" ──┐
                                 ▼
             localStorage["kateye_carrito"] + contadores
                                 ▼
 botón flotante 🛒 → panel lateral: +, −, 🗑, total
                                 ▼
             "Ir a pagar" → checkout.html (NO EXISTE)
```

### 2.3 Inicio de sesión

Se valida el correo y la contraseña. Si todo es válido se muestra: "Datos válidos. (Aún no hay servidor: no se inicia sesión realmente.)". No hay sesión, token ni redirección.

### 2.4 Registro

El formulario se puede enviar sin validación JS. Las comunas no dependen de la región.

### 2.5 Contacto

Se valida, se muestra "Tu mensaje fue validado correctamente.", se limpia el formulario y el contador vuelve a `0/500`. No se envía nada.

### 2.6 Administración

```
home.html ←→ usuario.html ←→ producto.html     (sidebar)
 ├─ buscar (input en vivo) → filtra la tabla y actualiza #contador
 ├─ Eliminar → confirm() → quita el registro de memoria (se pierde al recargar)
 ├─ "+ Agregar" → usuarioForm.html / productoForm.html (NO EXISTEN)
 └─ "Editar" → ...Form.html?id=N (NO EXISTEN)
```

El botón "Search" del sidebar da foco a `#buscar`. Settings, Help y Perfil no hacen nada. No hay autenticación ni enlace desde el sitio público.

## 3. Eventos por archivo

### `loadComponents.js`

| Evento | Objetivo | Efecto |
|---|---|---|
| `DOMContentLoaded` | document | Carga de parciales |
| `click` | `#categorias-toggle` | Alterna `panel.hidden` y `aria-expanded` (con `stopPropagation`) |
| `click` | document | Si el clic cae fuera del panel, lo cierra |
| `keydown` Escape | document | Cierra el panel |
| `click` | `.close-btn` | `#info-box-container.style.display = 'none'` |

### `carrito.js`

| Evento | Objetivo | Efecto |
|---|---|---|
| `click` | `#btn-carrito` | `abrir()`: añade `.abierto` al panel y `.activo` al overlay, y pone `aria-hidden=false` |
| `click` | `#btn-cerrar-carrito`, `#overlay-carrito` | `cerrar()` |
| `click` (delegado) | `#items-carrito` | `button[data-accion]` con `mas`, `menos` o `eliminar` y `data-id` |
| `click` | `#btn-ir-pagar` | Si el carrito está vacío, `alert`; si no, `location = checkout.html` |

Cada cambio llama a `guardarCarrito()` (que actualiza `localStorage` y los contadores) y luego a `renderCarrito()`.

### `producto.js`

| Evento | Objetivo | Efecto |
|---|---|---|
| `change` | `.filtro-categoria` | `renderProductos()` |
| `input` | `#precio-min`, `#precio-max` | `renderProductos()` |
| `click` | `#btn-limpiar-filtros` | Marca todas las categorías, pone min=0 y max=100000, y re-renderiza |
| `click` (delegado) | `#grid-productos` | `.btn-agregar`: `e.preventDefault()`, añade 1 unidad y da feedback durante 1200 ms |

La categoría inicial sale de `?categoria=`. Si no es válida, se marcan todas.
Los filtros se combinan con AND entre categoría y precio; sin categorías marcadas se muestran todas. Un máximo vacío o 0 equivale a `Infinity`.

### `detalleProductos.js`

| Evento | Objetivo | Efecto |
|---|---|---|
| `click` | `#miniaturas` | Cambia `#imagen-principal.src` y mueve la clase `.activa` |
| `click` | `#btn-menos`, `#btn-mas` | Ajusta la cantidad entre 1 y 10 y recalcula `#subtotal` |
| `input` | `#cantidad` | Normaliza a un entero entre 1 y 10 |
| `click` | `#btn-agregar` | `agregarAlCarrito(producto, cantidad)` y feedback de 1200 ms |

### `validaciones.js`

| Evento | Efecto |
|---|---|
| `blur` en un campo | Valida y muestra el error |
| `input` en un campo | Revalida **solo si ya tiene `.invalido`** |
| `submit` | `preventDefault`, valida todos, enfoca el primer error y, si todo está bien, ejecuta `alExito` |
| `input` en `#contenido` | Actualiza el contador y alterna `.excedido` |

### `productScroll.js`

`mousemove` y `touchmove` sobre `.products-scroll`: si el cursor está en el último 25 % por la derecha, `scrollBy(20,0)`; en el primer 25 %, `scrollBy(-20,0)`. En `touchmove` se usa `clientX` y no `offsetX`, lo que es impreciso cuando el contenedor no empieza en x=0.

### Admin (`usuario.html`, `producto.html`, JS inline)

| Evento | Efecto |
|---|---|
| `input` en `#buscar` | Re-render filtrado, no sensible a mayúsculas |
| `click` en `[data-eliminar]` | `confirm()` y quita el registro de la lista en memoria |

## 4. Contratos de datos

### Producto (`data.js`)

```js
{ id: Number, nombre: String, precio: Number /* CLP entero */,
  categoria: "Rostro"|"Ojos"|"Labios"|"Uñas"|"Cuidado de la piel"|"Accesorios",
  imagenes: String[] /* ≥1 */, descripcion: String }
```

Hay 9 productos. Las categorías del filtro se **derivan** de los productos. El menú del header las tiene **escritas a mano**: deben mantenerse sincronizadas.

### Ítem del carrito (`localStorage["kateye_carrito"]`)

```js
[{ id: Number, nombre: String, precio: Number, imagen: String, cantidad: 1..10 }]
```

Reglas (`carrito.js:4-13`):
1. La cantidad es un entero entre 1 y 10.
2. Si se supera el máximo, se limita.
3. Una cantidad de 0 elimina la línea.
4. Un mismo producto no se duplica.
5. El nombre, el precio y la imagen se releen del catálogo.
6. Los ítems corruptos o con un id inexistente se descartan.
7. El carrito es compartido por todas las páginas.
8. No se puede ir a pagar con el carrito vacío.

### Formato de precio

`formatearPrecio(n)` → `"$" + n.toLocaleString("es-CL")` (por ejemplo `$12.990`).

### Parámetros de URL

| Página | Parámetro | Valores |
|---|---|---|
| `productos.html` | `categoria` | Nombre exacto de la categoría (se ignora si no existe) |
| `detalleProductos.html` | `id` | Entero de un producto; si no existe, muestra "Producto no encontrado" |
| `usuarioForm.html` / `productoForm.html` | `id` | Referenciado, pero las páginas no existen |

### Reglas de validación (`validaciones.js`)

| Campo | Regla |
|---|---|
| Correo | Obligatorio en el login y opcional en contacto. Máximo 100 caracteres, regex `^[^\s@]+@[^\s@]+\.[^\s@]+$` y dominio en `duoc.cl`, `profesor.duoc.cl` o `gmail.com` |
| Contraseña | Obligatoria, de 4 a 10 caracteres |
| Nombre | Obligatorio, máximo 100 caracteres |
| Comentario | Obligatorio, máximo 500 caracteres, con contador |

## 5. Contrato DOM entre HTML y JS

IDs, `data-*` y clases de estado que el JS lee o escribe. **No renombrar sin actualizar el script.**

| Script | Selectores |
|---|---|
| `loadComponents.js` | `#header-container`, `#footer-container`, `#info-box-container`, `#categorias-toggle`, `#categorias-panel`, `.cart-count`, `.close-btn` |
| `carrito.js` | `#btn-carrito`, `#panel-carrito`, `#overlay-carrito`, `#btn-cerrar-carrito`, `#items-carrito`, `#total-carrito`, `#btn-ir-pagar`, `#contador-carrito`, `.cart-count`, `[data-accion]`, `[data-id]`, clases `.abierto` y `.activo` |
| `producto.js` | `#grid-productos`, `#sin-resultados`, `#filtro-categorias`, `.filtro-categoria`, `#precio-min`, `#precio-max`, `#btn-limpiar-filtros`, `.btn-agregar`, clase `.agregado` |
| `detalleProductos.js` | `#detalle-producto`, `#imagen-principal`, `#miniaturas`, `.galeria__miniatura` (`.activa`, `data-indice`), `#cantidad`, `#btn-menos`, `#btn-mas`, `#subtotal`, `#btn-agregar`, `#relacionados`, `#carrusel-relacionados` |
| `validaciones.js` | `#form-login`, `#email`, `#password`, `#form-contacto`, `#nombre`, `#correo`, `#contenido`, `#contador-contenido`, `#mensaje-form`, `#error-<id>`, clases `.invalido` y `.excedido` |
| `admin.js` | `#sidebar[data-activo]`, `#btn-menu-buscar`, `#buscar` |
| JS inline del admin | `#tabla-usuarios` (o el equivalente de productos), `#buscar`, `#sin-resultados`, `#contador`, `[data-eliminar]` |
| `productScroll.js` | `.products-scroll`, `.product-card` |

## 6. Efectos temporales y animaciones

- Feedback "✓ Añadido": 1200 ms (`setTimeout`).
- Panel del carrito: transición CSS con `transform`.
- Flecha de categorías: rotación de 180° en `.2s`.
- Hover de enlaces del nav: `opacity .2s`.
- `prefers-reduced-motion`: solo se respeta en `admin.css`.
