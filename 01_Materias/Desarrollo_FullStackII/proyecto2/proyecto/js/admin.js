/* ==========================================================
   js/admin.js — menú lateral compartido del panel de administración
   Uso: <aside id="sidebar" data-activo="home|usuarios|productos"></aside>
   (se inyecta con JS para no depender de fetch ni de rutas relativas)
   ========================================================== */
const ICONOS = {
  home: '<path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/>',
  usuarios: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c0-3.6 3-6 6.5-6s6.5 2.4 6.5 6"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7"/><path d="M18 14.3c2 .7 3.5 2.6 3.5 5.7"/>',
  productos: '<path d="M21 8l-9-5-9 5v8l9 5 9-5z"/><path d="M3 8l9 5 9-5"/><path d="M12 13v8"/>',
  settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>',
  help: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.7.4-1 .9-1 1.7"/><path d="M12 17h.01"/>'
};

function icono(nombre) {
  return `<svg class="icono" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONOS[nombre]}</svg>`;
}

function renderSidebar() {
  const sidebar = document.getElementById("sidebar");
  if (!sidebar) return;
  const activo = sidebar.dataset.activo;

  const enlace = (clave, href, texto) => `
    <a class="menu-item ${activo === clave ? "activo" : ""}" href="${href}"
       ${activo === clave ? 'aria-current="page"' : ""}>${icono(clave)}<span>${texto}</span></a>`;

  sidebar.innerHTML = `
    <a class="sidebar__marca" href="home.html">KatEye<small>Administración</small></a>

    <nav class="menu menu--principal nav flex-column" aria-label="Secciones">
      ${enlace("home", "home.html", "Panel principal")}
      ${enlace("usuarios", "usuario.html", "Usuarios")}
      ${enlace("productos", "producto.html", "Productos")}
    </nav>

    <div class="menu menu--inferior">
      <a class="menu-item" href="#" title="Configuración">${icono("settings")}<span>Settings</span></a>
      <button class="menu-item" type="button" id="btn-menu-buscar" title="Buscar">${icono("search")}<span>Search</span></button>
      <a class="menu-item" href="#" title="Ayuda">${icono("help")}<span>Help</span></a>
    </div>

    <a class="perfil" href="#" title="Mi perfil">
      <span class="perfil__avatar" aria-hidden="true">A</span>
      <span class="perfil__datos">
        <span class="perfil__nombre">Administrador</span><br>
        <span class="perfil__rol">Profile</span>
      </span>
    </a>
  `;

  // "Search" lleva el foco al buscador de la página, si existe
  document.getElementById("btn-menu-buscar").addEventListener("click", () => {
    const buscador = document.getElementById("buscar");
    if (buscador) buscador.focus();
  });
}

document.addEventListener("DOMContentLoaded", renderSidebar);

/* Evita inyectar HTML al pintar datos en las tablas */
function escapar(texto) {
  const d = document.createElement("div");
  d.textContent = texto;
  return d.innerHTML;
}
