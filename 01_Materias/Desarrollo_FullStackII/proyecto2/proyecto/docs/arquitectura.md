# Arquitectura frontend: KatEye (v2 - con Bootstrap)

Tienda de cosméticos con un sitio público y un panel de administración. Es un **sitio estático** que utiliza el framework **Bootstrap 5** para su layout y componentes.

- No hay backend, `package.json` ni build.
- La lógica de negocio (catálogo, carrito, validaciones) sigue en JavaScript vanilla.
- Los datos viven en `js/data.js` (catálogo), `localStorage` (carrito) y en arrays dentro de los HTML del admin.
- Debe servirse por **HTTP** para que `fetch` pueda cargar los parciales de `components/`.

## 1. Estructura de directorios

```
proyecto/
├── index.html, productos.html, ... (13 páginas)
├── components/   header.html, footer.html, info-box.html
├── css/
│   ├── design-tokens.css   (Colores, tipografía y overrides de Bootstrap)
│   ├── main.css            (Estilos residuales para blogs/nosotros)
│   ├── admin.css           (Estilos del panel de administración)
│   └── ...                 (Archivos de componentes vaciados)
├── js/             (Lógica de la aplicación sin cambios mayores)
├── img/            (solo .gitkeep)
└── docs/           (Documentación del proyecto)
```

## 2. Mapa del sitio y dependencias CSS

Todas las páginas ahora cargan una base común de estilos en el siguiente orden:
1.  **Bootstrap 5.3 CSS** (CDN)
2.  `css/design-tokens.css` (Nuestra personalización)
3.  `css/main.css` o `css/admin.css` (Estilos específicos de página)

**JS:** El orden de carga de scripts no ha cambiado, pero ahora todas las páginas cargan **Bootstrap 5.3 JS Bundle** (CDN) antes que los scripts de la aplicación.

## 3. Plantilla de página

El ensamblado en el cliente a través de `loadComponents.js` se mantiene. Sin embargo, los componentes internos han sido refactorizados:

-   **Header:** Ahora es un `navbar` de Bootstrap, responsivo y con menú desplegable.
-   **Carrito:** Es un `offcanvas` de Bootstrap, controlado por JS en `carrito.js`.
-   **Info-Box:** Es un `modal` de Bootstrap, inicializado desde `loadComponents.js`.
-   **Tarjetas y Formularios:** Usan los componentes `card`, `form-control`, etc., de Bootstrap.

## 4. CSS

La arquitectura de CSS ha cambiado significativamente:

-   **`css/design-tokens.css`:** Es el corazón de la nueva identidad visual. Define:
    -   Paleta de colores (`--sage-green`, `--dusty-rose`, etc.).
    -   Familias tipográficas (`--font-family-serif`, `--font-family-sans-serif`).
    -   **Overrides de variables de Bootstrap** (`--bs-primary`, `--bs-body-bg`, etc.) para que el framework use nuestros colores y fuentes por defecto.
-   **Archivos obsoletos eliminados:** `productos.css`, `carrito.css`, `detalleProductos.css`, `contacto.css` y `home.css` fueron eliminados. Sus estilos y componentes son gestionados de forma centralizada por Bootstrap y `design-tokens.css`.
-   **`main.css`:** Contiene estilos complementarios para las secciones de Blogs y Nosotros.
-   **`admin.css`:** Estilos para el sidebar y mantenedores del panel de administración, unificados con las variables de `design-tokens.css`.

## 5. JavaScript

La lógica principal no ha cambiado, pero se han realizado ajustes para interactuar con los nuevos componentes de Bootstrap:

-   `js/loadComponents.js`: Ya no gestiona el menú del header (lo hace Bootstrap). Ahora inicializa el modal de `info-box`.
-   `js/carrito.js`: Ya no controla un panel personalizado. Ahora maneja el `offcanvas` de Bootstrap.
-   `js/validaciones.js`: Adaptado para usar las clases de validación de formularios de Bootstrap (`is-invalid`). Se añadió lógica para el formulario de registro.
-   `js/producto.js` y `js/detalleProductos.js`: Actualizados para renderizar el nuevo marcado de las `card` de Bootstrap.

## 6. Dependencias externas

| Recurso | Uso |
|---|---|
| **Bootstrap 5.3** (CDN) | Framework principal para layout, componentes y estilos base. |
| **Bootstrap Icons** (CDN) | Iconografía principal del sitio (ej. icono del carrito). |
| **Google Fonts** (CDN) | Carga las tipografías **Playfair Display** (títulos) y **Montserrat** (cuerpo). |

Font Awesome ha sido eliminado y reemplazado por Bootstrap Icons.
