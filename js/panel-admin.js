// Verificar acceso de administrador
const usuarioActual = JSON.parse(localStorage.getItem('usuarioActual'));

if (!usuarioActual || usuarioActual.rol !== 'admin') {
    alert('Acceso denegado. Solo administradores pueden acceder a este panel.');
    window.location.href = 'dashboard.html';
}

const EVENTO_ID_ADMIN = 'evento_2026_03';

// Actualizar nombre del administrador en ambos lugares
document.getElementById('adminNombre').textContent = usuarioActual.nombre;

// Mostrar badge de aprobaciones pendientes al cargar
window.addEventListener('DOMContentLoaded', function() {
    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
    const pendientes = usuarios.filter(u => u.estado === 'pendiente').length;
    const badge = document.getElementById('badgeAprobaciones');
    if (badge && pendientes > 0) {
        badge.textContent = pendientes;
        badge.style.display = 'inline-block';
    }

    // Badge solicitudes de paleta
    const solicitudes = JSON.parse(localStorage.getItem(`solicitudes_paleta_${EVENTO_ID_ADMIN}`) || '[]');
    const pendientesPaleta = solicitudes.filter(s => s.estado === 'pendiente').length;
    const badgePaletas = document.getElementById('badgePaletas');
    if (badgePaletas && pendientesPaleta > 0) {
        badgePaletas.textContent = pendientesPaleta;
        badgePaletas.style.display = 'inline-block';
    }
});

// Datos de ejemplo
let eventos = JSON.parse(localStorage.getItem('eventos') || '[]');
let lotes = JSON.parse(localStorage.getItem('lotesAdmin') || '[]');

// Inicializar con datos de ejemplo si está vacío
if (eventos.length === 0) {
    eventos = [
        {
            id: 1,
            nombre: 'Subasta Ganadera Mensual',
            fecha: '2026-03-15',
            hora: '09:00',
            ubicacion: 'Yopal, Casanare',
            lotes: 150,
            estado: 'activo'
        },
        {
            id: 2,
            nombre: 'Subasta Especial de Cría',
            fecha: '2026-03-22',
            hora: '10:00',
            ubicacion: 'Aguazul, Casanare',
            lotes: 80,
            estado: 'pendiente'
        }
    ];
    localStorage.setItem('eventos', JSON.stringify(eventos));
}

if (lotes.length === 0) {
    lotes = [
        { numero: 1, tipo: 'Ganado de Ceba', cantidad: 15, peso: 480, raza: 'Brahman', precioBase: 18000000, estado: 'pendiente' },
        { numero: 2, tipo: 'Ganado de Levante', cantidad: 20, peso: 320, raza: 'Cebú', precioBase: 12000000, estado: 'pendiente' },
        { numero: 3, tipo: 'Ganado de Ceba', cantidad: 10, peso: 450, raza: 'Angus', precioBase: 15000000, estado: 'subastado' }
    ];
    localStorage.setItem('lotesAdmin', JSON.stringify(lotes));
}

// Funciones de navegación
function mostrarSeccion(seccion) {
    // Ocultar todas las secciones
    document.querySelectorAll('.admin-section').forEach(s => s.style.display = 'none');
    
    // Remover clase activa de todos los nav-items
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    
    // Mostrar sección seleccionada
    document.getElementById(`seccion-${seccion}`).style.display = 'block';
    
    // Activar nav-item
    event.target.closest('.nav-item').classList.add('active');
    
    // Actualizar título
    const titulos = {
        'eventos': 'Gestión de Eventos',
        'lotes': 'Gestión de Lotes',
        'usuarios': 'Gestión de Usuarios',
        'categorias': 'Categorías de Ganado',
        'resultados': 'Resultados de Subastas',
        'reportes': 'Reportes Financieros',
        'configuracion': 'Configuración del Sistema'
    };
    document.getElementById('tituloSeccion').textContent = titulos[seccion];
    
    // Cargar datos de la sección
    switch(seccion) {
        case 'eventos':
            cargarEventos();
            break;
        case 'lotes':
            cargarLotes();
            break;
        case 'usuarios':
            cargarUsuarios();
            break;
        case 'aprobaciones':
            cargarAprobaciones();
            break;
        case 'paletas':
            cargarSolicitudesPaleta();
            break;
        case 'categorias':
            cargarCategorias();
            break;
        case 'resultados':
            cargarResultados();
            break;
        case 'reportes':
            cargarReportesFinancieros();
            break;
    }
}

// Gestión de Eventos
function cargarEventos() {
    const tabla = document.getElementById('tablaEventos');
    tabla.innerHTML = '';

    eventos.forEach(evento => {
        const tr = document.createElement('tr');
        const estadoBadge = evento.estado === 'activo' ? 'badge-activo' :
                           evento.estado === 'pendiente' ? 'badge-pendiente' : 'badge-completado';

        tr.innerHTML = `
            <td>#${evento.id}</td>
            <td>${evento.nombre}</td>
            <td>${formatearFecha(evento.fecha)}</td>
            <td>${evento.ubicacion}</td>
            <td>${evento.lotes}</td>
            <td><span class="badge ${estadoBadge}">${evento.estado.toUpperCase()}</span></td>
            <td>
                <button class="btn-action btn-edit" title="Editar" onclick="editarEvento(${evento.id})"><i data-lucide="pencil"></i></button>
                <button class="btn-action btn-delete" title="Eliminar" onclick="eliminarEvento(${evento.id})"><i data-lucide="trash-2"></i></button>
            </td>
        `;
        tabla.appendChild(tr);
    });

    document.getElementById('totalEventos').textContent = eventos.length;
    document.getElementById('eventosActivos').textContent = eventos.filter(e => e.estado === 'activo').length;
    document.getElementById('eventosCompletados').textContent = eventos.filter(e => e.estado === 'completado').length;
    lucide.createIcons();
}


function abrirModalEvento() {
    document.getElementById('modalEvento').style.display = 'flex';
}

function cerrarModalEvento() {
    document.getElementById('modalEvento').style.display = 'none';
}

document.getElementById('formEvento').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const nuevoEvento = {
        id: eventos.length + 1,
        nombre: this.elements[0].value,
        fecha: this.elements[1].value,
        hora: this.elements[2].value,
        ubicacion: this.elements[3].value,
        lotes: 0,
        estado: 'pendiente'
    };
    
    eventos.push(nuevoEvento);
    localStorage.setItem('eventos', JSON.stringify(eventos));
    
    cargarEventos();
    cerrarModalEvento();
    this.reset();
});

function editarEvento(id) {
    alert('Función de edición en desarrollo');
}

function eliminarEvento(id) {
    if (confirm('¿Estás seguro de eliminar este evento?')) {
        eventos = eventos.filter(e => e.id !== id);
        localStorage.setItem('eventos', JSON.stringify(eventos));
        cargarEventos();
    }
}

// Gestión de Lotes
function cargarLotes() {
    const tabla = document.getElementById('tablaLotes');
    tabla.innerHTML = '';
    
    lotes.forEach(lote => {
        const tr = document.createElement('tr');
        const estadoBadge = lote.estado === 'pendiente' ? 'badge-pendiente' : 'badge-subastado';
        
        tr.innerHTML = `
            <td>#${lote.numero}</td>
            <td>${lote.tipo}</td>
            <td>${lote.cantidad} cabezas</td>
            <td>${lote.peso} kg</td>
            <td>${lote.raza}</td>
            <td>${formatearPrecio(lote.precioBase)}</td>
            <td><span class="badge ${estadoBadge}">${lote.estado.toUpperCase()}</span></td>
            <td>
                <button class="btn-action btn-edit" title="Editar" onclick="editarLote(${lote.numero})"><i data-lucide="pencil"></i></button>
                <button class="btn-action btn-delete" title="Eliminar" onclick="eliminarLote(${lote.numero})"><i data-lucide="trash-2"></i></button>
            </td>
        `;
        tabla.appendChild(tr);
    });
    lucide.createIcons();
}

function abrirModalLote() {
    adjuntosLote = [];
    document.getElementById('adjuntosLista').innerHTML = '';
    document.getElementById('adjuntosInput').value = '';
    document.getElementById('modalLote').style.display = 'flex';
}

function cerrarModalLote() {
    document.getElementById('modalLote').style.display = 'none';
}

let adjuntosLote = []; // archivos adjuntos del lote actual

function manejarAdjuntos(input) {
    const archivos = Array.from(input.files).slice(0, 5);
    const lista = document.getElementById('adjuntosLista');
    lista.innerHTML = '';
    adjuntosLote = [];

    archivos.forEach((archivo, i) => {
        // Guardar como base64 para persistencia en localStorage
        const reader = new FileReader();
        reader.onload = (e) => {
            adjuntosLote[i] = { nombre: archivo.name, tipo: archivo.type, datos: e.target.result };
        };
        reader.readAsDataURL(archivo);

        const item = document.createElement('div');
        item.className = 'adjunto-item';
        const icono = archivo.type.includes('pdf') ? 'ðŸ“„' : 'ðŸ–¼ï¸';
        item.innerHTML = `
            <span class="adjunto-icono">${icono}</span>
            <span class="adjunto-nombre">${archivo.name}</span>
            <span class="adjunto-size">${(archivo.size / 1024).toFixed(0)} KB</span>
            <button type="button" class="adjunto-remove" onclick="this.parentElement.remove()">âœ•</button>
        `;
        lista.appendChild(item);
    });
}

document.getElementById('formLote').addEventListener('submit', function(e) {
    e.preventDefault();

    const nuevoLote = {
        numero: lotes.length + 1,
        tipo: document.getElementById('loteTipo').value,
        cantidad: parseInt(document.getElementById('loteCantidad').value),
        peso: parseInt(document.getElementById('lotePeso').value),
        raza: document.getElementById('loteRaza').value,
        sexo: document.getElementById('loteSexo').value,
        precioBase: parseInt(document.getElementById('lotePrecioBase').value),
        vendedor: document.getElementById('loteVendedor').value,
        procedencia: document.getElementById('loteProcedencia').value,
        observaciones: document.getElementById('loteObservaciones').value,
        adjuntos: adjuntosLote.filter(Boolean),
        estado: 'pendiente',
        fechaCreacion: new Date().toISOString()
    };

    lotes.push(nuevoLote);
    localStorage.setItem('lotesAdmin', JSON.stringify(lotes));

    cargarLotes();
    cerrarModalLote();
    this.reset();
    adjuntosLote = [];
    document.getElementById('adjuntosLista').innerHTML = '';
});

function editarLote(numero) {
    alert('Función de edición en desarrollo');
}

function eliminarLote(numero) {
    if (confirm('¿Estás seguro de eliminar este lote?')) {
        lotes = lotes.filter(l => l.numero !== numero);
        localStorage.setItem('lotesAdmin', JSON.stringify(lotes));
        cargarLotes();
    }
}

// Gestión de Usuarios
function cargarUsuarios() {
    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
    const tabla = document.getElementById('tablaUsuarios');
    tabla.innerHTML = '';
    
    // Aplicar filtros
    const busqueda = document.getElementById('buscarUsuario')?.value.toLowerCase() || '';
    const filtroTipo = document.getElementById('filtroTipoUsuario')?.value || '';
    
    let usuariosFiltrados = usuarios;
    
    if (busqueda) {
        usuariosFiltrados = usuariosFiltrados.filter(u => 
            u.nombre.toLowerCase().includes(busqueda) ||
            u.cedula.includes(busqueda) ||
            (u.numeroPaleta != null && u.numeroPaleta.toString().includes(busqueda))
        );
    }
    
    if (filtroTipo) {
        usuariosFiltrados = usuariosFiltrados.filter(u => u.tipoUsuario === filtroTipo);
    }
    
    if (usuariosFiltrados.length === 0) {
        tabla.innerHTML = '<tr><td colspan="8" style="text-align: center; padding: 40px; color: #94a3b8;">No se encontraron usuarios</td></tr>';
        return;
    }
    
    usuariosFiltrados.forEach(usuario => {
        const tr = document.createElement('tr');
        const tipoBadge = getTipoBadge(usuario.tipoUsuario);
        
        tr.innerHTML = `
            <td><strong>${usuario.numeroPaleta != null ? '#' + usuario.numeroPaleta : 'â€”'}</strong></td>
            <td>${usuario.nombre}</td>
            <td>${usuario.cedula}</td>
            <td>${usuario.telefono}</td>
            <td>${usuario.email || '<em style="color: #94a3b8;">Sin email</em>'}</td>
            <td><span class="badge ${tipoBadge}">${usuario.tipoUsuario.toUpperCase()}</span></td>
            <td>${formatearFecha(usuario.fechaRegistro)}</td>
            <td>
                <button class="btn-action btn-view" title="Ver" onclick="verUsuario('${usuario.cedula}')"><i data-lucide="eye"></i></button>
                <button class="btn-action btn-edit" title="Editar" onclick="editarUsuario('${usuario.cedula}')"><i data-lucide="pencil"></i></button>
                <button class="btn-action btn-delete" title="Eliminar" onclick="eliminarUsuario('${usuario.cedula}')"><i data-lucide="trash-2"></i></button>
            </td>
        `;
        tabla.appendChild(tr);
    });
    
    // Actualizar estadísticas
    document.getElementById('totalUsuarios').textContent = usuarios.length;
    document.getElementById('totalClientes').textContent = usuarios.filter(u => u.tipoUsuario === 'cliente').length;
    document.getElementById('totalMartilleros').textContent = usuarios.filter(u => u.tipoUsuario === 'martillero').length;
    lucide.createIcons();
}

function getTipoBadge(tipo) {
    const badges = {
        'cliente': 'badge-activo',
        'martillero': 'badge-completado',
        'admin': 'badge-subastado'
    };
    return badges[tipo] || 'badge-activo';
}

// Agregar event listeners para filtros
document.getElementById('buscarUsuario')?.addEventListener('input', cargarUsuarios);
document.getElementById('filtroTipoUsuario')?.addEventListener('change', cargarUsuarios);

function abrirModalCrearUsuario() {
    document.getElementById('tituloModalUsuario').textContent = 'Registrar Nuevo Usuario';
    document.getElementById('formUsuario').reset();
    document.getElementById('usuarioId').value = '';
    document.getElementById('formUsuario').style.display = 'block';
    document.getElementById('resultadoRegistro').style.display = 'none';
    generarPasswordTemporal();
    document.getElementById('modalUsuario').style.display = 'flex';
}

function cerrarModalUsuario() {
    document.getElementById('modalUsuario').style.display = 'none';
    document.getElementById('formUsuario').reset();
}

function generarPasswordTemporal() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let password = '';
    for (let i = 0; i < 8; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    document.getElementById('usuarioPassword').value = password;
}

document.getElementById('formUsuario').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const nombre = document.getElementById('usuarioNombre').value;
    const cedula = document.getElementById('usuarioCedula').value;
    const telefono = document.getElementById('usuarioTelefono').value;
    const email = document.getElementById('usuarioEmail').value;
    const tipo = document.getElementById('usuarioTipo').value;
    const password = document.getElementById('usuarioPassword').value;
    const notas = document.getElementById('usuarioNotas').value;
    
    // Verificar si la cédula ya existe
    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
    const existente = usuarios.find(u => u.cedula === cedula);
    
    if (existente && !document.getElementById('usuarioId').value) {
        alert('Ya existe un usuario con esta cédula');
        return;
    }
    
    // Generar número de paleta único (solo para clientes)
    const numeroPaleta = tipo === 'cliente' ? Math.floor(Math.random() * 900) + 100 : null;
    
    const nuevoUsuario = {
        nombre,
        cedula,
        telefono,
        email: email || cedula + '@temp.local',
        password,
        tipoUsuario: tipo,
        rol: tipo,
        numeroPaleta,
        notas,
        fechaRegistro: new Date().toISOString(),
        registradoPor: usuarioActual.nombre,
        registroPresencial: true
    };
    
    usuarios.push(nuevoUsuario);
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
    
    // Mostrar resultado
    document.getElementById('formUsuario').style.display = 'none';
    document.getElementById('resultadoRegistro').style.display = 'block';
    
    document.getElementById('resultNombre').textContent = nombre;
    document.getElementById('resultPaleta').textContent = numeroPaleta ? '#' + numeroPaleta : 'N/A';
    document.getElementById('resultUsuario').textContent = email || cedula;
    document.getElementById('resultPassword').textContent = password;
    
    cargarUsuarios();
});

function verUsuario(cedula) {
    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
    const usuario = usuarios.find(u => u.cedula === cedula);
    
    if (!usuario) return;
    
    const info = `
Información del Usuario
â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”

Nombre: ${usuario.nombre}
Cédula: ${usuario.cedula}
Paleta Digital: ${usuario.numeroPaleta ? '#' + usuario.numeroPaleta : 'N/A'}
Teléfono: ${usuario.telefono}
Email: ${usuario.email}
Tipo: ${usuario.tipoUsuario}
Fecha de Registro: ${formatearFecha(usuario.fechaRegistro)}
${usuario.registradoPor ? 'Registrado por: ' + usuario.registradoPor : ''}
${usuario.notas ? '\nNotas: ' + usuario.notas : ''}
    `;
    
    alert(info);
}

function editarUsuario(cedula) {
    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
    const usuario = usuarios.find(u => u.cedula === cedula);
    
    if (!usuario) return;
    
    document.getElementById('tituloModalUsuario').textContent = 'Editar Usuario';
    document.getElementById('usuarioNombre').value = usuario.nombre;
    document.getElementById('usuarioCedula').value = usuario.cedula;
    document.getElementById('usuarioCedula').disabled = true;
    document.getElementById('usuarioTelefono').value = usuario.telefono;
    document.getElementById('usuarioEmail').value = usuario.email.includes('@temp.local') ? '' : usuario.email;
    document.getElementById('usuarioTipo').value = usuario.tipoUsuario;
    document.getElementById('usuarioPassword').value = usuario.password;
    document.getElementById('usuarioNotas').value = usuario.notas || '';
    document.getElementById('usuarioId').value = cedula;
    
    document.getElementById('formUsuario').style.display = 'block';
    document.getElementById('resultadoRegistro').style.display = 'none';
    document.getElementById('modalUsuario').style.display = 'flex';
}

function eliminarUsuario(cedula) {
    if (!confirm('¿Estás seguro de eliminar este usuario? Esta acción no se puede deshacer.')) {
        return;
    }
    
    let usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
    usuarios = usuarios.filter(u => u.cedula !== cedula);
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
    
    cargarUsuarios();
}

function imprimirCredenciales() {
    window.print();
}

function copiarCredenciales() {
    const nombre = document.getElementById('resultNombre').textContent;
    const paleta = document.getElementById('resultPaleta').textContent;
    const usuario = document.getElementById('resultUsuario').textContent;
    const password = document.getElementById('resultPassword').textContent;
    
    const texto = `
CREDENCIALES DE ACCESO
Subastas Ganaderas Casanare
â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”

Nombre: ${nombre}
Paleta Digital: ${paleta}
Usuario: ${usuario}
Contraseña: ${password}

Ingrese a: [URL de la plataforma]
    `;
    
    navigator.clipboard.writeText(texto).then(() => {
        alert('Credenciales copiadas al portapapeles');
    });
}

// Resultados
function cargarResultados() {
    const resultados = JSON.parse(localStorage.getItem('resultadosSubastas') || '[]');
    const tabla = document.getElementById('tablaResultados');
    tabla.innerHTML = '';
    
    if (resultados.length === 0) {
        tabla.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 40px; color: #94a3b8;">No hay resultados disponibles</td></tr>';
        return;
    }
    
    resultados.forEach(resultado => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>Lote #${resultado.lote}</td>
            <td>#${resultado.ganador}</td>
            <td>${formatearPrecio(resultado.precioFinal)}</td>
            <td>${resultado.totalPujas}</td>
            <td>${formatearFecha(resultado.fecha)}</td>
        `;
        tabla.appendChild(tr);
    });
}

// Reportes Financieros
function cargarReportesFinancieros() {
    const resultados = JSON.parse(localStorage.getItem('resultadosSubastas') || '[]');
    
    if (resultados.length === 0) {
        // Generar datos de ejemplo para demostración
        generarDatosEjemplo();
        return;
    }
    
    calcularReportes(resultados);
}

function generarDatosEjemplo() {
    const categorias = ['MC', 'ML', 'TP', 'VP', 'NL', 'VH'];
    const razas = ['Brahman', 'Cebú', 'Angus', 'Simmental', 'Gyr', 'Mestizo'];
    const datosEjemplo = [];
    const meses = ['2025-10', '2025-11', '2025-12', '2026-01', '2026-02', '2026-03'];

    meses.forEach((mes, mi) => {
        const lotesDelMes = Math.floor(Math.random() * 10) + 15;
        for (let i = 0; i < lotesDelMes; i++) {
            const pesoTotal = (Math.floor(Math.random() * 15) + 5) * (Math.floor(Math.random() * 200) + 300);
            const precioKilo = Math.floor(Math.random() * 1500) + 4500;
            datosEjemplo.push({
                lote: datosEjemplo.length + 1,
                ganador: Math.floor(Math.random() * 900) + 100,
                precioFinal: pesoTotal * precioKilo,
                pesoTotal,
                precioKilo,
                categoria: categorias[Math.floor(Math.random() * categorias.length)],
                raza: razas[Math.floor(Math.random() * razas.length)],
                totalPujas: Math.floor(Math.random() * 18) + 4,
                fecha: new Date(mes + '-' + String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')).toISOString(),
                esPresencial: Math.random() > 0.45
            });
        }
    });

    localStorage.setItem('resultadosSubastas', JSON.stringify(datosEjemplo));
    calcularReportes(datosEjemplo);
}

function calcularReportes(resultados) {
    const volumenTotal      = resultados.reduce((s, r) => s + r.precioFinal, 0);
    const lotesSubastados   = resultados.length;
    const comisionCompradores = volumenTotal * 0.08;
    const comisionVendedores  = volumenTotal * 0.03;
    const totalComisiones     = comisionCompradores + comisionVendedores;
    const participantesUnicos = new Set(resultados.map(r => r.ganador)).size;
    const precioPromedio      = volumenTotal / lotesSubastados;
    const pujasPromedio       = resultados.reduce((s, r) => s + r.totalPujas, 0) / lotesSubastados;
    const pesoTotalKg         = resultados.reduce((s, r) => s + (r.pesoTotal || 0), 0);
    // Usar precioKilo directo si está disponible, sino calcular desde pesoTotal
    const precioKiloPromedio  = pesoTotalKg
        ? Math.round(volumenTotal / pesoTotalKg)
        : Math.round(resultados.reduce((s, r) => s + (r.precioKilo || 0), 0) / resultados.filter(r => r.precioKilo).length) || 0;
    const margenOperativo     = ((totalComisiones / volumenTotal) * 100).toFixed(1);

    // Eventos simulados (1 evento cada ~20 lotes)
    const numEventos = Math.max(1, Math.round(lotesSubastados / 20));

    // â”€â”€ KPIs â”€â”€
    document.getElementById('totalComisiones').textContent    = formatearPrecio(totalComisiones);
    document.getElementById('volumenTotal').textContent       = formatearPrecio(volumenTotal);
    document.getElementById('lotesSubastados').textContent    = lotesSubastados;
    document.getElementById('participantesActivos').textContent = participantesUnicos;
    document.getElementById('precioKiloPromedio').textContent = formatearPrecio(precioKiloPromedio) + '/kg';
    document.getElementById('margenOperativo').textContent    = margenOperativo + '%';

    document.getElementById('cambioComisiones').textContent   = '+12.5%';
    document.getElementById('cambioVolumen').textContent      = '+8.3%';
    document.getElementById('cambioLotes').textContent        = '+15.2%';
    document.getElementById('cambioParticipantes').textContent = '+6.7%';
    document.getElementById('cambioPrecioKilo').textContent   = '+4.1%';
    document.getElementById('cambioMargen').textContent       = 'estable';

    // â”€â”€ Comisiones â”€â”€
    document.getElementById('comisionClientes').textContent   = formatearPrecio(comisionCompradores);
    document.getElementById('comisionVendedores').textContent = formatearPrecio(comisionVendedores);
    document.getElementById('comisionTotal').textContent      = formatearPrecio(totalComisiones);

    // â”€â”€ Métricas operativas â”€â”€
    document.getElementById('precioPromedio').textContent     = formatearPrecio(precioPromedio);
    document.getElementById('pujasPromedio').textContent      = Math.round(pujasPromedio);
    document.getElementById('tasaConversion').textContent     = '92%';
    document.getElementById('tiempoPromedio').textContent     = '7 min';
    document.getElementById('ingresoPorEvento').textContent   = formatearPrecio(totalComisiones / numEventos);
    document.getElementById('lotesPorEvento').textContent     = Math.round(lotesSubastados / numEventos);

    // â”€â”€ Semáforo â”€â”€
    renderizarSemaforo({
        volumenTotal, totalComisiones, lotesSubastados,
        participantesUnicos, pujasPromedio, precioKiloPromedio
    });

    // â”€â”€ Gráfico de tendencia mensual â”€â”€
    renderizarGraficoBarra(resultados);

    // â”€â”€ Categorías â”€â”€
    renderizarCategorias(resultados);

    // â”€â”€ Canal coliseo vs remoto â”€â”€
    const presenciales = resultados.filter(r => r.esPresencial).length;
    const remotos      = resultados.length - presenciales;
    const pctP = ((presenciales / resultados.length) * 100).toFixed(1);
    const pctR = ((remotos / resultados.length) * 100).toFixed(1);

    document.getElementById('pujasPresenciales').textContent  = (presenciales * Math.round(pujasPromedio)).toLocaleString('es-CO');
    document.getElementById('porcentajePresencial').textContent = pctP + '%';
    document.getElementById('ganadorasPresencial').textContent = presenciales;
    document.getElementById('pujasRemotas').textContent        = (remotos * Math.round(pujasPromedio)).toLocaleString('es-CO');
    document.getElementById('porcentajeRemoto').textContent    = pctR + '%';
    document.getElementById('ganadorasRemoto').textContent     = remotos;
    renderizarCanalBarra(parseFloat(pctP));

    // â”€â”€ Top compradores â”€â”€
    const clientes = {};
    resultados.forEach(r => {
        if (!clientes[r.ganador]) clientes[r.ganador] = { lotes: 0, total: 0 };
        clientes[r.ganador].lotes++;
        clientes[r.ganador].total += r.precioFinal;
    });
    renderizarRanking('topClientes', Object.entries(clientes).sort((a, b) => b[1].total - a[1].total).slice(0, 5), 'cliente');

    // â”€â”€ Proyecciones â”€â”€
    const proyeccionMensual = totalComisiones / Math.max(1, resultados.length / (lotesSubastados / numEventos));
    document.getElementById('proyeccionMensual').textContent = formatearPrecio(totalComisiones / numEventos);
    document.getElementById('proyeccionAnual').textContent   = formatearPrecio((totalComisiones / numEventos) * 12);
    document.getElementById('roiSistema').textContent        = '+450%';

    // â”€â”€ Resumen ejecutivo â”€â”€
    generarResumenEjecutivo({ totalComisiones, volumenTotal, lotesSubastados, participantesUnicos, precioPromedio, proyeccionAnual: (totalComisiones / numEventos) * 12, precioKiloPromedio, margenOperativo });
}

function renderizarSemaforo(d) {
    const indicadores = [
        { label: 'Volumen mensual',       valor: formatearPrecio(d.volumenTotal),       estado: d.volumenTotal > 200000000 ? 'verde' : d.volumenTotal > 100000000 ? 'amarillo' : 'rojo',  meta: '> $200M' },
        { label: 'Comisiones generadas',  valor: formatearPrecio(d.totalComisiones),    estado: d.totalComisiones > 20000000 ? 'verde' : d.totalComisiones > 10000000 ? 'amarillo' : 'rojo', meta: '> $20M' },
        { label: 'Lotes subastados',      valor: d.lotesSubastados,                     estado: d.lotesSubastados >= 20 ? 'verde' : d.lotesSubastados >= 10 ? 'amarillo' : 'rojo',          meta: 'â‰¥ 20 lotes' },
        { label: 'Participantes únicos',  valor: d.participantesUnicos,                 estado: d.participantesUnicos >= 15 ? 'verde' : d.participantesUnicos >= 8 ? 'amarillo' : 'rojo',   meta: 'â‰¥ 15' },
        { label: 'Pujas por lote',        valor: Math.round(d.pujasPromedio),           estado: d.pujasPromedio >= 8 ? 'verde' : d.pujasPromedio >= 5 ? 'amarillo' : 'rojo',               meta: 'â‰¥ 8 pujas' },
        { label: 'Precio promedio / kg',  valor: formatearPrecio(d.precioKiloPromedio) + '/kg', estado: d.precioKiloPromedio >= 5000 ? 'verde' : d.precioKiloPromedio >= 4000 ? 'amarillo' : 'rojo', meta: 'â‰¥ $5.000/kg' },
    ];
    const colores = { verde: '#16a34a', amarillo: '#d97706', rojo: '#dc2626' };
    const iconos  = { verde: 'check-circle', amarillo: 'alert-circle', rojo: 'x-circle' };

    document.getElementById('semaforoGrid').innerHTML = indicadores.map(ind => `
        <div class="semaforo-item semaforo-${ind.estado}">
            <div class="semaforo-dot" style="background:${colores[ind.estado]}"></div>
            <div class="semaforo-info">
                <span class="semaforo-label">${ind.label}</span>
                <span class="semaforo-valor">${ind.valor}</span>
                <span class="semaforo-meta">Meta: ${ind.meta}</span>
            </div>
        </div>
    `).join('');
    lucide.createIcons();
}

function renderizarGraficoBarra(resultados) {
    // Agrupar por mes
    const porMes = {};
    resultados.forEach(r => {
        const mes = r.fecha ? r.fecha.substring(0, 7) : 'N/A';
        if (!porMes[mes]) porMes[mes] = 0;
        porMes[mes] += r.precioFinal * 0.11; // comisión total 11%
    });

    const meses = Object.keys(porMes).sort().slice(-6);
    const valores = meses.map(m => porMes[m]);
    const maxVal  = Math.max(...valores);

    const labels = { '01': 'Ene', '02': 'Feb', '03': 'Mar', '04': 'Abr', '05': 'May', '06': 'Jun', '07': 'Jul', '08': 'Ago', '09': 'Sep', '10': 'Oct', '11': 'Nov', '12': 'Dic' };

    const barras = meses.map((mes, i) => {
        const pct   = maxVal ? Math.round((valores[i] / maxVal) * 100) : 0;
        const label = labels[mes.split('-')[1]] || mes;
        return `
            <div class="barra-col">
                <span class="barra-val">${formatearPrecio(Math.round(valores[i] / 1000000))}M</span>
                <div class="barra-bar" style="height:${Math.max(pct, 4)}%"></div>
                <span class="barra-mes">${label}</span>
            </div>`;
    }).join('');

    document.getElementById('graficoBarra').innerHTML = `<div class="barra-chart">${barras}</div>`;
}

function renderizarCategorias(resultados) {
    const porCat = {};
    resultados.forEach(r => {
        const cat = r.categoria || 'N/A';
        if (!porCat[cat]) porCat[cat] = { lotes: 0, volumen: 0 };
        porCat[cat].lotes++;
        porCat[cat].volumen += r.precioFinal;
    });

    const total = Object.values(porCat).reduce((s, c) => s + c.volumen, 0);
    const sorted = Object.entries(porCat).sort((a, b) => b[1].volumen - a[1].volumen);

    document.getElementById('categoriasList').innerHTML = sorted.map(([cod, d]) => {
        const pct = total ? Math.round((d.volumen / total) * 100) : 0;
        return `
            <div class="cat-reporte-item">
                <div class="cat-reporte-top">
                    <span class="cat-reporte-cod">${cod}</span>
                    <span class="cat-reporte-lotes">${d.lotes} lotes</span>
                    <span class="cat-reporte-vol">${formatearPrecio(d.volumen)}</span>
                    <span class="cat-reporte-pct">${pct}%</span>
                </div>
                <div class="cat-reporte-barra"><div style="width:${pct}%;background:var(--primary-orange)"></div></div>
            </div>`;
    }).join('');
}

function renderizarCanalBarra(pctPresencial) {
    const pctRemoto = (100 - pctPresencial).toFixed(1);
    document.getElementById('canalBarra').innerHTML = `
        <div class="canal-seg presencial" style="width:${pctPresencial}%" title="Coliseo ${pctPresencial}%"></div>
        <div class="canal-seg remoto"     style="width:${pctRemoto}%"    title="Remoto ${pctRemoto}%"></div>
    `;
}

function renderizarRanking(elementId, datos, tipo) {
    const container = document.getElementById(elementId);
    container.innerHTML = '';
    
    datos.forEach(([nombre, stats], index) => {
        const positionClass = index === 0 ? 'gold' : index === 1 ? 'silver' : index === 2 ? 'bronze' : '';
        
        const item = document.createElement('div');
        item.className = 'ranking-item';
        item.innerHTML = `
            <div class="ranking-position ${positionClass}">${index + 1}</div>
            <div class="ranking-info">
                <span class="ranking-name">${tipo === 'cliente' ? '#' + nombre : nombre}</span>
                <span class="ranking-detail">${stats.lotes} lotes</span>
            </div>
            <div class="ranking-value">${formatearPrecio(stats.total)}</div>
        `;
        container.appendChild(item);
    });
}

function generarResumenEjecutivo(d) {
    // â”€â”€ Evaluar alertas desde los datos reales â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    const alertas = [];

    // Precio/kg vs referente de mercado ($5.200/kg en Casanare)
    const REFERENTE_KILO = 5200;
    const difKilo = d.precioKiloPromedio - REFERENTE_KILO;
    const pctKilo = ((difKilo / REFERENTE_KILO) * 100).toFixed(1);

    if (!d.precioKiloPromedio) {
        // Sin datos de peso, mostrar alerta informativa
        alertas.push({ nivel: 'atencion', icon: 'scale',
            titulo: 'Precio/kg no disponible en este período',
            detalle: `Los lotes de este período no tienen datos de peso registrados. Para activar el análisis por kilo, asegúrate de registrar el peso total en cada lote.`,
            impacto: 'Referente regional: ' + formatearPrecio(REFERENTE_KILO) + '/kg' });
    } else if (d.precioKiloPromedio < REFERENTE_KILO * 0.92) {
        alertas.push({ nivel: 'critico', icon: 'trending-down',
            titulo: `Precio/kg un ${Math.abs(pctKilo)}% por debajo del mercado`,
            detalle: `Tu promedio es ${formatearPrecio(d.precioKiloPromedio)}/kg vs referente regional ${formatearPrecio(REFERENTE_KILO)}/kg. Impacto estimado: ${formatearPrecio(Math.abs(difKilo) * (d.volumenTotal / d.precioKiloPromedio / 1000))} menos en comisiones.`,
            impacto: formatearPrecio(Math.abs(difKilo * 500)) + ' potencial perdido' });
    } else if (d.precioKiloPromedio >= REFERENTE_KILO) {
        alertas.push({ nivel: 'positivo', icon: 'trending-up',
            titulo: `Precio/kg ${pctKilo}% sobre el referente de mercado`,
            detalle: `Promedio de ${formatearPrecio(d.precioKiloPromedio)}/kg supera el referente regional. Señal de alta competencia entre compradores.`,
            impacto: 'Ventaja competitiva activa' });
    }

    // Participantes
    if (d.participantesUnicos < 10) {
        alertas.push({ nivel: 'critico', icon: 'users',
            titulo: `Solo ${d.participantesUnicos} compradores activos este período`,
            detalle: `Por debajo del mínimo saludable de 15 participantes. Menor competencia reduce precios finales y comisiones.`,
            impacto: 'Riesgo de caída en precios' });
    } else if (d.participantesUnicos >= 20) {
        alertas.push({ nivel: 'positivo', icon: 'users',
            titulo: `${d.participantesUnicos} compradores activos â€” récord del período`,
            detalle: `Alta participación genera mayor competencia y mejores precios de adjudicación.`,
            impacto: '+' + Math.round((d.participantesUnicos - 15) * 2) + '% en precio promedio estimado' });
    } else {
        alertas.push({ nivel: 'atencion', icon: 'user-check',
            titulo: `${d.participantesUnicos} compradores activos â€” margen de crecimiento`,
            detalle: `Nivel aceptable pero con potencial. Cada comprador adicional genera en promedio ${formatearPrecio(Math.round(d.totalComisiones / d.participantesUnicos))} en comisiones.`,
            impacto: 'Oportunidad de captación' });
    }

    // Lotes subastados
    if (d.lotesSubastados < 15) {
        alertas.push({ nivel: 'atencion', icon: 'package',
            titulo: `${d.lotesSubastados} lotes subastados â€” volumen bajo`,
            detalle: `Para maximizar ingresos operativos se recomienda un mínimo de 20 lotes por evento. Cada lote adicional genera ${formatearPrecio(Math.round(d.totalComisiones / d.lotesSubastados))} en comisiones.`,
            impacto: formatearPrecio(Math.round(d.totalComisiones / d.lotesSubastados) * (20 - d.lotesSubastados)) + ' de ingreso potencial' });
    }

    // Margen operativo
    if (parseFloat(d.margenOperativo) >= 10) {
        alertas.push({ nivel: 'positivo', icon: 'percent',
            titulo: `Margen operativo del ${d.margenOperativo}% â€” saludable`,
            detalle: `La combinación de comisión compradores (8%) + vendedores (3%) genera un margen sólido sobre el volumen transado.`,
            impacto: formatearPrecio(d.totalComisiones) + ' en comisiones totales' });
    }

    // â”€â”€ Evaluar decisiones pendientes â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    const decisiones = [];

    // Decisión 1: ajuste de precio base
    if (d.precioKiloPromedio < REFERENTE_KILO * 0.95) {
        decisiones.push({
            icon: 'scale',
            urgencia: 'alta',
            pregunta: '¿Ajustar precio base del próximo evento?',
            contexto: `Referente mercado: ${formatearPrecio(REFERENTE_KILO)}/kg &nbsp;|&nbsp; Tu promedio: ${formatearPrecio(d.precioKiloPromedio)}/kg`,
            impacto: `Ajustar +${Math.round((REFERENTE_KILO - d.precioKiloPromedio) * 0.5)}/kg generaría ~${formatearPrecio(Math.round((REFERENTE_KILO - d.precioKiloPromedio) * 0.5 * (d.volumenTotal / d.precioKiloPromedio) * 0.11))} adicionales en comisiones`,
            acciones: [
                { label: 'Sí, ajustar precio base', estilo: 'btn-decision-si', onclick: "registrarDecision('precio_base', 'si')" },
                { label: 'No por ahora',             estilo: 'btn-decision-no', onclick: "registrarDecision('precio_base', 'no')" },
            ]
        });
    }

    // Decisión 2: campaña de reactivación si participantes bajos
    if (d.participantesUnicos < 15) {
        const potencial = formatearPrecio(Math.round((15 - d.participantesUnicos) * (d.totalComisiones / d.participantesUnicos)));
        decisiones.push({
            icon: 'megaphone',
            urgencia: 'alta',
            pregunta: '¿Activar campaña para compradores inactivos?',
            contexto: `${15 - d.participantesUnicos} compradores potenciales sin participar este período`,
            impacto: `Recuperar esos compradores representaría ~${potencial} adicionales en comisiones`,
            acciones: [
                { label: 'Sí, activar campaña', estilo: 'btn-decision-si', onclick: "registrarDecision('campana_reactivacion', 'si')" },
                { label: 'Posponer',             estilo: 'btn-decision-no', onclick: "registrarDecision('campana_reactivacion', 'no')" },
            ]
        });
    }

    // Decisión 3: aumentar lotes si volumen bajo
    if (d.lotesSubastados < 20) {
        decisiones.push({
            icon: 'plus-circle',
            urgencia: 'media',
            pregunta: '¿Ampliar convocatoria de vendedores para el próximo evento?',
            contexto: `${d.lotesSubastados} lotes este período â€” meta recomendada: 20+`,
            impacto: `${20 - d.lotesSubastados} lotes adicionales generarían ~${formatearPrecio(Math.round((d.totalComisiones / d.lotesSubastados) * (20 - d.lotesSubastados)))} más en comisiones`,
            acciones: [
                { label: 'Sí, ampliar convocatoria', estilo: 'btn-decision-si', onclick: "registrarDecision('ampliar_lotes', 'si')" },
                { label: 'Mantener actual',           estilo: 'btn-decision-no', onclick: "registrarDecision('ampliar_lotes', 'no')" },
            ]
        });
    }

    // Decisión 4: siempre presente â€” próximo evento
    decisiones.push({
        icon: 'calendar-plus',
        urgencia: 'media',
        pregunta: '¿Programar el próximo evento de subasta?',
        contexto: `Frecuencia recomendada: mensual. Último evento registrado en el sistema.`,
        impacto: `Mantener cadencia mensual proyecta ${formatearPrecio(Math.round(d.totalComisiones / 6 * 12))} anuales en comisiones`,
        acciones: [
            { label: 'Ir a programar evento', estilo: 'btn-decision-si', onclick: "mostrarSeccion('eventos')" },
            { label: 'Recordar más tarde',    estilo: 'btn-decision-no', onclick: "registrarDecision('programar_evento', 'no')" },
        ]
    });

    // â”€â”€ Renderizar alertas â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    const niveles = { critico: { color: '#dc2626', bg: '#fef2f2', border: '#fecaca', label: 'CRÍTICO' },
                      atencion: { color: '#d97706', bg: '#fffbeb', border: '#fde68a', label: 'ATENCIÓN' },
                      positivo: { color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0', label: 'POSITIVO' } };

    document.getElementById('ejecutivoFecha').textContent =
        'Generado: ' + new Date().toLocaleDateString('es-CO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    const criticos = alertas.filter(a => a.nivel === 'critico').length;
    const badge = document.getElementById('ejecutivoBadge');
    badge.textContent = criticos > 0 ? `${criticos} alerta${criticos > 1 ? 's' : ''} crítica${criticos > 1 ? 's' : ''}` : 'Sin alertas críticas';
    badge.className = 'ejecutivo-badge ' + (criticos > 0 ? 'badge-critico' : 'badge-ok');

    document.getElementById('alertasNegocio').innerHTML = alertas.map(a => {
        const n = niveles[a.nivel];
        return `
        <div class="alerta-item" style="background:${n.bg};border-color:${n.border};">
            <div class="alerta-icono" style="color:${n.color}"><i data-lucide="${a.icon}"></i></div>
            <div class="alerta-body">
                <div class="alerta-top">
                    <span class="alerta-nivel" style="color:${n.color};background:${n.border}">${n.label}</span>
                    <span class="alerta-titulo">${a.titulo}</span>
                </div>
                <p class="alerta-detalle">${a.detalle}</p>
                <span class="alerta-impacto"><i data-lucide="zap"></i> ${a.impacto}</span>
            </div>
        </div>`;
    }).join('');

    // â”€â”€ Renderizar decisiones â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    const urgenciaColor = { alta: '#dc2626', media: '#d97706' };

    document.getElementById('decisionesPendientes').innerHTML = decisiones.map(dec => `
        <div class="decision-card">
            <div class="decision-icon"><i data-lucide="${dec.icon}"></i></div>
            <div class="decision-body">
                <div class="decision-top">
                    <span class="decision-urgencia" style="color:${urgenciaColor[dec.urgencia]}">
                        ${dec.urgencia === 'alta' ? 'Requiere decisión' : 'Pendiente'}
                    </span>
                    <h4 class="decision-pregunta">${dec.pregunta}</h4>
                </div>
                <p class="decision-contexto">${dec.contexto}</p>
                <div class="decision-impacto"><i data-lucide="trending-up"></i> ${dec.impacto}</div>
                <div class="decision-acciones">
                    ${dec.acciones.map(a => `<button class="${a.estilo}" onclick="${a.onclick}">${a.label}</button>`).join('')}
                </div>
            </div>
        </div>`).join('');

    lucide.createIcons();
}

function registrarDecision(tipo, respuesta) {
    const decisiones = JSON.parse(localStorage.getItem('decisiones_gerencia') || '[]');
    decisiones.push({ tipo, respuesta, fecha: new Date().toISOString() });
    localStorage.setItem('decisiones_gerencia', JSON.stringify(decisiones));

    const msgs = {
        si: { precio_base: 'Ajuste de precio base registrado. Ve a Configuración para aplicarlo.',
              campana_reactivacion: 'Campaña registrada. Contacta a los compradores inactivos desde Usuarios.',
              ampliar_lotes: 'Convocatoria ampliada registrada. Notifica a los vendedores.',
              programar_evento: '' },
        no: { precio_base: 'Decisión registrada: mantener precio base actual.',
              campana_reactivacion: 'Pospuesto. Se recordará en el próximo reporte.',
              ampliar_lotes: 'Registrado: mantener volumen actual de lotes.',
              programar_evento: 'Recordatorio guardado.' }
    };

    const msg = msgs[respuesta]?.[tipo];
    if (msg) {
        const toast = document.createElement('div');
        toast.className = 'decision-toast';
        toast.innerHTML = `<i data-lucide="check-circle"></i> ${msg}`;
        document.body.appendChild(toast);
        lucide.createIcons();
        setTimeout(() => toast.remove(), 4000);
    }

    if (tipo === 'programar_evento' && respuesta === 'si') mostrarSeccion('eventos');
}

function actualizarReportes() { cargarReportesFinancieros(); }

function exportarLotesPDF() {
    const cols = [
        { titulo: 'Lote #',      campo: 'numero' },
        { titulo: 'Tipo',        campo: 'tipo' },
        { titulo: 'Cantidad',    campo: 'cantidad' },
        { titulo: 'Peso Prom.',  campo: 'peso' },
        { titulo: 'Raza',        campo: 'raza' },
        { titulo: 'Vendedor',    campo: 'vendedor' },
        { titulo: 'Precio Base', campo: 'precioBaseF' },
        { titulo: 'Estado',      campo: 'estado' }
    ];
    const filas = lotes.map(l => ({ ...l, precioBaseF: formatearPrecio(l.precioBase) }));
    exportarPDF('Gestión de Lotes', cols, filas, 'lotes-subasta', { 'Total lotes': lotes.length });
}

function exportarUsuariosExcel() {
    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
    const cols = [
        { titulo: 'Paleta',    campo: 'numeroPaleta' },
        { titulo: 'Nombre',    campo: 'nombre' },
        { titulo: 'Cédula',    campo: 'cedula' },
        { titulo: 'Teléfono',  campo: 'telefono' },
        { titulo: 'Email',     campo: 'email' },
        { titulo: 'Tipo',      campo: 'tipoUsuario' },
        { titulo: 'Registro',  campo: 'fechaRegistro' }
    ];
    const filas = usuarios.map(u => ({
        ...u,
        numeroPaleta: u.numeroPaleta ? '#' + u.numeroPaleta : 'N/A',
        fechaRegistro: formatearFecha(u.fechaRegistro)
    }));
    exportarExcel(cols, filas, 'usuarios');
}

function exportarUsuariosPDF() {
    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
    const cols = [
        { titulo: 'Paleta',   campo: 'numeroPaleta' },
        { titulo: 'Nombre',   campo: 'nombre' },
        { titulo: 'Cédula',   campo: 'cedula' },
        { titulo: 'Teléfono', campo: 'telefono' },
        { titulo: 'Tipo',     campo: 'tipoUsuario' },
        { titulo: 'Registro', campo: 'fechaRegistro' }
    ];
    const filas = usuarios.map(u => ({
        ...u,
        numeroPaleta: u.numeroPaleta ? '#' + u.numeroPaleta : 'N/A',
        fechaRegistro: formatearFecha(u.fechaRegistro)
    }));
    exportarPDF('Gestión de Usuarios', cols, filas, 'usuarios', {
        'Total': usuarios.length,
        'Clientes': usuarios.filter(u => u.tipoUsuario === 'cliente').length,
        'Martilleros': usuarios.filter(u => u.tipoUsuario === 'martillero').length
    });
}

// Utilidades
function formatearPrecio(precio) {
    return '$' + precio.toLocaleString('es-CO');
}

function formatearFecha(fecha) {
    const date = new Date(fecha);
    return date.toLocaleDateString('es-CO', { year: 'numeric', month: 'short', day: 'numeric' });
}

function cerrarSesion() {
    localStorage.removeItem('usuarioActual');
    window.location.href = 'index.html';
}

// â”€â”€ Aprobaciones â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function cargarAprobaciones() {
    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
    const pendientes = usuarios.filter(u => u.estado === 'pendiente');
    const tabla = document.getElementById('tablaAprobaciones');
    tabla.innerHTML = '';

    // Actualizar badge del nav
    const badge = document.getElementById('badgeAprobaciones');
    if (pendientes.length > 0) {
        badge.textContent = pendientes.length;
        badge.style.display = 'inline-block';
    } else {
        badge.style.display = 'none';
    }

    if (pendientes.length === 0) {
        tabla.innerHTML = '<tr><td colspan="8" style="text-align:center;padding:40px;color:#94a3b8;">No hay solicitudes pendientes</td></tr>';
        return;
    }

    pendientes.forEach(u => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><strong>${u.nombre}</strong></td>
            <td>${u.cedula}</td>
            <td>${u.email}</td>
            <td>${u.telefono}</td>
            <td><span class="badge badge-pendiente">${u.tipoUsuario.toUpperCase()}</span></td>
            <td>${formatearFecha(u.fechaRegistro)}</td>
            <td><i data-lucide="file-text"></i> Ver RUT</button></td>
            <td>
                <button class="btn-aprobar" title="Aprobar" onclick="aprobarUsuario('${u.cedula}')"><i data-lucide="check-circle"></i></button>
                <button class="btn-rechazar" title="Rechazar" onclick="rechazarUsuario('${u.cedula}')"><i data-lucide="x-circle"></i></button>
            </td>
        `;
        tabla.appendChild(tr);
    });
    lucide.createIcons();
}

function aprobarUsuario(cedula) {
    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
    const idx = usuarios.findIndex(u => u.cedula === cedula);
    if (idx === -1) return;
    usuarios[idx].estado = 'activo';
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
    cargarAprobaciones();
    cargarUsuarios();
    alert(`âœ… Usuario ${usuarios[idx].nombre} aprobado correctamente.`);
}

function rechazarUsuario(cedula) {
    if (!confirm('¿Rechazar y eliminar esta solicitud?')) return;
    let usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
    usuarios = usuarios.filter(u => u.cedula !== cedula);
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
    cargarAprobaciones();
}

function verRut(cedula) {
    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
    const usuario = usuarios.find(u => u.cedula === cedula);
    if (!usuario || !usuario.rutArchivo) {
        alert('No se encontró el archivo RUT.');
        return;
    }
    document.getElementById('rutSolicitanteNombre').textContent = `Solicitante: ${usuario.nombre} â€” ${usuario.rutNombre}`;
    const viewer = document.getElementById('rutViewer');
    if (usuario.rutArchivo.startsWith('data:application/pdf')) {
        viewer.innerHTML = `<iframe src="${usuario.rutArchivo}" width="100%" height="500px"></iframe>`;
    } else {
        viewer.innerHTML = `<img src="${usuario.rutArchivo}" alt="RUT de ${usuario.nombre}">`;
    }
    document.getElementById('modalRut').style.display = 'flex';
}

// Cargar sección inicial
cargarEventos();

// â”€â”€ Solicitudes de Paleta â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function cargarSolicitudesPaleta() {
    document.getElementById('eventoIdPaletas').textContent = EVENTO_ID_ADMIN;

    const solicitudesKey = `solicitudes_paleta_${EVENTO_ID_ADMIN}`;
    const solicitudes = JSON.parse(localStorage.getItem(solicitudesKey) || '[]');
    const tabla = document.getElementById('tablaSolicitudesPaleta');
    tabla.innerHTML = '';

    // Actualizar badge
    const pendientes = solicitudes.filter(s => s.estado === 'pendiente').length;
    const badge = document.getElementById('badgePaletas');
    if (badge) {
        badge.textContent = pendientes;
        badge.style.display = pendientes > 0 ? 'inline-block' : 'none';
    }

    if (solicitudes.length === 0) {
        tabla.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:40px;color:#94a3b8;">No hay solicitudes de paleta</td></tr>';
        return;
    }

    solicitudes.forEach((s, idx) => {
        const tr = document.createElement('tr');
        const hora = new Date(s.timestamp).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });
        const paletaKey = `paleta_${EVENTO_ID_ADMIN}_${s.email}`;
        const paletaAsignada = localStorage.getItem(paletaKey);

        const estadoBadge = s.estado === 'pendiente'
            ? '<span class="badge badge-pendiente">PENDIENTE</span>'
            : s.estado === 'aprobada'
                ? '<span class="badge badge-activo">APROBADA</span>'
                : '<span class="badge badge-rechazado">RECHAZADA</span>';

        const acciones = s.estado === 'pendiente'
            ? `<button class="btn-aprobar" title="Aprobar" onclick="aprobarPaleta(${idx})"><i data-lucide="check-circle"></i></button>
               <button class="btn-rechazar" title="Rechazar" onclick="rechazarPaleta(${idx})"><i data-lucide="x-circle"></i></button>`
            : `<span style="color:#94a3b8;font-size:0.85em;">${s.estado === 'aprobada' ? 'Aprobada' : 'Rechazada'}</span>`;

        tr.innerHTML = `
            <td>${s.nombre}</td>
            <td>${s.email}</td>
            <td>${hora}</td>
            <td>${estadoBadge}</td>
            <td>${paletaAsignada ? '<strong>#' + paletaAsignada + '</strong>' : 'â€”'}</td>
            <td>${acciones}</td>
        `;
        tabla.appendChild(tr);
    });
    lucide.createIcons();
}

function aprobarPaleta(idx) {
    const solicitudesKey = `solicitudes_paleta_${EVENTO_ID_ADMIN}`;
    const solicitudes = JSON.parse(localStorage.getItem(solicitudesKey) || '[]');
    const solicitud = solicitudes[idx];
    if (!solicitud) return;

    // Generar número de paleta único
    const paletasUsadasKey = `paletas_usadas_${EVENTO_ID_ADMIN}`;
    const paletasUsadas = JSON.parse(localStorage.getItem(paletasUsadasKey) || '[]');
    let numero;
    do { numero = Math.floor(Math.random() * 900) + 100; }
    while (paletasUsadas.includes(numero));
    paletasUsadas.push(numero);
    localStorage.setItem(paletasUsadasKey, JSON.stringify(paletasUsadas));

    // Asignar paleta al cliente
    const paletaKey = `paleta_${EVENTO_ID_ADMIN}_${solicitud.email}`;
    localStorage.setItem(paletaKey, String(numero));

    // Marcar solicitud como aprobada
    solicitudes[idx].estado = 'aprobada';
    localStorage.setItem(solicitudesKey, JSON.stringify(solicitudes));

    cargarSolicitudesPaleta();
    alert(`âœ… Paleta #${numero} asignada a ${solicitud.nombre}`);
}

function rechazarPaleta(idx) {
    if (!confirm('¿Rechazar esta solicitud de paleta?')) return;
    const solicitudesKey = `solicitudes_paleta_${EVENTO_ID_ADMIN}`;
    const solicitudes = JSON.parse(localStorage.getItem(solicitudesKey) || '[]');
    solicitudes[idx].estado = 'rechazada';
    localStorage.setItem(solicitudesKey, JSON.stringify(solicitudes));
    cargarSolicitudesPaleta();
}

// â”€â”€ Categorías de Ganado â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const CATEGORIAS_KEY = 'categorias_ganado';

const categoriasDefault = [
    { id: 1, codigo: 'ML', nombre: 'Macho de Levante',  sexo: 'macho',  descripcion: 'Machos jóvenes en etapa de levante' },
    { id: 2, codigo: 'MC', nombre: 'Macho de Ceba',     sexo: 'macho',  descripcion: 'Machos en etapa de engorde' },
    { id: 3, codigo: 'TP', nombre: 'Toro Puro',         sexo: 'macho',  descripcion: 'Toros de raza pura para reproducción' },
    { id: 4, codigo: 'NL', nombre: 'Novilla de Levante',sexo: 'hembra', descripcion: 'Hembras jóvenes en etapa de levante' },
    { id: 5, codigo: 'VP', nombre: 'Vaca Parida',       sexo: 'hembra', descripcion: 'Vacas con cría al pie' },
    { id: 6, codigo: 'VH', nombre: 'Vaca Horra',        sexo: 'hembra', descripcion: 'Vacas sin cría' },
];

let categoriasFiltroActual = 'todos';

function getCategorias() {
    const guardadas = localStorage.getItem(CATEGORIAS_KEY);
    if (!guardadas) {
        localStorage.setItem(CATEGORIAS_KEY, JSON.stringify(categoriasDefault));
        return categoriasDefault;
    }
    return JSON.parse(guardadas);
}

function cargarCategorias(filtro = categoriasFiltroActual) {
    categoriasFiltroActual = filtro;
    const todas = getCategorias();
    const lista = filtro === 'todos' ? todas : todas.filter(c => c.sexo === filtro);
    const grid = document.getElementById('categoriasGrid');
    grid.innerHTML = '';

    if (lista.length === 0) {
        grid.innerHTML = '<div class="cat-empty">No hay categorías para este filtro</div>';
        return;
    }

    lista.forEach(cat => {
        const sexoIcon  = cat.sexo === 'macho' ? 'â™‚' : cat.sexo === 'hembra' ? 'â™€' : 'âš¥';
        const sexoClass = cat.sexo;
        const card = document.createElement('div');
        card.className = `cat-card cat-card--${sexoClass}`;
        card.innerHTML = `
            <div class="cat-card-top">
                <span class="cat-codigo">${cat.codigo}</span>
                <span class="cat-sexo-badge cat-sexo--${sexoClass}">${sexoIcon} ${cat.sexo.charAt(0).toUpperCase() + cat.sexo.slice(1)}</span>
            </div>
            <div class="cat-nombre">${cat.nombre}</div>
            ${cat.descripcion ? `<div class="cat-desc">${cat.descripcion}</div>` : ''}
            <div class="cat-acciones">
                <button class="btn-action btn-edit" title="Editar" onclick="editarCategoria(${cat.id})"><i data-lucide="pencil"></i></button>
                <button class="btn-action btn-delete" title="Eliminar" onclick="eliminarCategoria(${cat.id})"><i data-lucide="trash-2"></i></button>
            </div>
        `;
        grid.appendChild(card);
    });
    lucide.createIcons();
}

function filtrarCategorias(filtro, btn) {
    document.querySelectorAll('.cat-filtro-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    cargarCategorias(filtro);
}

function abrirModalCategoria() {
    document.getElementById('tituloModalCategoria').textContent = 'Nueva Categoría';
    document.getElementById('formCategoria').reset();
    document.getElementById('categoriaEditId').value = '';
    document.getElementById('modalCategoria').style.display = 'flex';
}

function cerrarModalCategoria() {
    document.getElementById('modalCategoria').style.display = 'none';
}

function editarCategoria(id) {
    const cat = getCategorias().find(c => c.id === id);
    if (!cat) return;
    document.getElementById('tituloModalCategoria').textContent = 'Editar Categoría';
    document.getElementById('categoriaEditId').value = cat.id;
    document.getElementById('categoriaCodigo').value = cat.codigo;
    document.getElementById('categoriaNombre').value = cat.nombre;
    document.getElementById('categoriaSexo').value = cat.sexo;
    document.getElementById('categoriaDescripcion').value = cat.descripcion || '';
    document.getElementById('modalCategoria').style.display = 'flex';
}

function eliminarCategoria(id) {
    if (!confirm('¿Eliminar esta categoría?')) return;
    const cats = getCategorias().filter(c => c.id !== id);
    localStorage.setItem(CATEGORIAS_KEY, JSON.stringify(cats));
    cargarCategorias();
}

document.getElementById('formCategoria').addEventListener('submit', function(e) {
    e.preventDefault();
    const cats = getCategorias();
    const editId = parseInt(document.getElementById('categoriaEditId').value);
    const codigo = document.getElementById('categoriaCodigo').value.toUpperCase().trim();

    // Verificar código duplicado
    const duplicado = cats.find(c => c.codigo === codigo && c.id !== editId);
    if (duplicado) { alert(`El código "${codigo}" ya existe.`); return; }

    if (editId) {
        const idx = cats.findIndex(c => c.id === editId);
        cats[idx] = {
            ...cats[idx],
            codigo,
            nombre: document.getElementById('categoriaNombre').value.trim(),
            sexo: document.getElementById('categoriaSexo').value,
            descripcion: document.getElementById('categoriaDescripcion').value.trim()
        };
    } else {
        const nuevoId = cats.length ? Math.max(...cats.map(c => c.id)) + 1 : 1;
        cats.push({
            id: nuevoId,
            codigo,
            nombre: document.getElementById('categoriaNombre').value.trim(),
            sexo: document.getElementById('categoriaSexo').value,
            descripcion: document.getElementById('categoriaDescripcion').value.trim()
        });
    }

    localStorage.setItem(CATEGORIAS_KEY, JSON.stringify(cats));
    cerrarModalCategoria();
    cargarCategorias();
});

// Forzar mayúsculas en el campo código
document.getElementById('categoriaCodigo')?.addEventListener('input', function() {
    this.value = this.value.toUpperCase();
});
