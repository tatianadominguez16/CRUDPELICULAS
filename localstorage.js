// ==========================================
// VARIABLES GLOBALES
// ==========================================
let peliculas = [];
let usuarios = [];
let usuarioActual = null;
let peliculaEditando = null;

// ==========================================
// INICIALIZACIÓN AL CARGAR LA PÁGINA
// ==========================================
window.addEventListener('load', function() {
    console.log('Página cargada, iniciando app...');
    inicializarApp();
});

function inicializarApp() {
    try {
        console.log('Inicializando aplicación...');
        
        // LIMPIAR LOCALSTORAGE SI ESTÁ CORRUPTO
        try {
            const usuariosTest = localStorage.getItem('usuarios');
            if (usuariosTest && !Array.isArray(JSON.parse(usuariosTest))) {
                console.warn('LocalStorage corrupto detectado. Limpiando...');
                localStorage.removeItem('usuarios');
                localStorage.removeItem('peliculas');
                localStorage.removeItem('usuarioActual');
            }
        } catch (e) {
            console.warn('Error al verificar localStorage, limpiando...', e);
            localStorage.clear();
        }
        
        cargarDatosLocalStorage();
        
        // Si no hay usuarios, crear usuarios de prueba
        if (usuarios.length === 0) {
            console.log('Creando usuarios de prueba...');
            crearUsuariosPrueba();
        }
        
        // Si no hay películas, crear películas de ejemplo
        if (peliculas.length === 0) {
            console.log('Creando películas de ejemplo...');
            crearPeliculasEjemplo();
        }
        
        verificarSesion();
        inicializarEventos();
        
        console.log('Aplicación inicializada correctamente');
        console.log('Usuarios disponibles:', usuarios.length);
        console.log('Películas disponibles:', peliculas.length);
    } catch (error) {
        console.error('Error al inicializar:', error);
    }
}

// ==========================================
// CREAR DATOS DE EJEMPLO
// ==========================================
function crearUsuariosPrueba() {
    usuarios = [
        {
            id: 1,
            nombre: "Administrador",
            email: "admin@cineflix.com",
            usuario: "admin",
            password: "admin123"
        },
        {
            id: 2,
            nombre: "Usuario Demo",
            email: "usuario@cineflix.com",
            usuario: "usuario",
            password: "1234"
        },
        {
            id: 3,
            nombre: "Demo User",
            email: "demo@cineflix.com",
            usuario: "demo",
            password: "demo"
        }
    ];
    guardarUsuariosLocalStorage();
}

function crearPeliculasEjemplo() {
    peliculas = [
        {
            id: 1,
            titulo: "Avatar",
            genero: "Ciencia Ficción",
            director: "James Cameron",
            ano: 2009,
            calificacion: 7.9,
            descripcion: "Un marine parapléjico es enviado a la luna Pandora en una misión única, pero se debate entre seguir sus órdenes y proteger el mundo que siente como su hogar.",
            imagen: "https://images.unsplash.com/photo-1581905764498-f1b60bae941a?w=400"
        },
        {
            id: 2,
            titulo: "Rápido y Furioso",
            genero: "Acción",
            director: "Rob Cohen",
            ano: 2001,
            calificacion: 6.8,
            descripcion: "Los agentes del FBI luchan contra la delincuencia callejera en Los Ángeles infiltrándose en el mundo de las carreras ilegales.",
            imagen: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=400"
        },
        {
            id: 3,
            titulo: "Inception",
            genero: "Ciencia Ficción",
            director: "Christopher Nolan",
            ano: 2010,
            calificacion: 8.8,
            descripcion: "Un ladrón que roba secretos corporativos mediante el uso de tecnología de sueños compartidos recibe la tarea inversa de plantar una idea.",
            imagen: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400"
        },
        {
            id: 4,
            titulo: "El Padrino",
            genero: "Drama",
            director: "Francis Ford Coppola",
            ano: 1972,
            calificacion: 9.2,
            descripcion: "El patriarca envejecido de una dinastía del crimen organizado transfiere el control de su imperio clandestino a su hijo reacio.",
            imagen: "https://images.unsplash.com/photo-1594908900066-3f47337549d8?w=400"
        },
        {
            id: 5,
            titulo: "Interestelar",
            genero: "Ciencia Ficción",
            director: "Christopher Nolan",
            ano: 2014,
            calificacion: 8.6,
            descripcion: "Un equipo de exploradores viaja a través de un agujero de gusano en el espacio en un intento de garantizar la supervivencia de la humanidad.",
            imagen: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=400"
        },
        {
            id: 6,
            titulo: "Jurassic Park",
            genero: "Aventura",
            director: "Steven Spielberg",
            ano: 1993,
            calificacion: 8.1,
            descripcion: "Un parque temático sufre un fallo de seguridad importante y libera dinosaurios clonados en la isla, poniendo en peligro a los visitantes.",
            imagen: "https://images.unsplash.com/photo-1549989476-69a92fa57c36?w=400"
        },
        {
            id: 7,
            titulo: "El Conjuro",
            genero: "Terror",
            director: "James Wan",
            ano: 2013,
            calificacion: 7.5,
            descripcion: "Investigadores paranormales trabajan para ayudar a una familia aterrorizada por una presencia oscura en su granja.",
            imagen: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=400"
        },
        {
            id: 8,
            titulo: "La La Land",
            genero: "Drama",
            director: "Damien Chazelle",
            ano: 2016,
            calificacion: 8.0,
            descripcion: "Mientras navegan por sus carreras en Los Ángeles, un pianista y una actriz se enamoran mientras intentan reconciliar sus aspiraciones con su relación.",
            imagen: "https://images.unsplash.com/photo-1574267432644-f610c0c65a5c?w=400"
        }
    ];
    guardarPeliculasLocalStorage();
}

// ==========================================
// LOCAL STORAGE - GESTIÓN DE DATOS
// ==========================================
function cargarDatosLocalStorage() {
    try {
        // Cargar usuarios
        const usuariosGuardados = localStorage.getItem('usuarios');
        if (usuariosGuardados) {
            const usuariosParsed = JSON.parse(usuariosGuardados);
            // VALIDAR que sea un array
            if (Array.isArray(usuariosParsed)) {
                usuarios = usuariosParsed;
                console.log('Usuarios cargados:', usuarios.length);
            } else {
                console.warn('Los usuarios guardados no son un array válido');
                usuarios = [];
            }
        } else {
            usuarios = [];
        }
        
        // Cargar películas
        const peliculasGuardadas = localStorage.getItem('peliculas');
        if (peliculasGuardadas) {
            const peliculasParsed = JSON.parse(peliculasGuardadas);
            // VALIDAR que sea un array
            if (Array.isArray(peliculasParsed)) {
                peliculas = peliculasParsed;
                console.log('Películas cargadas:', peliculas.length);
            } else {
                console.warn('Las películas guardadas no son un array válido');
                peliculas = [];
            }
        } else {
            peliculas = [];
        }
        
        // Cargar sesión actual
        const sesionGuardada = localStorage.getItem('usuarioActual');
        if (sesionGuardada) {
            usuarioActual = JSON.parse(sesionGuardada);
            console.log('Sesión activa:', usuarioActual ? usuarioActual.usuario : 'ninguna');
        }
    } catch (error) {
        console.error('Error al cargar datos:', error);
        // En caso de error, inicializar arrays vacíos
        usuarios = [];
        peliculas = [];
        usuarioActual = null;
    }
}

function guardarUsuariosLocalStorage() {
    try {
        localStorage.setItem('usuarios', JSON.stringify(usuarios));
        console.log('Usuarios guardados');
    } catch (error) {
        console.error('Error al guardar usuarios:', error);
    }
}

function guardarPeliculasLocalStorage() {
    try {
        localStorage.setItem('peliculas', JSON.stringify(peliculas));
        console.log('Películas guardadas');
    } catch (error) {
        console.error('Error al guardar películas:', error);
    }
}

function guardarSesionLocalStorage() {
    try {
        if (usuarioActual) {
            localStorage.setItem('usuarioActual', JSON.stringify(usuarioActual));
            console.log('Sesión guardada');
        } else {
            localStorage.removeItem('usuarioActual');
            console.log('Sesión eliminada');
        }
    } catch (error) {
        console.error('Error al guardar sesión:', error);
    }
}

// ==========================================
// VERIFICAR SESIÓN
// ==========================================
function verificarSesion() {
    if (usuarioActual) {
        mostrarContenidoPrincipal();
    } else {
        mostrarLogin();
    }
}

function mostrarLogin() {
    const loginSection = document.getElementById('loginSection');
    const mainContent = document.getElementById('mainContent');
    const btnLogin = document.getElementById('btnLogin');
    const btnLogout = document.getElementById('btnLogout');
    const btnAgregar = document.getElementById('btnAgregar');
    
    if (loginSection) loginSection.style.display = 'flex';
    if (mainContent) mainContent.style.display = 'none';
    if (btnLogin) btnLogin.style.display = 'inline-block';
    if (btnLogout) btnLogout.style.display = 'none';
    if (btnAgregar) btnAgregar.style.display = 'none';
}

function mostrarContenidoPrincipal() {
    const loginSection = document.getElementById('loginSection');
    const mainContent = document.getElementById('mainContent');
    const btnLogin = document.getElementById('btnLogin');
    const btnLogout = document.getElementById('btnLogout');
    const btnAgregar = document.getElementById('btnAgregar');
    
    if (loginSection) loginSection.style.display = 'none';
    if (mainContent) mainContent.style.display = 'block';
    if (btnLogin) btnLogin.style.display = 'none';
    if (btnLogout) btnLogout.style.display = 'inline-block';
    if (btnAgregar) btnAgregar.style.display = 'inline-block';
    
    renderizarPeliculas();
    renderizarSlider();
}

// ==========================================
// EVENTOS
// ==========================================
function inicializarEventos() {
    console.log('Inicializando eventos...');
    
    // Login
    const formLogin = document.getElementById('formLogin');
    if (formLogin) {
        formLogin.addEventListener('submit', handleLogin);
    }
    
    // Registro
    const formRegistro = document.getElementById('formRegistro');
    if (formRegistro) {
        formRegistro.addEventListener('submit', handleRegistro);
    }
    
    // Logout
    const btnLogout = document.getElementById('btnLogout');
    if (btnLogout) {
        btnLogout.addEventListener('click', handleLogout);
    }
    
    // Botón Login en navbar
    const btnLogin = document.getElementById('btnLogin');
    if (btnLogin) {
        btnLogin.addEventListener('click', function() {
            mostrarLogin();
        });
    }
    
    // Link para volver al login desde registro
    const linkLogin = document.getElementById('linkLogin');
    if (linkLogin) {
        linkLogin.addEventListener('click', function(e) {
            e.preventDefault();
            const loginTab = document.getElementById('login-tab');
            if (loginTab) loginTab.click();
        });
    }
    
    // Guardar película (crear o editar)
    const btnGuardarPelicula = document.getElementById('btnGuardarPelicula');
    if (btnGuardarPelicula) {
        btnGuardarPelicula.addEventListener('click', guardarPelicula);
    }
    
    // Búsqueda
    const inputBuscar = document.getElementById('inputBuscar');
    if (inputBuscar) {
        inputBuscar.addEventListener('input', filtrarPeliculas);
    }
    
    // Filtro por género
    const selectGenero = document.getElementById('selectGenero');
    if (selectGenero) {
        selectGenero.addEventListener('change', filtrarPeliculas);
    }
    
    // Al abrir modal de agregar, limpiar el formulario
    const btnAgregar = document.getElementById('btnAgregar');
    if (btnAgregar) {
        btnAgregar.addEventListener('click', function() {
            limpiarFormularioPelicula();
            peliculaEditando = null;
            const modalTitulo = document.getElementById('modalTitulo');
            if (modalTitulo) modalTitulo.textContent = 'Agregar Película';
        });
    }
}

// ==========================================
// LOGIN
// ==========================================
function handleLogin(e) {
    e.preventDefault();
    console.log('Intentando login...');
    
    const inputUser = document.getElementById('inputUser');
    const inputPassword = document.getElementById('inputPassword');
    
    if (!inputUser || !inputPassword) {
        console.error('Campos de login no encontrados');
        return;
    }
    
    const usuario = inputUser.value.trim();
    const password = inputPassword.value;
    
    console.log('Usuario:', usuario);
    
    // VALIDAR que usuarios sea un array antes de usar .find()
    if (!Array.isArray(usuarios)) {
        console.error('ERROR: usuarios no es un array:', usuarios);
        usuarios = [];
        // Crear usuarios de prueba si no existen
        crearUsuariosPrueba();
    }
    
    console.log('Total de usuarios disponibles:', usuarios.length);
    
    // Buscar usuario
    const usuarioEncontrado = usuarios.find(u => 
        u.usuario === usuario && u.password === password
    );
    
    if (usuarioEncontrado) {
        console.log('Usuario encontrado:', usuarioEncontrado.nombre);
        usuarioActual = usuarioEncontrado;
        guardarSesionLocalStorage();
        mostrarContenidoPrincipal();
        
        // Limpiar formulario
        document.getElementById('formLogin').reset();
        
        // Mostrar mensaje de bienvenida
        mostrarMensaje('success', `¡Bienvenido ${usuarioActual.nombre}!`);
    } else {
        console.log('Usuario no encontrado o contraseña incorrecta');
        mostrarMensaje('danger', 'Usuario o contraseña incorrectos');
    }
}

// ==========================================
// REGISTRO
// ==========================================
function handleRegistro(e) {
    e.preventDefault();
    console.log('Intentando registro...');
    
    const nombre = document.getElementById('inputNombre').value.trim();
    const email = document.getElementById('inputEmail').value.trim();
    const usuario = document.getElementById('inputUserReg').value.trim();
    const password = document.getElementById('inputPasswordReg').value;
    const confirmPassword = document.getElementById('inputConfirmPassword').value;
    
    // Validaciones
    if (usuario.length < 4) {
        mostrarMensaje('warning', 'El usuario debe tener al menos 4 caracteres');
        return;
    }
    
    if (password.length < 6) {
        mostrarMensaje('warning', 'La contraseña debe tener al menos 6 caracteres');
        return;
    }
    
    if (password !== confirmPassword) {
        mostrarMensaje('warning', 'Las contraseñas no coinciden');
        return;
    }
    
    // Verificar si el usuario ya existe
    const usuarioExiste = usuarios.find(u => u.usuario === usuario);
    if (usuarioExiste) {
        mostrarMensaje('danger', 'El usuario ya existe');
        return;
    }
    
    // Verificar si el email ya existe
    const emailExiste = usuarios.find(u => u.email === email);
    if (emailExiste) {
        mostrarMensaje('danger', 'El email ya está registrado');
        return;
    }
    
    // Crear nuevo usuario
    const nuevoUsuario = {
        id: usuarios.length > 0 ? Math.max(...usuarios.map(u => u.id)) + 1 : 1,
        nombre,
        email,
        usuario,
        password
    };
    
    usuarios.push(nuevoUsuario);
    guardarUsuariosLocalStorage();
    
    console.log('Usuario creado:', usuario);
    
    // Limpiar formulario
    document.getElementById('formRegistro').reset();
    
    // Cambiar a tab de login
    const loginTab = document.getElementById('login-tab');
    if (loginTab) loginTab.click();
    
    mostrarMensaje('success', 'Cuenta creada exitosamente. Por favor inicia sesión.');
}

// ==========================================
// LOGOUT
// ==========================================
function handleLogout() {
    if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
        usuarioActual = null;
        guardarSesionLocalStorage();
        mostrarLogin();
        mostrarMensaje('info', 'Sesión cerrada correctamente');
    }
}

// ==========================================
// CRUD - CREAR/EDITAR PELÍCULA
// ==========================================
function guardarPelicula() {
    const titulo = document.getElementById('inputTitulo').value.trim();
    const genero = document.getElementById('inputGenero').value;
    const director = document.getElementById('inputDirector').value.trim();
    const ano = parseInt(document.getElementById('inputAno').value);
    const calificacion = parseFloat(document.getElementById('inputCalificacion').value);
    const descripcion = document.getElementById('inputDescripcion').value.trim();
    const imagen = document.getElementById('inputImagen').value.trim();
    
    // Validaciones
    if (!titulo || !genero || !director || !ano || !calificacion || !descripcion || !imagen) {
        mostrarMensaje('warning', 'Por favor completa todos los campos');
        return;
    }
    
    if (calificacion < 1 || calificacion > 10) {
        mostrarMensaje('warning', 'La calificación debe estar entre 1 y 10');
        return;
    }
    
    if (peliculaEditando) {
        // EDITAR película existente
        const index = peliculas.findIndex(p => p.id === peliculaEditando.id);
        if (index !== -1) {
            peliculas[index] = {
                ...peliculas[index],
                titulo,
                genero,
                director,
                ano,
                calificacion,
                descripcion,
                imagen
            };
            mostrarMensaje('success', 'Película actualizada correctamente');
        }
    } else {
        // CREAR nueva película
        const nuevaPelicula = {
            id: peliculas.length > 0 ? Math.max(...peliculas.map(p => p.id)) + 1 : 1,
            titulo,
            genero,
            director,
            ano,
            calificacion,
            descripcion,
            imagen
        };
        peliculas.push(nuevaPelicula);
        mostrarMensaje('success', 'Película agregada correctamente');
    }
    
    guardarPeliculasLocalStorage();
    renderizarPeliculas();
    renderizarSlider();
    
    // Cerrar modal
    const modalElement = document.getElementById('modalPelicula');
    if (modalElement && typeof bootstrap !== 'undefined') {
        const modal = bootstrap.Modal.getInstance(modalElement);
        if (modal) modal.hide();
    }
    
    // Limpiar formulario
    limpiarFormularioPelicula();
    peliculaEditando = null;
}

// ==========================================
// CRUD - EDITAR PELÍCULA
// ==========================================
function editarPelicula(id) {
    const pelicula = peliculas.find(p => p.id === id);
    if (!pelicula) return;
    
    peliculaEditando = pelicula;
    
    // Llenar formulario
    document.getElementById('inputTitulo').value = pelicula.titulo;
    document.getElementById('inputGenero').value = pelicula.genero;
    document.getElementById('inputDirector').value = pelicula.director;
    document.getElementById('inputAno').value = pelicula.ano;
    document.getElementById('inputCalificacion').value = pelicula.calificacion;
    document.getElementById('inputDescripcion').value = pelicula.descripcion;
    document.getElementById('inputImagen').value = pelicula.imagen;
    
    // Cambiar título del modal
    document.getElementById('modalTitulo').textContent = 'Editar Película';
    
    // Abrir modal
    const modalElement = document.getElementById('modalPelicula');
    if (modalElement && typeof bootstrap !== 'undefined') {
        const modal = new bootstrap.Modal(modalElement);
        modal.show();
    }
}

// ==========================================
// CRUD - ELIMINAR PELÍCULA
// ==========================================
function eliminarPelicula(id) {
    const pelicula = peliculas.find(p => p.id === id);
    if (!pelicula) return;
    
    if (confirm(`¿Estás seguro de eliminar "${pelicula.titulo}"?`)) {
        peliculas = peliculas.filter(p => p.id !== id);
        guardarPeliculasLocalStorage();
        renderizarPeliculas();
        renderizarSlider();
        mostrarMensaje('success', 'Película eliminada correctamente');
    }
}

// ==========================================
// VER DETALLES DE PELÍCULA
// ==========================================
function verDetalles(id) {
    const pelicula = peliculas.find(p => p.id === id);
    if (!pelicula) return;
    
    document.getElementById('detallesTitulo').textContent = pelicula.titulo;
    document.getElementById('detallesImagen').src = pelicula.imagen;
    document.getElementById('detallesImagen').alt = pelicula.titulo;
    document.getElementById('detallesGenero').textContent = pelicula.genero;
    document.getElementById('detallesDirector').textContent = pelicula.director;
    document.getElementById('detallesAno').textContent = pelicula.ano;
    document.getElementById('detallesCalificacion').textContent = pelicula.calificacion;
    document.getElementById('detallesDescripcion').textContent = pelicula.descripcion;
    
    const modalElement = document.getElementById('modalDetalles');
    if (modalElement && typeof bootstrap !== 'undefined') {
        const modal = new bootstrap.Modal(modalElement);
        modal.show();
    }
}

// ==========================================
// RENDERIZAR PELÍCULAS (GRID)
// ==========================================
function renderizarPeliculas() {
    const grid = document.getElementById('gridPeliculas');
    const sinResultados = document.getElementById('sinResultados');
    
    if (!grid || !sinResultados) {
        console.error('Elementos del grid no encontrados');
        return;
    }
    
    const peliculasFiltradas = obtenerPeliculasFiltradas();
    
    if (peliculasFiltradas.length === 0) {
        grid.innerHTML = '';
        sinResultados.style.display = 'block';
        return;
    }
    
    sinResultados.style.display = 'none';
    
    grid.innerHTML = peliculasFiltradas.map(pelicula => `
        <div class="col-md-6 col-lg-4 col-xl-3">
            <div class="movie-card">
                <img src="${pelicula.imagen}" 
                     alt="${pelicula.titulo}" 
                     class="movie-image"
                     onerror="this.src='https://via.placeholder.com/300x400?text=${encodeURIComponent(pelicula.titulo)}'">
                <div class="movie-content">
                    <h5 class="movie-title">${pelicula.titulo}</h5>
                    <span class="movie-genre">${pelicula.genero}</span>
                    <p class="movie-meta">
                        <i class="bi bi-person-film"></i> ${pelicula.director} | 
                        <i class="bi bi-calendar"></i> ${pelicula.ano}
                    </p>
                    <p class="movie-rating">
                        ⭐ ${pelicula.calificacion}/10
                    </p>
                    <p class="movie-description">${pelicula.descripcion}</p>
                    <div class="movie-actions">
                        <button class="btn btn-info btn-sm" onclick="verDetalles(${pelicula.id})">
                            <i class="bi bi-eye"></i> Ver
                        </button>
                        <button class="btn btn-warning btn-sm" onclick="editarPelicula(${pelicula.id})">
                            <i class="bi bi-pencil"></i> Editar
                        </button>
                        <button class="btn btn-danger btn-sm" onclick="eliminarPelicula(${pelicula.id})">
                            <i class="bi bi-trash"></i> Eliminar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// ==========================================
// RENDERIZAR SLIDER (PELÍCULAS RECIENTES)
// ==========================================
function renderizarSlider() {
    const carousel = document.getElementById('carouselMovies');
    
    if (!carousel) {
        console.error('Carrusel no encontrado');
        return;
    }
    
    // Obtener las últimas 8 películas
    const peliculasRecientes = [...peliculas]
        .sort((a, b) => b.ano - a.ano)
        .slice(0, 8);
    
    if (peliculasRecientes.length === 0) {
        carousel.innerHTML = '<p class="text-muted">No hay películas para mostrar</p>';
        return;
    }
    
    carousel.innerHTML = peliculasRecientes.map(pelicula => `
        <div class="slider-movie-card" onclick="verDetalles(${pelicula.id})">
            <img src="${pelicula.imagen}" 
                 alt="${pelicula.titulo}"
                 onerror="this.src='https://via.placeholder.com/180x250?text=${encodeURIComponent(pelicula.titulo)}'">
            <div class="slider-movie-info">
                <h6>${pelicula.titulo}</h6>
                <small class="text-muted">${pelicula.ano}</small>
            </div>
        </div>
    `).join('');
}

// ==========================================
// FILTRAR PELÍCULAS (BÚSQUEDA Y GÉNERO)
// ==========================================
function obtenerPeliculasFiltradas() {
    const inputBuscar = document.getElementById('inputBuscar');
    const selectGenero = document.getElementById('selectGenero');
    
    const textoBusqueda = inputBuscar ? inputBuscar.value.toLowerCase().trim() : '';
    const generoSeleccionado = selectGenero ? selectGenero.value : '';
    
    return peliculas.filter(pelicula => {
        const coincideBusqueda = textoBusqueda === '' || 
            pelicula.titulo.toLowerCase().includes(textoBusqueda) ||
            pelicula.director.toLowerCase().includes(textoBusqueda) ||
            pelicula.descripcion.toLowerCase().includes(textoBusqueda);
        
        const coincideGenero = generoSeleccionado === '' || 
            pelicula.genero === generoSeleccionado;
        
        return coincideBusqueda && coincideGenero;
    });
}

function filtrarPeliculas() {
    renderizarPeliculas();
}

// ==========================================
// SLIDER - SCROLL
// ==========================================
function scrollSlider(direction) {
    const carousel = document.getElementById('carouselMovies');
    if (!carousel) return;
    
    const scrollAmount = 200;
    
    if (direction === 1) {
        carousel.scrollLeft += scrollAmount;
    } else {
        carousel.scrollLeft -= scrollAmount;
    }
}

// ==========================================
// UTILIDADES
// ==========================================
function limpiarFormularioPelicula() {
    const formPelicula = document.getElementById('formPelicula');
    if (formPelicula) {
        formPelicula.reset();
    }
}

function mostrarMensaje(tipo, mensaje) {
    // Crear el elemento de alerta
    const alerta = document.createElement('div');
    alerta.className = `alert alert-${tipo} alert-dismissible fade show position-fixed`;
    alerta.style.cssText = 'top: 80px; right: 20px; z-index: 9999; min-width: 300px;';
    alerta.innerHTML = `
        ${mensaje}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(alerta);
    
    // Auto-cerrar después de 3 segundos
    setTimeout(() => {
        alerta.remove();
    }, 3000);
}

// ==========================================
// CONSOLA - AYUDA PARA DEBUGGING
// ==========================================
console.log('%c🎬 CineFlix CRUD Películas 🎬', 'color: #667eea; font-size: 20px; font-weight: bold;');
console.log('%cUsuarios de prueba disponibles:', 'color: #667eea; font-weight: bold;');
console.log('- Usuario: admin | Contraseña: admin123');
console.log('- Usuario: usuario | Contraseña: 1234');
console.log('- Usuario: demo | Contraseña: demo');

// Verificar que Bootstrap esté cargado
if (typeof bootstrap !== 'undefined') {
    console.log('%c✓ Bootstrap cargado correctamente', 'color: green;');
} else {
    console.error('✗ Bootstrap NO está cargado');
}