/* js/validaciones.js — validaciones de los formularios de Inicio de sesión y Contacto.
   Se muestran mensajes bajo cada campo (blur / input / submit). */

const DOMINIOS_PERMITIDOS = ["duoc.cl", "profesor.duoc.cl", "gmail.com"];
const LIMITES = {
    correoMax: 100,
    passMin: 4,
    passMax: 10,
    nombreMax: 100,
    comentarioMax: 500
};

/* ---------- Reglas (devuelven "" si es válido, o el mensaje de error) ---------- */
function validarCorreo(valor, requerido = true) {
    const v = valor.trim();
    if (v === "") return requerido ? "El correo es obligatorio." : "";
    if (v.length > LIMITES.correoMax) {
        return `El correo no puede superar los ${LIMITES.correoMax} caracteres.`;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) {
        return "Ingresa un correo válido (ej: nombre@gmail.com).";
    }
    const dominio = v.split("@")[1].toLowerCase();
    if (!DOMINIOS_PERMITIDOS.includes(dominio)) {
        return "Solo se permiten correos @duoc.cl, @profesor.duoc.cl o @gmail.com.";
    }
    return "";
}

function validarPassword(valor) {
    if (valor === "") return "La contraseña es obligatoria.";
    if (valor.length < LIMITES.passMin || valor.length > LIMITES.passMax) {
        return `La contraseña debe tener entre ${LIMITES.passMin} y ${LIMITES.passMax} caracteres.`;
    }
    return "";
}

function validarTextoRequerido(valor, max, sujeto) {
    const v = valor.trim();
    if (v === "") return `${sujeto} es obligatorio.`;
    if (v.length > max) return `${sujeto} no puede superar los ${max} caracteres.`;
    return "";
}

/* ---------- Utilidades de interfaz ---------- */
function mostrarError(input, mensaje) {
    const feedback = document.getElementById("error-" + input.id);
    if (feedback) {
        feedback.textContent = mensaje;
    }
    input.classList.toggle("is-invalid", mensaje !== "");
    input.setAttribute("aria-invalid", String(mensaje !== ""));
}

function mostrarMensajeForm(texto) {
    const p = document.getElementById("mensaje-form");
    if (!p) return;
    p.textContent = texto;
    p.hidden = texto === "";
}

/* campos = [{ input, validar: valor => mensajeDeError }] */
function configurarFormulario(form, campos, alExito) {
        campos.forEach(({ input, validar }) => {
            input.addEventListener("blur", () => mostrarError(input, validar(input.value)));
            input.addEventListener("input", () => {
                if (input.classList.contains("is-invalid")) mostrarError(input, validar(input.value));
            });
        });

    form.addEventListener("submit", e => {
        e.preventDefault();
        mostrarMensajeForm("");
        let primerError = null;

        campos.forEach(({ input, validar }) => {
            const msg = validar(input.value);
            mostrarError(input, msg);
            if (msg && !primerError) primerError = input;
        });

        if (primerError) {
            primerError.focus();
            return;
        }
        alExito(form);
    });
}

/* ---------- Inicialización por página ---------- */
document.addEventListener("DOMContentLoaded", () => {
    // Inicio de sesión
    const formLogin = document.getElementById("form-login");
    if (formLogin) {
        configurarFormulario(formLogin, [
            { input: document.getElementById("email"), validar: v => validarCorreo(v, true) },
            { input: document.getElementById("password"), validar: validarPassword }
        ], () => {
            mostrarMensajeForm("Datos válidos. (Aún no hay servidor: no se inicia sesión realmente.)");
        });
    }

    // Contacto
    const formContacto = document.getElementById("form-contacto");
    if (formContacto) {
        const comentario = document.getElementById("contenido");
        const contador = document.getElementById("contador-contenido");

        // El correo de contacto NO es obligatorio en el enunciado; cambia a true si lo quieres obligatorio
        configurarFormulario(formContacto, [
            { input: document.getElementById("nombre"),
              validar: v => validarTextoRequerido(v, LIMITES.nombreMax, "El nombre") },
            { input: document.getElementById("correo"), validar: v => validarCorreo(v, false) },
            { input: comentario,
              validar: v => validarTextoRequerido(v, LIMITES.comentarioMax, "El comentario") }
        ], form => {
            mostrarMensajeForm("Tu mensaje fue validado correctamente.");
            form.reset();
            contador.textContent = `0/${LIMITES.comentarioMax}`;
            contador.classList.remove("text-danger");
        });

        comentario.addEventListener("input", () => {
            const n = comentario.value.length;
            contador.textContent = `${n}/${LIMITES.comentarioMax}`;
            contador.classList.toggle("text-danger", n > LIMITES.comentarioMax);
        });
    }

    // Registro
    const formRegistro = document.getElementById("form-registro");
    if(formRegistro) {
        const passwordInput = document.getElementById("password");
        const confirmPasswordInput = document.getElementById("confirmPassword");

        function validarConfirmPassword(valor) {
            if (valor !== passwordInput.value) return "Las contraseñas no coinciden.";
            return "";
        }

        configurarFormulario(formRegistro, [
             { input: document.getElementById("nombreCompleto"),
              validar: v => validarTextoRequerido(v, LIMITES.nombreMax, "El nombre completo") },
            { input: document.getElementById("correo"), validar: v => validarCorreo(v, true) },
            { input: passwordInput, validar: validarPassword },
            { input: confirmPasswordInput, validar: validarConfirmPassword },
            { input: document.getElementById("region"), validar: v => v ? "" : "Debes seleccionar una región." },
            { input: document.getElementById("comuna"), validar: v => v ? "" : "Debes seleccionar una comuna." }
        ], form => {
            mostrarMensajeForm("¡Registro completado con éxito! (Esto es una simulación)");
            form.reset();
        });
    }
});
