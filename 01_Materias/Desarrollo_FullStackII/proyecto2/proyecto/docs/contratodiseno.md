# Contrato de diseño: KatEye

Documento para el **modelo encargado del diseño**. Resume lo que necesita saber para rediseñar la interfaz sin romper el funcionamiento.
Detalle técnico en `arquitectura.md`, `interfaces.md`, `interacciones.md` y `deuda-tecnica.md`.

## 1. Contexto

- **Producto:** KatEye, tienda en línea de cosméticos (rostro, ojos, labios, uñas, cuidado de la piel y accesorios).
- **Partes:** sitio público (catálogo, detalle, carrito, blogs, contacto, login y registro) y panel de administración (`home`, `usuario` y `producto`).
- **Origen:** proyecto académico de Desarrollo Full Stack II. Es un prototipo frontend sin backend.
- **Tecnología:** HTML, CSS y JavaScript vanilla, sin build ni frameworks. Se sirve como archivos estáticos por HTTP.
- **Idioma de la interfaz:** español (Chile). Moneda: CLP, con formato `$12.990`.
- **Identidad actual:** paleta violeta pastel (#7B6BA8), fondo lavanda (#F5F0FA) y acentos rosa, melocotón y celeste. Tipografía serif (Georgia). Tono suave y femenino.

## 2. Objetivos del rediseño

1. Lograr una identidad visual coherente y profesional entre las páginas públicas y entre estas y el admin.
2. Hacer el sitio **realmente responsive**, con diseño mobile-first y un menú móvil.
3. Unificar los estilos en un sistema de tokens (color, tipografía, espaciado, radios y sombras) y un conjunto de componentes reutilizables, en especial los botones.
4. Llegar a un nivel de accesibilidad WCAG 2.1 AA: contraste, foco visible, diálogos y movimiento reducido.
5. Resolver las incoherencias y duplicados de CSS listados en `deuda-tecnica.md` (sección CSS).
6. Dar un diseño a las pantallas que hoy están vacías o incompletas: carrito vacío, "producto no encontrado", sin resultados y dashboard.

## 3. Alcance permitido

- **Puede modificar:** todo el CSS, el marcado HTML (estructura y clases) y los parciales de `components/`.
- **JS: solo si es imprescindible** y con cambios mínimos. Cada cambio de JS debe quedar listado en un apartado propio de la entrega.
- **No puede:** introducir frameworks, preprocesadores, bundlers, backend, ni dependencias nuevas sin justificarlo. Tampoco cambiar `data.js`, ni la lógica de negocio del carrito o de las validaciones.

## 4. Elementos a MANTENER (contrato inviolable)

### 4.1 Contrato DOM con JavaScript

Estos IDs, atributos `data-*` y clases de estado son leídos o escritos por los scripts. Pueden cambiar de aspecto, de etiqueta o de posición, pero **no de nombre ni de existencia**. La tabla completa está en `interacciones.md`, sección 5.

- **Parciales:** `#header-container`, `#footer-container` y `#info-box-container`.
- **Header:** `#categorias-toggle` (con `aria-expanded` y `aria-controls`), `#categorias-panel` (usa el atributo `hidden`), `.cart-count` y `.close-btn`.
- **Carrito:**
  - `#btn-carrito`, `#contador-carrito`, `#panel-carrito`, `#btn-cerrar-carrito`, `#items-carrito`, `#total-carrito`, `#btn-ir-pagar` y `#overlay-carrito`.
  - Clases de estado `.abierto` (panel) y `.activo` (overlay).
  - Dentro de cada ítem: `button[data-accion="mas|menos|eliminar"][data-id]`.
  - Clases del ítem generado: `.item-carrito`, `__info`, `__nombre`, `__precio`, `__cantidad` y `.btn-eliminar`. El diseño puede estilizarlas, pero el HTML interno lo genera `carrito.js`.
- **Catálogo:**
  - `#grid-productos`, `#sin-resultados`, `#filtro-categorias`, `.filtro-categoria`, `#precio-min`, `#precio-max` y `#btn-limpiar-filtros`.
  - `.btn-agregar[data-id]` y la clase `.agregado`.
  - Clases generadas: `.tarjeta-producto`, `__link`, `__img`, `__info`, `__nombre`, `__precio` y `__pie`.
- **Detalle:** `#detalle-producto`, `#imagen-principal`, `#miniaturas`, `.galeria__miniatura` (con `.activa` y `data-indice`), `#cantidad`, `#btn-menos`, `#btn-mas`, `#subtotal`, `#btn-agregar`, `#precio-unitario`, `#relacionados` (usa `hidden`) y `#carrusel-relacionados`.
- **Formularios:**
  - `#form-login`, `#email`, `#password`, `#form-contacto`, `#nombre`, `#correo` y `#contenido`.
  - `#contador-contenido` (con `.excedido`), `#mensaje-form` (usa `hidden`) y un `span#error-<id del input>` por cada campo validado.
  - La clase `.invalido`.
- **Admin:** `#sidebar[data-activo]`, `#buscar`, `#contador`, `#sin-resultados`, `#tabla-usuarios` (y el equivalente de productos), `[data-eliminar]` y `#btn-menu-buscar`.
- **Carrusel del home:** `.products-scroll` y `.product-card`.

### 4.2 Comportamiento y datos

- El **orden de carga de scripts** y los nombres de archivos `css/*.css` y `js/*.js` (las páginas los enlazan por nombre).
- El **atributo `hidden`** como mecanismo de mostrar y ocultar (`#categorias-panel`, `#sin-resultados`, `#relacionados`, `#mensaje-form`). Si se usa `display` en esas clases, se debe respetar `[hidden]`.
- Los **parámetros de URL**: `productos.html?categoria=`, `detalleProductos.html?id=` y los enlaces del header a esas URLs.
- El **límite de 10 unidades** por producto y los textos de feedback ("✓ Añadido", "Máx. 10 unidades") producidos por JS: el espacio visual debe aguantarlos.
- Las **rutas relativas** sin `../` (todas las páginas están en la raíz) y la imagen de respaldo `IMG_PLACEHOLDER` mediante `onerror`.
- Las categorías: Rostro, Ojos, Labios, Uñas, Cuidado de la piel y Accesorios.

### 4.3 Accesibilidad existente

Se conservan todos los `aria-*` (`expanded`, `controls`, `live`, `invalid`, `current`, `hidden`, `label`), los `label[for]`, los `alt`, `lang="es"` y el `meta viewport`.

### 4.4 Identidad

- Se mantiene la **familia cromática violeta/lavanda** como base. Los acentos rosa, melocotón y celeste pueden reasignarse.
- Se mantiene la **estructura de navegación**: Inicio, Productos, Blogs, Nosotros, Contacto, Categorías, Ingresar, Registrarse y carrito.
- Se mantiene la **separación entre sitio público y admin**: el admin puede tener una apariencia densa y funcional, pero debe compartir los tokens de marca.

## 5. Elementos a MODIFICAR

Prioridades que el diseño debe resolver. Los códigos remiten a `deuda-tecnica.md`.

| Prio | Elemento | Qué se espera |
|---|---|---|
| Alta | Tokens y CSS (C1, C2, C4, C5, C11) | Un único archivo de tokens (por ejemplo `css/tokens.css`) compartido por el sitio y el admin, con color, tipografía, espaciado, radios, sombras y z-index. Eliminar las reglas duplicadas y los bloques "AGREGADOS" y "NORMALIZACIÓN". Reemplazar los colores hardcodeados por tokens |
| Alta | Botones (C2, C3) | Un solo sistema de botones (primario, secundario, peligro, tamaños, estados `:hover`, `:focus-visible`, `:disabled`) para público y admin. Mantener `.btn-agregar`, `.btn-principal`, etc. como alias o clases adicionales mientras las use el JS |
| Alta | Responsive (C7) | Mobile-first con breakpoints reales (por ejemplo 480, 768, 1024 y 1280). Menú hamburguesa o equivalente en el header, usando el mismo `#categorias-toggle`/`#categorias-panel` o un control nuevo que no dependa de JS. Layouts probados desde 320px. `.recuadro`, `.register-box` y las tablas del admin deben adaptarse |
| Alta | Carrito (A1) | Diseño del panel como diálogo lateral. Se puede añadir `role="dialog"` y `aria-modal` en el HTML. Gestión de foco y `Escape` solo con un cambio mínimo de JS, declarado |
| Alta | Info-box (A2) | Modal con overlay, un `<button class="close-btn">` y `role="dialog"`. Debe seguir cerrándose con `.close-btn` |
| Media | Tipografía (C6) | Elegir y cargar las fuentes (`@font-face` local o enlace de Google Fonts documentado). Eliminar la referencia a `'Princess'` si no se usa. Definir una escala tipográfica |
| Media | Accesibilidad (A3-A6, A9) | Skip-link, foco visible consistente, contraste ≥ 4.5:1 en el texto, `aria-label` en los inputs de precio y `prefers-reduced-motion` global |
| Media | Iconografía (A7, A8) | Sustituir los emojis 🛒 y 🗑 por SVG inline (como ya se hace en el admin). Valorar si se mantiene Font Awesome |
| Media | Tarjetas de producto | Diseño unificado entre `.product-card` (home), `.tarjeta-producto` (catálogo) y `.tarjeta-relacionada` (detalle). Manejar bien la imagen ausente |
| Media | Home (F7) | Hero y carrusel con mejor diseño. El carrusel puede tener scroll táctil nativo (`scroll-snap`) y debe seguir existiendo `.products-scroll` |
| Media | Formularios | Estilo común para login, registro y contacto: campos, errores (`.error-msg`), éxito (`#mensaje-form`) y contador. El registro debe tener el mismo patrón de campo |
| Media | Admin | Tokens de marca compartidos, tabla responsive (por ejemplo tarjetas en móvil), estados vacíos y diseño del dashboard (`#area-central`) |
| Baja | Nomenclatura (C8) | Pasar las clases nuevas a BEM en español. No renombrar las clases del contrato del apartado 4.1 |
| Baja | Páginas ausentes (F1, F2) | Si se diseñan `checkout.html`, `usuarioForm.html` y `productoForm.html`, usar la misma estructura que el resto. La lógica queda fuera del alcance |

## 6. Restricciones

### Técnicas
- Sin frameworks ni librerías CSS (Bootstrap, Tailwind, etc.), sin preprocesadores y sin paso de build.
- CSS plano con variables CSS. Se pueden usar características modernas (`grid`, `clamp()`, `:focus-visible`, `aspect-ratio`) ya presentes en el proyecto.
- Debe funcionar sin cambios en un servidor estático. Las rutas siguen siendo relativas.
- Sin dependencias externas nuevas salvo las fuentes, y deben quedar documentadas. Si hay que elegir, preferir recursos locales.
- No debe depender de imágenes que no existan: toda imagen necesita un `alt` y un respaldo visual.
- Compatibilidad con navegadores modernos (últimas 2 versiones de Chrome, Firefox, Safari y Edge).

### De proceso
- No tocar `js/data.js` ni la lógica de `carrito.js` y `validaciones.js`.
- Cualquier cambio de JS debe ser mínimo y quedar listado con archivo, línea y motivo.
- No eliminar clases que el JS genera o consulta (apartado 4.1).
- No cambiar los nombres de archivos ni las URLs de las páginas.
- Mantener `lang="es"`, `meta viewport` y la semántica (`header`, `nav`, `main`, `aside`, `footer`, `h1` único por página).
- Los textos visibles se mantienen en español.

### De calidad
- Contraste mínimo: 4.5:1 en texto normal y 3:1 en texto grande y componentes de interfaz.
- El área táctil de los controles debe ser de al menos 44×44px.
- La navegación completa por teclado debe funcionar, con el foco siempre visible.
- Respetar `prefers-reduced-motion`.
- Sin desbordamiento horizontal desde 320px de ancho.

## 7. Entregables esperados del modelo de diseño

1. CSS refactorizado, con `tokens.css` y los módulos existentes limpios.
2. HTML ajustado (clases, estructura y parciales) que respete el apartado 4.
3. Lista de cambios de JS, vacía si no hubo.
4. Lista de las clases o IDs nuevos y de los eliminados, con su motivo.
5. Resumen de los tokens definidos (colores con su razón de contraste, escala tipográfica y espaciado).
6. Capturas o descripción del resultado en 320, 768 y 1280px, para el sitio público y el admin.
7. Actualización de `docs/interfaces.md` con los componentes resultantes.

## 8. Checklist de verificación

- [ ] El carrito se abre y se cierra, y los contadores del header y del botón flotante coinciden.
- [ ] Se puede añadir desde el catálogo y desde el detalle, y la cantidad se limita a 10.
- [ ] Los filtros de categoría y precio funcionan, y `?categoria=Labios` preselecciona la categoría.
- [ ] El menú de categorías se abre y se cierra con clic, clic fuera y `Escape`.
- [ ] Los formularios muestran errores bajo cada campo y enfocan el primero con error.
- [ ] El panel admin busca, elimina con confirmación y muestra el estado activo en el sidebar.
- [ ] Ninguna página tiene desbordamiento horizontal a 320px.
- [ ] Todo se puede usar con teclado, con el foco visible.
- [ ] No hay errores en la consola del navegador, salvo las imágenes inexistentes si `img/` sigue vacío.
