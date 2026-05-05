// Precargar usuarios demo si no existen en localStorage
(function() {
    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
    if (usuarios.length === 0) {
        const usuariosPrueba = [
            { nombre: "Administrador Sistema", cedula: "1000000001", email: "admin@subastas.com", telefono: "3001000001", password: "Admin123", tipoUsuario: "admin", rol: "admin", numeroPaleta: 1, fechaRegistro: new Date().toISOString() },
            { nombre: "Juan Angarita", cedula: "1000000002", email: "martillero@subastas.com", telefono: "3001000002", password: "Martillero123", tipoUsuario: "martillero", rol: "martillero", numeroPaleta: null, fechaRegistro: new Date().toISOString() },
            { nombre: "Juan Pérez García", cedula: "1000000101", email: "cliente1@email.com", telefono: "3001000101", password: "Cliente123", tipoUsuario: "cliente", rol: "cliente", numeroPaleta: 101, fechaRegistro: new Date().toISOString() },
            { nombre: "María López Sánchez", cedula: "1000000102", email: "cliente2@email.com", telefono: "3001000102", password: "Cliente123", tipoUsuario: "cliente", rol: "cliente", numeroPaleta: 102, fechaRegistro: new Date().toISOString() },
            { nombre: "Pedro Ramírez Gómez", cedula: "1000000201", email: "ganadero@email.com", telefono: "3001000201", password: "Ganadero123", tipoUsuario: "cliente", rol: "cliente", numeroPaleta: 201, fechaRegistro: new Date().toISOString() }
        ];
        localStorage.setItem('usuarios', JSON.stringify(usuariosPrueba));
        console.log('✅ Usuarios demo precargados automáticamente');
    }
})();

// Navbar scroll effect
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile menu toggle
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

if (navToggle) {
    navToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        this.classList.toggle('active');
    });
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all cards and sections
document.querySelectorAll('.about-card, .step-card, .feature-card-modern').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.6s ease';
    observer.observe(el);
});

// Counter animation for stats
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = formatNumber(target);
            clearInterval(timer);
        } else {
            element.textContent = formatNumber(Math.floor(start));
        }
    }, 16);
}

function formatNumber(num) {
    if (num >= 1000000000) {
        return (num / 1000000000).toFixed(0) + 'B';
    }
    if (num >= 1000000) {
        return (num / 1000000).toFixed(0) + 'M';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(0) + 'K';
    }
    return num.toString();
}

// Animate stats when they come into view
const statsObserver = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
            entry.target.classList.add('animated');
            const statNumbers = entry.target.querySelectorAll('.stat-number');
            
            statNumbers.forEach(stat => {
                const text = stat.textContent;
                let value = 0;
                
                if (text.includes('+')) {
                    const numText = text.replace(/[^0-9]/g, '');
                    value = parseInt(numText);
                    
                    if (text.includes('B')) {
                        value = value * 1000000000;
                    } else if (text.includes('M')) {
                        value = value * 1000000;
                    } else if (text.includes('K')) {
                        value = value * 1000;
                    }
                    
                    stat.textContent = '0';
                    animateCounter(stat, value);
                    
                    setTimeout(() => {
                        stat.textContent = text;
                    }, 2100);
                }
            });
        }
    });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) {
    statsObserver.observe(heroStats);
}


// Modal Functions
function openLoginModal() {
    const modal = document.getElementById('loginModal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLoginModal() {
    const modal = document.getElementById('loginModal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
    document.getElementById('loginForm').reset();
    document.getElementById('loginErrorMsg').style.display = 'none';
}

function openRegisterModal() {
    const modal = document.getElementById('registerModal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    // Hide success message if visible
    document.getElementById('successMessage').style.display = 'none';
    document.getElementById('registerForm').style.display = 'block';
}

function closeRegisterModal() {
    const modal = document.getElementById('registerModal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
    document.getElementById('registerForm').reset();
    document.getElementById('registerErrorMsg').style.display = 'none';
    document.getElementById('successMessage').style.display = 'none';
    document.getElementById('registerForm').style.display = 'block';
}

function switchToRegister() {
    closeLoginModal();
    setTimeout(() => openRegisterModal(), 300);
}

function switchToLogin() {
    closeRegisterModal();
    setTimeout(() => openLoginModal(), 300);
}

// Close modal when clicking outside
window.addEventListener('click', function(event) {
    const loginModal = document.getElementById('loginModal');
    const registerModal = document.getElementById('registerModal');
    
    if (event.target === loginModal) {
        closeLoginModal();
    }
    if (event.target === registerModal) {
        closeRegisterModal();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeLoginModal();
        closeRegisterModal();
    }
});

// Login Form Handler
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const errorMsg = document.getElementById('loginErrorMsg');
    
    // Obtener usuarios del localStorage
    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
    
    // Buscar usuario solo por email (contraseña no se valida)
    const usuario = usuarios.find(u => u.email === email);
    
    if (usuario) {
        // Bloquear si está pendiente de aprobación
        if (usuario.estado === 'pendiente') {
            errorMsg.textContent = 'Tu cuenta está pendiente de aprobación por un administrador.';
            errorMsg.classList.add('show');
            errorMsg.style.display = 'block';
            setTimeout(() => { errorMsg.classList.remove('show'); }, 4000);
            return;
        }
        // Guardar sesión
        localStorage.setItem('usuarioActual', JSON.stringify(usuario));
        
        // Redirigir según el rol
        if (usuario.rol === 'admin') {
            window.location.href = 'panel-admin.html';
        } else if (usuario.rol === 'martillero') {
            window.location.href = 'panel-martillero.html';
        } else {
            window.location.href = 'dashboard.html';
        }
    } else {
        errorMsg.textContent = 'Email o contraseña incorrectos';
        errorMsg.classList.add('show');
        errorMsg.style.display = 'block';
        
        setTimeout(() => {
            errorMsg.classList.remove('show');
        }, 3000);
    }
});

// Register Form Handler
document.getElementById('registerForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const nombre = document.getElementById('regNombre').value;
    const cedula = document.getElementById('regCedula').value;
    const email = document.getElementById('regEmail').value;
    const telefono = document.getElementById('regTelefono').value;
    const password = document.getElementById('regPassword').value;
    const tipoUsuario = document.getElementById('regTipoUsuario').value;
    const rutFile = document.getElementById('regRut').files[0];
    const errorMsg = document.getElementById('registerErrorMsg');
    
    // Validar que el email no exista
    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
    const emailExiste = usuarios.find(u => u.email === email);
    
    if (emailExiste) {
        errorMsg.textContent = 'Este email ya está registrado';
        errorMsg.classList.add('show');
        errorMsg.style.display = 'block';
        setTimeout(() => { errorMsg.classList.remove('show'); }, 3000);
        return;
    }

    // Leer el RUT como base64 y guardar el usuario
    const reader = new FileReader();
    reader.onload = function(ev) {
        const numeroPaleta = tipoUsuario === 'cliente' ? Math.floor(Math.random() * 900) + 100 : null;
        
        const usuario = {
            nombre, cedula, email, telefono, password,
            tipoUsuario, rol: tipoUsuario,
            numeroPaleta,
            estado: 'pendiente',
            rutArchivo: ev.target.result,
            rutNombre: rutFile.name,
            fechaRegistro: new Date().toISOString()
        };
        
        usuarios.push(usuario);
        localStorage.setItem('usuarios', JSON.stringify(usuarios));
        
        document.getElementById('registerForm').style.display = 'none';
        document.getElementById('successMessage').style.display = 'block';
        document.getElementById('modalNumeroPaleta').textContent = numeroPaleta ? '#' + numeroPaleta : 'N/A';
    };
    reader.readAsDataURL(rutFile);
});
