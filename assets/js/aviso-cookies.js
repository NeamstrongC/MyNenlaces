/* ==========================================================================
   SERVIDOR N - SCRIPT UNIFICADO (PRELOADER, COOKIES COMPARTIDAS)
   ========================================================================== */

// --- 1. CONTROL DEL BANNER DE CARGA (PRELOADER) ---

function quitarPreloader() {
    const preloader = document.getElementById('preloader');
    const body = document.body;

    // Evitamos ejecutar si el preloader ya se está ocultando o no existe
    if (preloader && !preloader.classList.contains('fade-out')) {
        // Agrega la clase de CSS para hacer el desvanecimiento
        preloader.classList.add('fade-out');
        
        // Habilita el scroll en el body quitando la clase de carga
        if (body) {
            body.classList.remove('loading-active');
        }
        
        // Oculta por completo el contenedor después de la animación CSS (600ms)
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 600);
    }
}

// Controladores para apagar el preloader de forma segura
window.addEventListener('load', quitarPreloader);
window.addEventListener('pageshow', quitarPreloader); // Corrige el comportamiento al regresar con el botón "Atrás"

// Respaldo de seguridad incondicional a los 3 segundos
setTimeout(quitarPreloader, 3000);


// --- 2. CONTROL DEL AVISO DE COOKIES & INTEGRACIÓN CON GOOGLE TAG MANAGER ---

document.addEventListener('DOMContentLoaded', () => {
    // 1. Captura segura de elementos del DOM
    const botonAceptarCookies = document.getElementById('btn-aceptar-cookies');
    const avisoCookies = document.getElementById('aviso-cookies');
    const fondoAvisoCookies = document.getElementById('fondo-aviso-cookies');

    // 2. Inicialización segura del dataLayer
    window.dataLayer = window.dataLayer || [];

    // Función auxiliar para leer cookies por su nombre
    function obtenerCookie(nombre) {
        const coincidencia = document.cookie.match(new RegExp('(^| )' + nombre + '=([^;]+)'));
        return coincidencia ? coincidencia[2] : null;
    }

    // 3. Verificación de estado mediante cookie global compartida
    if (!obtenerCookie('cookies-aceptadas-global')) {
        // Si no han sido aceptadas ni aquí ni en la principal, mostramos el aviso
        if (avisoCookies && fondoAvisoCookies) {
            avisoCookies.classList.add("activo");
            fondoAvisoCookies.classList.add("activo");
        }
    } else {
        // Si ya existían en el dominio, disparamos el evento inmediatamente para Tag Manager
        window.dataLayer.push({ "event": "aceptadas-cookies" });
    }

    // 4. Escuchador de eventos para el botón de Aceptar
    if (botonAceptarCookies) {
        botonAceptarCookies.addEventListener("click", () => {
            // Ocultamos los componentes quitando la clase activo (activa transición CSS)
            if (avisoCookies && fondoAvisoCookies) {
                avisoCookies.classList.remove("activo");
                fondoAvisoCookies.classList.remove("activo");
            }

            // Calculamos la expiración para 365 días
            const fechaExpiracion = new Date();
            fechaExpiracion.setTime(fechaExpiracion.getTime() + (365 * 24 * 60 * 60 * 1000));

            // Guardamos la cookie globalmente en la raíz del dominio (vital para enlazar con la otra web)
            document.cookie = "cookies-aceptadas-global=true; expires=" + fechaExpiracion.toUTCString() + "; path=/; SameSite=Lax";

            // Enviamos el evento a GTM para activar el rastreo
            window.dataLayer.push({ "event": "aceptadas-cookies" });
        });
    }
});
