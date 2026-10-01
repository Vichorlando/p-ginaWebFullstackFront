# Deuda técnica

Prioridad: **P1** rompe funcionalidad o accesibilidad grave, **P2** afecta mantenimiento o calidad visible, **P3** limpieza.
Columna "Rol": **D** = puede resolverlo el modelo de diseño (CSS/HTML), **J** = requiere JS, **C** = requiere contenido o decisión del equipo.

## Funcionalidad

| # | Prio | Rol | Problema | Ubicación |
|---|---|---|---|---|
| F1 | P1 | C | `checkout.html` no existe; "Ir a pagar" lleva a un 404 | `js/carrito.js:168` |
| F2 | P1 | C | `usuarioForm.html` y `productoForm.html` no existen (Agregar y Editar) | `usuario.html:23,91`, `producto.html:23,101` |
| F3 | P1 | J | `registroUsuario.html` no tiene JS: el `select#comuna` queda vacío y no hay validación | `registroUsuario.html` |
| F4 | P2 | J | Eliminar en el admin no persiste | JS inline del admin |
| F5 | P2 | C | `img/` está vacío: todas las imágenes caen en el placeholder o están rotas | `img/` |
| F6 | P2 | J | El icono del carrito en el header apunta a `productos.html` y no abre el panel | `components/header.html:39` |
| F7 | P3 | C | `index.html` usa tarjetas estáticas con datos placeholder y no el catálogo | `index.html:24-60` |
| F8 | P3 | C | `nosotros.html` tiene nombres placeholder | `nosotros.html` |
| F9 | P3 | J | `productScroll.js` tiene código muerto (`isScrolling`, `cards`) y usa `clientX` en touch | `js/productScroll.js` |

## Arquitectura JS

| # | Prio | Rol | Problema |
|---|---|---|---|
| J1 | P2 | J | `producto.html` redeclara `PRODUCTOS` e `IMG_PLACEHOLDER` inline con otro esquema (`imagen`, joyería). No choca hoy porque no carga `data.js`, pero es una trampa si se carga |
| J2 | P2 | J | JS inline duplicado en `usuario.html` y `producto.html` |
| J3 | P2 | J | Todo es global, sin módulos ES; el orden de los scripts es frágil |
| J4 | P2 | J | `innerHTML` sin escapar en el sitio público (`carrito.js`, `producto.js`, `detalleProductos.js`). Es seguro solo mientras los datos sean de confianza |
| J5 | P3 | J | Categorías del header escritas a mano y las del filtro derivadas de `PRODUCTOS`: pueden desincronizarse |
| J6 | P3 | J | El HTML del carrito está duplicado en dos páginas y no es un parcial |
| J7 | P3 | J | Se usa `alert()` y `confirm()` para avisos |

## CSS

| # | Prio | Rol | Problema |
|---|---|---|---|
| C1 | P2 | D | `main.css` creció por capas con bloques "AGREGADOS" y "NORMALIZACIÓN" que sobrescriben reglas previas |
| C2 | P2 | D | Reglas duplicadas: `.btn-register` (3 veces), `.register-box h2` (2), `.form-group input` (2) |
| C3 | P2 | D | `.btn-agregar` está definido dos veces con estilos distintos (`productos.css` y `detalleProductos.css`) |
| C4 | P2 | D | Dos sistemas de tokens (`main.css` y `admin.css`) con el nombre `--violeta` en conflicto y valores distintos |
| C5 | P2 | D | Colores hardcodeados fuera de los tokens (ver `interfaces.md`) |
| C6 | P2 | D | La fuente `'Princess'` nunca se carga; se usa `serif` del sistema |
| C7 | P2 | D | Un solo breakpoint (800px); sin menú móvil. `.recuadro` y `.register-box` no tienen reglas responsive |
| C8 | P3 | D | Convención mixta: inglés sin BEM y español con BEM |
| C9 | P3 | D | Selectores acoplados a IDs (`#header-container > header`, `#footer-container > footer`) |
| C10 | P3 | D | Comentario obsoleto en `carrito.css:1` ("mover a css/carrito.css") |
| C11 | P3 | D | No hay escala de espaciado ni de tipografía |

## Accesibilidad

| # | Prio | Rol | Problema |
|---|---|---|---|
| A1 | P1 | D+J | El panel del carrito no es `role="dialog"`, no gestiona el foco ni responde a `Escape`. Hay que mantener los IDs y `.abierto` |
| A2 | P1 | D | El info-box no es `role="dialog"`, no tiene overlay y su cierre es un `<span>`. Cambiarlo a `<button>` exige mantener la clase `.close-btn` |
| A3 | P2 | D | No hay skip-link |
| A4 | P2 | D | Varios `outline:none` sustituidos por `box-shadow` (`main.css` ~299, `contacto.css`); revisar el contraste del foco |
| A5 | P2 | D | Contraste dudoso: `#98a2b3` sobre blanco, y títulos del home en `--secondary-color` (corregidos parcialmente en `main.css:464-467`) |
| A6 | P2 | D | Los inputs de precio del filtro no tienen `aria-label` propio |
| A7 | P3 | D | Los emojis 🛒 y 🗑 sirven de iconos y dependen de la fuente del sistema |
| A8 | P3 | D | Los iconos del footer dependen del CDN de Font Awesome |
| A9 | P3 | D | `prefers-reduced-motion` solo existe en `admin.css` |

## Estructura del proyecto

| # | Prio | Rol | Problema |
|---|---|---|---|
| E1 | P3 | C | No hay README ni `package.json`. Cómo ejecutarlo (servidor HTTP) no está documentado |
| E2 | P3 | C | La raíz del repo git es `/home/benja/Archivo.Personal`, no esta carpeta |
| E3 | P3 | D | `<head>` repetido en cada página |
| E4 | P3 | C | Naming de archivos inconsistente (`Blogs.html`, `Blog1.html` frente a `detalleProductos.html`) |
