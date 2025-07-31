let menuVisible = false;
let animacionesAplicadas = false;
let temaOscuro = false;
let scrollPosition = 0;

// Función mejorada que oculta o muestra el menu
function mostrarOcultarMenu(){
    const nav = document.getElementById("nav");
    if (!nav) {
        console.warn("Elemento nav no encontrado");
        return;
    }
    
    if(menuVisible){
        nav.classList.remove("responsive");
        menuVisible = false;
    } else {
        nav.classList.add("responsive");
        menuVisible = true;
    }
}

function seleccionar(){
    // Oculto el menu una vez que selecciono una opcion
    const nav = document.getElementById("nav");
    if (!nav) {
        console.warn("Elemento nav no encontrado");
        return;
    }
    
    nav.classList.remove("responsive");
    menuVisible = false;
}

// Función optimizada que aplica las animaciones de las habilidades
function efectoHabilidades(){
    // Evita ejecutar la animación múltiples veces
    if (animacionesAplicadas) return;
    
    const skills = document.getElementById("skills");
    if (!skills) {
        console.warn("Elemento skills no encontrado");
        return;
    }
    
    const distancia_skills = window.innerHeight - skills.getBoundingClientRect().top;
    
    if(distancia_skills >= 300){
        const habilidades = document.getElementsByClassName("progreso");
        
        if (habilidades.length === 0) {
            console.warn("No se encontraron elementos con clase 'progreso'");
            return;
        }
        
        // Array con las clases de habilidades
        const clasesHabilidades = [
            "javascript", "htmlcss", "photoshop", "wordpress", "drupal",
            "comunicacion", "trabajo", "creatividad", "dedicacion", "proyect"
        ];
        
        // Aplica las animaciones con un pequeño delay para efecto secuencial
        clasesHabilidades.forEach((clase, index) => {
            if (habilidades[index]) {
                setTimeout(() => {
                    habilidades[index].classList.add(clase);
                }, index * 100); // Delay de 100ms entre cada animación
            }
        });
        
        animacionesAplicadas = true;
    }
}

// Función de throttle para optimizar el scroll
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Función para smooth scroll mejorado
function scrollSuave(destino) {
    const elemento = document.querySelector(destino);
    if (elemento) {
        const offsetTop = elemento.offsetTop - 80; // Ajuste para header fijo
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

// Event listeners mejorados
document.addEventListener('DOMContentLoaded', function() {
    // Cargar preferencias guardadas
    const temaGuardado = localStorage.getItem('temaOscuro');
    if (temaGuardado === 'true') {
        toggleTema();
    }
    
    // Restaurar posición de scroll
    restaurarEstadoScroll();
    
    // Inicializar lazy loading
    lazyLoadImages();
    
    // Efectos de escritura para títulos principales
    const titulo = document.querySelector('.contenido-banner h1');
    if (titulo) {
        const textoOriginal = titulo.textContent;
        efectoEscritura(titulo, textoOriginal, 150);
    }
    
    // Optimiza el scroll con throttle (funciones combinadas)
    window.addEventListener('scroll', throttle(function() {
        efectoHabilidades();
        toggleBotonArriba();
        animacionesEntrada();
        mostrarProgresoLectura();
    }, 16));
    
    // Guardar estado de scroll antes de salir
    window.addEventListener('beforeunload', guardarEstadoScroll);
    
    // Agrega funcionalidad de smooth scroll a los enlaces de navegación
    const enlaces = document.querySelectorAll('nav a[href^="#"]');
    enlaces.forEach(enlace => {
        enlace.addEventListener('click', function(e) {
            e.preventDefault();
            const destino = this.getAttribute('href');
            scrollSuave(destino);
            seleccionar(); // Cierra el menú móvil si está abierto
        });
    });
    
    // Event listener para filtros de portfolio
    const filtros = document.querySelectorAll('.filtro-btn');
    filtros.forEach(filtro => {
        filtro.addEventListener('click', function() {
            const categoria = this.dataset.filtro;
            filtrarProyectos(categoria);
        });
    });
    
    // Event listener para formularios
    const formularios = document.querySelectorAll('form');
    formularios.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            if (validarFormulario(this)) {
                mostrarToast('¡Mensaje enviado correctamente!', 'success');
                this.reset();
            }
        });
    });
    
    // Event listener para botón de tema
    const botonTema = document.querySelector('.toggle-tema');
    if (botonTema) {
        botonTema.addEventListener('click', toggleTema);
    }
    
    // Event listener para copiar email/teléfono
    const elementosCopiar = document.querySelectorAll('[data-copy]');
    elementosCopiar.forEach(elemento => {
        elemento.addEventListener('click', function() {
            const texto = this.dataset.copy || this.textContent;
            copiarAlPortapapeles(texto);
        });
    });
    
    // Inicializar contadores animados cuando sean visibles
    const contadores = document.querySelectorAll('.contador');
    const observerContadores = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('animado')) {
                const valor = parseInt(entry.target.dataset.valor);
                contadorAnimado(entry.target, valor);
                entry.target.classList.add('animado');
            }
        });
    });
    
    contadores.forEach(contador => observerContadores.observe(contador));
    
    // Cierra el menú móvil al hacer clic fuera de él
    document.addEventListener('click', function(e) {
        const nav = document.getElementById("nav");
        const menuBtn = document.querySelector('.nav-responsive');
        
        if (menuVisible && nav && menuBtn && 
            !nav.contains(e.target) && 
            !menuBtn.contains(e.target)) {
            seleccionar();
        }
    });
    
    // Maneja el redimensionamiento de ventana
    window.addEventListener('resize', function() {
        if (window.innerWidth > 980 && menuVisible) {
            seleccionar(); // Cierra el menú móvil en pantallas grandes
        }
    });
    
    // Mostrar mensaje de bienvenida en móviles
    if (esMobile()) {
        setTimeout(() => {
            mostrarToast('¡Desliza para explorar mi portafolio!', 'info', 4000);
        }, 2000);
    }
});

// Función para resetear animaciones (útil para desarrollo)
function resetearAnimaciones() {
    animacionesAplicadas = false;
    const habilidades = document.getElementsByClassName("progreso");
    const clasesHabilidades = [
        "javascript", "htmlcss", "photoshop", "wordpress", "drupal",
        "comunicacion", "trabajo", "creatividad", "dedicacion", "proyect"
    ];
    
    Array.from(habilidades).forEach((habilidad, index) => {
        if (clasesHabilidades[index]) {
            habilidad.classList.remove(clasesHabilidades[index]);
        }
    });
}

// ===== NUEVAS FUNCIONES AGREGADAS =====

// 1. Función para mostrar/ocultar botón de "volver arriba"
function toggleBotonArriba() {
    const botonArriba = document.querySelector('.arriba');
    if (!botonArriba) return;
    
    if (window.scrollY > 300) {
        botonArriba.style.opacity = '1';
        botonArriba.style.visibility = 'visible';
        botonArriba.style.transform = 'translateX(-50%) scale(1)';
    } else {
        botonArriba.style.opacity = '0';
        botonArriba.style.visibility = 'hidden';
        botonArriba.style.transform = 'translateX(-50%) scale(0.8)';
    }
}

// 2. Función para animaciones de entrada en scroll (reveal animations)
function animacionesEntrada() {
    const elementos = document.querySelectorAll('.sobremi, .curriculum, .portfolio');
    
    elementos.forEach(elemento => {
        const rect = elemento.getBoundingClientRect();
        const visible = rect.top < window.innerHeight && rect.bottom > 0;
        
        if (visible && !elemento.classList.contains('animate-in')) {
            elemento.classList.add('animate-in');
        }
    });
}

// 3. Función para typing effect en el título
function efectoEscritura(elemento, texto, velocidad = 100) {
    if (!elemento) return;
    
    elemento.textContent = '';
    let i = 0;
    
    const escribir = () => {
        if (i < texto.length) {
            elemento.textContent += texto.charAt(i);
            i++;
            setTimeout(escribir, velocidad);
        } else {
            // Agregar cursor parpadeante al final
            elemento.innerHTML += '<span class="cursor">|</span>';
        }
    };
    
    escribir();
}

// 4. Función para lazy loading de imágenes
function lazyLoadImages() {
    const imagenes = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });
    
    imagenes.forEach(img => imageObserver.observe(img));
}

// 5. Función para contador animado en estadísticas
function contadorAnimado(elemento, valorFinal, duracion = 2000) {
    if (!elemento) return;
    
    const valorInicial = 0;
    const incremento = valorFinal / (duracion / 16);
    let valorActual = valorInicial;
    
    const actualizar = () => {
        valorActual += incremento;
        if (valorActual < valorFinal) {
            elemento.textContent = Math.floor(valorActual);
            requestAnimationFrame(actualizar);
        } else {
            elemento.textContent = valorFinal;
        }
    };
    
    actualizar();
}

// 6. Función para modo oscuro/claro
function toggleTema() {
    temaOscuro = !temaOscuro;
    document.body.classList.toggle('tema-oscuro', temaOscuro);
    
    // Guardar preferencia en localStorage
    localStorage.setItem('temaOscuro', temaOscuro);
    
    // Actualizar icono del botón
    const iconoTema = document.querySelector('.toggle-tema i');
    if (iconoTema) {
        iconoTema.className = temaOscuro ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
    }
}

// 7. Función para mostrar progreso de lectura
function mostrarProgresoLectura() {
    const alturaDocumento = document.documentElement.scrollHeight - window.innerHeight;
    const progreso = (window.scrollY / alturaDocumento) * 100;
    
    const barraProgreso = document.getElementById('progreso-lectura');
    if (barraProgreso) {
        barraProgreso.style.width = progreso + '%';
    }
}

// 8. Función para filtrar proyectos del portfolio
function filtrarProyectos(categoria) {
    const proyectos = document.querySelectorAll('.proyecto');
    
    proyectos.forEach(proyecto => {
        if (categoria === 'todos' || proyecto.dataset.categoria === categoria) {
            proyecto.style.display = 'block';
            proyecto.style.opacity = '1';
            proyecto.style.transform = 'scale(1)';
        } else {
            proyecto.style.opacity = '0';
            proyecto.style.transform = 'scale(0.8)';
            setTimeout(() => {
                proyecto.style.display = 'none';
            }, 300);
        }
    });
    
    // Actualizar botones activos
    document.querySelectorAll('.filtro-btn').forEach(btn => {
        btn.classList.remove('activo');
    });
    document.querySelector(`[data-filtro="${categoria}"]`)?.classList.add('activo');
}

// 9. Función para validación de formulario de contacto
function validarFormulario(form) {
    const campos = form.querySelectorAll('input, textarea');
    let esValido = true;
    
    campos.forEach(campo => {
        const valor = campo.value.trim();
        const error = campo.parentNode.querySelector('.error-mensaje');
        
        // Limpiar errores previos
        if (error) error.remove();
        campo.classList.remove('error');
        
        // Validaciones
        if (campo.hasAttribute('required') && !valor) {
            mostrarError(campo, 'Este campo es obligatorio');
            esValido = false;
        } else if (campo.type === 'email' && valor && !validarEmail(valor)) {
            mostrarError(campo, 'Ingresa un email válido');
            esValido = false;
        }
    });
    
    return esValido;
}

function mostrarError(campo, mensaje) {
    campo.classList.add('error');
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-mensaje';
    errorDiv.textContent = mensaje;
    campo.parentNode.appendChild(errorDiv);
}

function validarEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// 10. Función para mostrar notificaciones toast
function mostrarToast(mensaje, tipo = 'info', duracion = 3000) {
    const toast = document.createElement('div');
    toast.className = `toast toast-${tipo}`;
    toast.innerHTML = `
        <span>${mensaje}</span>
        <button onclick="this.parentElement.remove()">&times;</button>
    `;
    
    document.body.appendChild(toast);
    
    // Mostrar con animación
    setTimeout(() => toast.classList.add('show'), 100);
    
    // Ocultar automáticamente
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, duracion);
}

// 11. Función para copiar texto al portapapeles
function copiarAlPortapapeles(texto) {
    navigator.clipboard.writeText(texto).then(() => {
        mostrarToast('¡Copiado al portapapeles!', 'success');
    }).catch(() => {
        mostrarToast('Error al copiar', 'error');
    });
}

// 12. Función para detectar dispositivo móvil
function esMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// 13. Función para guardar estado de scroll
function guardarEstadoScroll() {
    scrollPosition = window.scrollY;
    sessionStorage.setItem('scrollPosition', scrollPosition);
}

function restaurarEstadoScroll() {
    const savedPosition = sessionStorage.getItem('scrollPosition');
    if (savedPosition) {
        window.scrollTo(0, parseInt(savedPosition));
    }
} 