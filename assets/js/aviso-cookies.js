/* ==========================================================================
   CONTROL DEL AVISO DE COOKIES & INTEGRACIÓN CON GOOGLE TAG MANAGER
   ========================================================================== */

// 1. Captura de elementos del DOM (Corregido el espacio en blanco)
const botonAceptarCookies = document.getElementById('btn-aceptar-cookies');
const avisoCookies = document.getElementById('aviso-cookies');
const fondoAvisoCookies = document.getElementById('fondo-aviso-cookies');

// 2. Inicialización segura del dataLayer (Evita que el sitio crashee si GTM tarda en cargar)
window.dataLayer = window.dataLayer || [];

// 3. Verificación de estado en el LocalStorage
if (!localStorage.getItem('cookies-aceptadas')) {
    // Si no han sido aceptadas, mostramos el aviso y el fondo difuminado
    avisoCookies.classList.add("activo");
    fondoAvisoCookies.classList.add("activo");
} else {
    // Si ya existían, disparamos el evento inmediatamente para Tag Manager
    window.dataLayer.push({ "event": "aceptadas-cookies" });
}

// 4. Escuchador de eventos para el botón de Aceptar
botonAceptarCookies.addEventListener("click", () => {
    // Ocultamos los componentes quitando la clase activo
    avisoCookies.classList.remove("activo");
    fondoAvisoCookies.classList.remove("activo");

    // Guardamos la elección del usuario de forma permanente
    localStorage.setItem("cookies-aceptadas", "true");

    // Enviamos el evento a GTM para activar las etiquetas de rastreo (Analytics, Pixels, etc.)
    window.dataLayer.push({ "event": "aceptadas-cookies" });
});
