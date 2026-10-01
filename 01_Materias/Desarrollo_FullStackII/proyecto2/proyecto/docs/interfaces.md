# Interfaces: Pantallas y Componentes (v2 - con Bootstrap)

Catálogo de los componentes principales de la interfaz, basado en el framework **Bootstrap 5**.

## 1. Tokens de Diseño (`css/design-tokens.css`)

La identidad visual se centraliza en este archivo, que personaliza Bootstrap.

### Paleta de Colores

| Token | Valor | Rol | Variable de Bootstrap | 
|---|---|---|---|
| `--sage-green` | `#8A9A5B` | Primario (botones, enlaces, acentos) | `--bs-primary` |
| `--dusty-rose` | `#C08081` | Secundario (botones, acentos) | `--bs-secondary` |
| `--dark-charcoal` | `#36454F` | Texto principal | `--bs-body-color` |
| `--off-white` | `#F8F6F4` | Fondo de página | `--bs-body-bg` |
| `--soft-gold` | `#B8860B` | Acentos y precios (no es variable BS) | N/A |
| `--terracotta` | `#B97C5B` | Decorativo (no es variable BS) | N/A |

### Tipografía

- **Títulos:** `Playfair Display`, serif (cargada de Google Fonts).
- **Cuerpo:** `Montserrat`, sans-serif (cargada de Google Fonts).
- **Variable Bootstrap:** `--bs-font-sans-serif` está asignada a `Montserrat`.

## 2. Componentes Globales

Estos componentes se cargan en la mayoría de las páginas.

### Header (`components/header.html`)

- **Componente:** `navbar` de Bootstrap (`navbar-expand-lg`).
- **Estructura:**
    - `a.navbar-brand`: Logo/Nombre "KatEye".
    - `button.navbar-toggler`: Menú hamburguesa en móviles.
    - `div.collapse.navbar-collapse`: Contenedor de enlaces que se colapsa.
    - `ul.navbar-nav`: Lista de enlaces (Inicio, Productos, etc.).
    - **Categorías:** Implementado como un `li.nav-item.dropdown`.
    - **Acciones de usuario:** Botones `btn-outline-primary` (Ingresar) y `btn-primary` (Registrarse), más un botón para el carrito con un `badge` para el contador (`.cart-count`).
- **Responsive:** Totalmente responsivo gracias a Bootstrap.

### Footer (`components/footer.html`)

- No ha sido refactorizado. Sigue usando estilos de `main.css` y `<i>` de Font Awesome que ya no se carga. **(Deuda técnica)**.

### Modal de Novedades (`components/info-box.html`)

- **Componente:** `modal` de Bootstrap (`modal-dialog-centered`).
- **Comportamiento:** Se muestra automáticamente unos segundos después de cargar `index.html`. Controlado por JS en `loadComponents.js`.
- **Accesibilidad:** Cumple con los estándares de un diálogo modal gracias a Bootstrap (foco, `role="dialog"`, cierre con `Escape`).

### Carrito de Compras

- **Componente:** `offcanvas` de Bootstrap (`offcanvas-end`).
- **Disparador:** Un botón flotante circular (`position-fixed`) con el icono del carrito y un `badge` (`#contador-carrito`).
- **Estructura Interna:**
    - `.offcanvas-header`: Título y botón de cierre.
    - `.offcanvas-body`: Contenedor `#items-carrito` donde se renderizan los productos.
    - `div.offcanvas-footer`: Muestra el total (`#total-carrito`) y el botón de "Ir a pagar".
- **JS:** Controlado por `carrito.js`, que ahora usa el API de Bootstrap para mostrar/ocultar el panel y renderiza los ítems con clases de Bootstrap (`d-flex`, `img-fluid`, etc.).

## 3. Componentes de Contenido

### Tarjeta de Producto (`card`)

Usada en `index.html` y generada dinámicamente en `productos.html`.

- **Componente:** `card` de Bootstrap con `card-img-top`, `card-body`, `card-title`, etc.
- **Estructura:
    - `a > img.card-img-top`: Imagen del producto que enlaza al detalle.
    - `div.card-body`: Nombre (`h5.card-title`) y precio (`p.h4.text-primary`).
    - `div.card-footer`: Contiene el botón "Añadir al carrito".
- **Estilo:** `h-100` para igualar alturas y `shadow-sm` para una sombra sutil.

### Formularios

Todos los formularios (`contacto`, `iniciarSesion`, `registro`) han sido refactorizados con el sistema de formularios de Bootstrap.

- **Estructura:**
    - Cada campo está envuelto en un `div.mb-3`.
    - Los `input` y `textarea` usan la clase `form-control`.
    - Los `select` usan `form-select`.
    - Se usan `label` con el atributo `for`.
- **Validación:**
    - La clase `is-invalid` de Bootstrap se aplica al campo con error.
    - Los mensajes de error se muestran en un `div.invalid-feedback`.
    - El script `js/validaciones.js` fue adaptado para usar este sistema.

## 4. Panel de Administración

- **Reskin ligero:** Se han aplicado los nuevos tokens de diseño (colores y fuentes) a través de `css/admin.css` para dar coherencia de marca.
- **Componentes Bootstrap:** Se han introducido clases de Bootstrap para mejorar elementos específicos sin romper el layout:
    - **Tablas:** Usan `table`, `table-hover` y `align-middle`.
    - **Botones:** Los botones de "Agregar" y las acciones de "Editar/Eliminar" usan `btn`, `btn-primary`, `btn-outline-secondary`, `btn-outline-danger` y `btn-group`.
    - **Buscador:** El campo de búsqueda ahora tiene la clase `form-control`.
- **Layout Principal:** El layout de grid con el `sidebar` se ha mantenido intacto, ya que es una estructura muy específica de la aplicación.
