// Verificar si hay sesión activa
const usuarioActual = JSON.parse(localStorage.getItem('usuarioActual'));

if (!usuarioActual) {
    window.location.href = 'index.html';
} else {
    inicializarDashboard();
}

function inicializarDashboard() {
    // Actualizar información del usuario
    document.getElementById('welcomeMsg').textContent = usuarioActual.nombre;
    
    // Solo mostrar paleta a clientes
    const paletaBadge = document.querySelector('.paleta-badge');
    if (usuarioActual.rol === 'cliente') {
        const EVENTO_ID = 'evento_2026_03';
        const paletaKey = `paleta_${EVENTO_ID}_${usuarioActual.email || usuarioActual.usuario}`;
        const paletaAsignada = localStorage.getItem(paletaKey);
        document.getElementById('userPaleta').textContent = paletaAsignada ? `#${paletaAsignada}` : '#---';
    } else if (paletaBadge) {
        paletaBadge.style.display = 'none';
    }
    
    // Mostrar opciones según el rol
    if (usuarioActual.rol === 'martillero') {
        document.getElementById('cardMartillero').style.display = 'flex';
    }

    if (usuarioActual.rol === 'tablero') {
        document.getElementById('cardTablero').style.display = 'flex';
    }

    if (usuarioActual.rol === 'admin') {
        document.getElementById('cardAdmin').style.display = 'flex';
        document.getElementById('cardMartillero').style.display = 'flex';
        document.getElementById('cardTablero').style.display = 'flex';
    }
    
    // Cargar estadísticas
    cargarEstadisticas();
    
    // Cargar perfil
    cargarPerfil();
}

// Navegación entre secciones
function mostrarSeccion(seccion) {
    // Ocultar todas las secciones
    document.querySelectorAll('.dashboard-section').forEach(s => s.style.display = 'none');
    
    // Remover clase activa de todos los nav-links
    document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
    
    // Mostrar sección seleccionada
    document.getElementById(`seccion-${seccion}`).style.display = 'block';
    
    // Activar nav-link
    event.target.classList.add('active');
    
    // Cargar datos según la sección
    switch(seccion) {
        case 'mis-pujas':
            cargarMisPujas();
            break;
        case 'perfil':
            cargarPerfil();
            break;
    }
}

// Cargar estadísticas del usuario
function cargarEstadisticas() {
    const pujas = JSON.parse(localStorage.getItem('misPujas') || '[]');
    const pujasUsuario = pujas.filter(p => p.usuario === usuarioActual.numeroPaleta);
    
    // Total de pujas
    document.getElementById('totalPujas').textContent = pujasUsuario.length;
    
    // Lotes ganados
    const ganados = pujasUsuario.filter(p => p.estado === 'ganada').length;
    document.getElementById('lotesGanados').textContent = ganados;
    
    // Total invertido
    const totalInvertido = pujasUsuario
        .filter(p => p.estado === 'ganada')
        .reduce((sum, p) => sum + p.monto, 0);
    document.getElementById('totalInvertido').textContent = formatearPrecio(totalInvertido);
}

// Cargar Mis Pujas
function cargarMisPujas() {
    const pujas = JSON.parse(localStorage.getItem('misPujas') || '[]');
    const pujasUsuario = pujas.filter(p => p.usuario === usuarioActual.numeroPaleta);

    // Si no hay pujas o les faltan los campos nuevos, regenerar
    const necesitaActualizar = pujasUsuario.length === 0 || pujasUsuario.some(p => !p.cantidad);
    if (necesitaActualizar) {
        generarPujasEjemplo();
        return;
    }

    const tabla = document.getElementById('tablaPujas');
    tabla.innerHTML = '';
    
    pujasUsuario.forEach(puja => {
        const tr = document.createElement('tr');
        const estadoBadge = puja.estado === 'ganada' ? 'badge-ganada' : 
                           puja.estado === 'superada' ? 'badge-superada' : 'badge-activa';
        
        tr.innerHTML = `
            <td>${formatearFecha(puja.fecha)}</td>
            <td>Lote #${puja.lote}</td>
            <td>${formatearPrecio(puja.monto)}</td>
            <td>${formatearPrecio(puja.pujaActual)}</td>
            <td><span class="badge ${estadoBadge}">${puja.estado.toUpperCase()}</span></td>
            <td>
                ${puja.estado === 'activa' ? 
                    '<button class="btn btn-primary" onclick="irASubasta()">Pujar</button>' : 
                    '<button class="btn btn-outline" onclick="verDetalle(' + puja.lote + ')">Ver Detalle</button>'}
            </td>
        `;
        tabla.appendChild(tr);
    });
}

function generarPujasEjemplo() {
    const pujasEjemplo = [
        {
            usuario: usuarioActual.numeroPaleta,
            lote: 1,
            monto: 18500000,
            pujaActual: 19000000,
            fecha: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            estado: 'superada',
            tipo: 'Ganado de Ceba',
            cantidad: 12,
            pesoPromedio: 480,
            procedencia: 'Finca El Paraíso, Yopal',
            vendedor: 'Carlos Martínez',
            raza: 'Brahman',
            sexo: 'Macho'
        },
        {
            usuario: usuarioActual.numeroPaleta,
            lote: 3,
            monto: 15000000,
            pujaActual: 15000000,
            fecha: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            estado: 'ganada',
            tipo: 'Ganado de Levante',
            cantidad: 8,
            pesoPromedio: 320,
            procedencia: 'Finca La Esperanza, Aguazul',
            vendedor: 'Hacienda Los Llanos S.A.S',
            raza: 'Cebú',
            sexo: 'Hembra',
            modoSubasta: 'kilo'
        },
        {
            usuario: usuarioActual.numeroPaleta,
            lote: 5,
            monto: 12500000,
            pujaActual: 12500000,
            fecha: new Date().toISOString(),
            estado: 'activa',
            tipo: 'Ganado de Cría',
            cantidad: 6,
            pesoPromedio: 410,
            procedencia: 'Finca Santa Rosa, Tauramena',
            vendedor: 'José Rodríguez e Hijos',
            raza: 'Romosinuano',
            sexo: 'Hembra'
        }
    ];

    localStorage.setItem('misPujas', JSON.stringify(pujasEjemplo));
    cargarMisPujas();
}

function filtrarPujas() {
    const estado = document.getElementById('filtroEstadoPuja').value;
    const fechaInicio = document.getElementById('filtroFechaInicio').value;
    const fechaFin = document.getElementById('filtroFechaFin').value;

    const pujas = JSON.parse(localStorage.getItem('misPujas') || '[]');
    let pujasUsuario = pujas.filter(p => p.usuario === usuarioActual.numeroPaleta);

    if (estado) {
        pujasUsuario = pujasUsuario.filter(p => p.estado === estado);
    }

    if (fechaInicio) {
        pujasUsuario = pujasUsuario.filter(p => new Date(p.fecha).toISOString().split('T')[0] >= fechaInicio);
    }

    if (fechaFin) {
        pujasUsuario = pujasUsuario.filter(p => new Date(p.fecha).toISOString().split('T')[0] <= fechaFin);
    }

    const tabla = document.getElementById('tablaPujas');
    tabla.innerHTML = '';

    if (pujasUsuario.length === 0) {
        tabla.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 40px; color: #94a3b8;">No se encontraron pujas con los filtros seleccionados</td></tr>';
        return;
    }

    pujasUsuario.forEach(puja => {
        const tr = document.createElement('tr');
        const estadoBadge = puja.estado === 'ganada' ? 'badge-ganada' :
                           puja.estado === 'superada' ? 'badge-superada' : 'badge-activa';
        tr.innerHTML = `
            <td>${formatearFecha(puja.fecha)}</td>
            <td>Lote #${puja.lote}</td>
            <td>${formatearPrecio(puja.monto)}</td>
            <td>${formatearPrecio(puja.pujaActual)}</td>
            <td><span class="badge ${estadoBadge}">${puja.estado.toUpperCase()}</span></td>
            <td>
                ${puja.estado === 'activa' ?
                    '<button class="btn btn-primary" onclick="irASubasta()">Pujar</button>' :
                    '<button class="btn btn-outline" onclick="verDetalle(' + puja.lote + ')">Ver Detalle</button>'}
            </td>
        `;
        tabla.appendChild(tr);
    });
}

function limpiarFiltros() {
    document.getElementById('filtroEstadoPuja').value = '';
    document.getElementById('filtroFechaInicio').value = '';
    document.getElementById('filtroFechaFin').value = '';
    filtrarPujas();
}

function irASubasta() {
    window.location.href = 'subasta-live.html';
}

function verDetalle(lote) {
    const pujas = JSON.parse(localStorage.getItem('misPujas') || '[]');
    const puja = pujas.find(p => p.lote === lote);
    if (!puja) return;

    // Guardar referencia para descarga
    window._pujaDetalle = puja;

    const pesoTotalKg = (puja.cantidad && puja.pesoPromedio) ? puja.cantidad * puja.pesoPromedio : 0;
    const pesoTotalStr = pesoTotalKg ? pesoTotalKg.toLocaleString('es-CO') + ' kg' : '—';

    document.getElementById('detalleLoteBadge').textContent = `Lote #${puja.lote}${puja.tipo ? ' — ' + puja.tipo : ''}`;
    document.getElementById('detalleFecha').textContent = formatearFecha(puja.fecha);
    document.getElementById('detalleMonto').textContent = formatearPrecio(puja.monto);
    document.getElementById('detallePujaActual').textContent = formatearPrecio(puja.pujaActual);

    const estadoClase = puja.estado === 'ganada' ? 'badge-ganada' : puja.estado === 'superada' ? 'badge-superada' : 'badge-activa';
    document.getElementById('detalleEstadoBadge').innerHTML = `<span class="badge ${estadoClase}">${puja.estado.toUpperCase()}</span>`;

    document.getElementById('detalleCantidad').textContent   = puja.cantidad     ? `${puja.cantidad} cabezas` : '—';
    document.getElementById('detallePesoProm').textContent   = puja.pesoPromedio  ? `${puja.pesoPromedio} kg`  : '—';
    document.getElementById('detallePesoTotal').textContent  = pesoTotalStr;
    document.getElementById('detalleProcedencia').textContent = puja.procedencia  || '—';
    document.getElementById('detalleVendedor').textContent   = puja.vendedor      || '—';
    document.getElementById('detalleRaza').textContent       = puja.raza          || '—';
    document.getElementById('detalleSexo').textContent       = puja.sexo          || '—';

    // Mostrar footer de descarga solo en pujas ganadas
    const footer      = document.getElementById('modalDetallePujaFooter');
    const resultado   = document.getElementById('detalleResultado');
    const liquidacionEl = document.getElementById('detalleLiquidacion');

    if (puja.estado === 'ganada') {
        resultado.innerHTML = `<div class="detalle-ganado">🏆 Ganaste este lote por <strong>${formatearPrecio(puja.monto)}</strong></div>`;

        const esKilo = puja.modoSubasta === 'kilo';
        const valorGanado = puja.monto;
        const comision = Math.round(valorGanado * 0.08);
        const total = valorGanado + comision;
        const precioKilo = pesoTotalKg ? Math.round(valorGanado / pesoTotalKg) : null;

        document.getElementById('liqModalidad').textContent   = esKilo ? '⚖️ Por Kilo en Pie' : '📦 Por Lote';
        document.getElementById('liqPrecioKilo').textContent  = precioKilo ? formatearPrecio(precioKilo) + '/kg' : '—';
        document.getElementById('liqPesoTotal').textContent   = pesoTotalStr;
        document.getElementById('liqValorGanado').textContent = formatearPrecio(valorGanado);
        document.getElementById('liqComision').textContent    = formatearPrecio(comision);
        document.getElementById('liqTotal').textContent       = formatearPrecio(total);

        liquidacionEl.style.display = '';
        footer.style.display = '';
    } else {
        liquidacionEl.style.display = 'none';
        footer.style.display = 'none';
        if (puja.estado === 'superada') {
            const diff = puja.pujaActual - puja.monto;
            resultado.innerHTML = `<div class="detalle-superado">Tu puja fue superada por <strong>${formatearPrecio(diff)}</strong></div>`;
        } else {
            resultado.innerHTML = `<div class="detalle-activo">⏳ Subasta en curso — tu puja sigue activa</div>`;
        }
    }

    document.getElementById('modalDetallePuja').style.display = 'flex';
    if (typeof lucide !== 'undefined') lucide.createIcons();
}

function cerrarDetallePuja() {
    document.getElementById('modalDetallePuja').style.display = 'none';
}

function cerrarDetalle(e) {
    if (e.target.id === 'modalDetallePuja') cerrarDetallePuja();
}

// Cargar Perfil
function cargarPerfil() {
    document.getElementById('perfilNombre').value = usuarioActual.nombre;
    document.getElementById('perfilCedula').value = usuarioActual.cedula;
    document.getElementById('perfilEmail').value = usuarioActual.email;
    document.getElementById('perfilTelefono').value = usuarioActual.telefono;
    document.getElementById('perfilTipo').textContent = usuarioActual.tipoUsuario.charAt(0).toUpperCase() + usuarioActual.tipoUsuario.slice(1);
    document.getElementById('perfilFechaRegistro').textContent = formatearFecha(usuarioActual.fechaRegistro);
    
    // Solo mostrar paleta a clientes
    const paletaItem = document.getElementById('perfilPaleta')?.closest('.info-item');
    if (usuarioActual.rol === 'cliente') {
        document.getElementById('perfilPaleta').textContent = `#${usuarioActual.numeroPaleta}`;
    } else if (paletaItem) {
        paletaItem.style.display = 'none';
    }
    
    // Cargar preferencias
    const preferencias = JSON.parse(localStorage.getItem('preferencias_' + usuarioActual.cedula) || '{}');
    document.getElementById('prefNotificaciones').checked = preferencias.notificaciones !== false;
    document.getElementById('prefRecordatorios').checked = preferencias.recordatorios !== false;
    document.getElementById('prefResumen').checked = preferencias.resumen !== false;
}

// Guardar cambios de perfil
document.getElementById('formPerfil').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const nombre = document.getElementById('perfilNombre').value;
    const email = document.getElementById('perfilEmail').value;
    const telefono = document.getElementById('perfilTelefono').value;
    
    // Actualizar usuario actual
    usuarioActual.nombre = nombre;
    usuarioActual.email = email;
    usuarioActual.telefono = telefono;
    
    // Actualizar en localStorage
    localStorage.setItem('usuarioActual', JSON.stringify(usuarioActual));
    
    // Actualizar en lista de usuarios
    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
    const index = usuarios.findIndex(u => u.cedula === usuarioActual.cedula);
    if (index !== -1) {
        usuarios[index] = usuarioActual;
        localStorage.setItem('usuarios', JSON.stringify(usuarios));
    }
    
    // Actualizar nombre en la página
    document.getElementById('welcomeMsg').textContent = nombre;
    
    alert('✅ Perfil actualizado correctamente');
});

// Cambiar contraseña
document.getElementById('formPassword').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const passwordActual = document.getElementById('passwordActual').value;
    const passwordNueva = document.getElementById('passwordNueva').value;
    const passwordConfirmar = document.getElementById('passwordConfirmar').value;
    
    // Validar contraseña actual
    if (passwordActual !== usuarioActual.password) {
        alert('❌ La contraseña actual es incorrecta');
        return;
    }
    
    // Validar que las contraseñas coincidan
    if (passwordNueva !== passwordConfirmar) {
        alert('❌ Las contraseñas nuevas no coinciden');
        return;
    }
    
    // Validar longitud mínima
    if (passwordNueva.length < 6) {
        alert('❌ La contraseña debe tener al menos 6 caracteres');
        return;
    }
    
    // Actualizar contraseña
    usuarioActual.password = passwordNueva;
    localStorage.setItem('usuarioActual', JSON.stringify(usuarioActual));
    
    // Actualizar en lista de usuarios
    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
    const index = usuarios.findIndex(u => u.cedula === usuarioActual.cedula);
    if (index !== -1) {
        usuarios[index].password = passwordNueva;
        localStorage.setItem('usuarios', JSON.stringify(usuarios));
    }
    
    // Limpiar formulario
    this.reset();
    
    alert('✅ Contraseña actualizada correctamente');
});

// Guardar preferencias
function guardarPreferencias() {
    const preferencias = {
        notificaciones: document.getElementById('prefNotificaciones').checked,
        recordatorios: document.getElementById('prefRecordatorios').checked,
        resumen: document.getElementById('prefResumen').checked
    };
    
    localStorage.setItem('preferencias_' + usuarioActual.cedula, JSON.stringify(preferencias));
    alert('✅ Preferencias guardadas correctamente');
}

// Utilidades
function formatearPrecio(precio) {
    return '$' + precio.toLocaleString('es-CO');
}

function formatearFecha(fecha) {
    const date = new Date(fecha);
    return date.toLocaleDateString('es-CO', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function cerrarSesion() {
    if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
        localStorage.removeItem('usuarioActual');
        window.location.href = 'index.html';
    }
}

// ── Exportación Mis Pujas ─────────────────────────────────────────────────────

function getMisPujasActuales() {
    const pujas = JSON.parse(localStorage.getItem('misPujas') || '[]');
    return pujas.filter(p => p.usuario === usuarioActual.numeroPaleta);
}

function exportarMisPujasExcel() {
    const cols = [
        { titulo: 'Fecha',       campo: 'fechaF' },
        { titulo: 'Lote',        campo: 'loteF' },
        { titulo: 'Tipo',        campo: 'tipo' },
        { titulo: 'Cantidad',    campo: 'cantidad' },
        { titulo: 'Raza',        campo: 'raza' },
        { titulo: 'Procedencia', campo: 'procedencia' },
        { titulo: 'Vendedor',    campo: 'vendedor' },
        { titulo: 'Mi Puja',     campo: 'monto' },
        { titulo: 'Puja Final',  campo: 'pujaActual' },
        { titulo: 'Estado',      campo: 'estado' }
    ];
    const filas = getMisPujasActuales().map(p => ({
        ...p,
        fechaF: formatearFecha(p.fecha),
        loteF: 'Lote #' + p.lote
    }));
    exportarExcel(cols, filas, 'mis-pujas');
}

function exportarMisPujasPDF() {
    const cols = [
        { titulo: 'Fecha',      campo: 'fechaF' },
        { titulo: 'Lote',       campo: 'loteF' },
        { titulo: 'Tipo',       campo: 'tipo' },
        { titulo: 'Cantidad',   campo: 'cantidad' },
        { titulo: 'Vendedor',   campo: 'vendedor' },
        { titulo: 'Mi Puja',    campo: 'montoF' },
        { titulo: 'Puja Final', campo: 'pujaActualF' },
        { titulo: 'Estado',     campo: 'estado' }
    ];
    const pujas = getMisPujasActuales();
    const filas = pujas.map(p => ({
        ...p,
        fechaF: formatearFecha(p.fecha),
        loteF: 'Lote #' + p.lote,
        montoF: formatearPrecio(p.monto),
        pujaActualF: formatearPrecio(p.pujaActual)
    }));
    exportarPDF('Mis Pujas', cols, filas, 'mis-pujas', {
        'Cliente': usuarioActual.nombre,
        'Total pujas': pujas.length,
        'Ganadas': pujas.filter(p => p.estado === 'ganada').length,
        'Superadas': pujas.filter(p => p.estado === 'superada').length
    });
}

// ── Descarga de liquidación ───────────────────────────────────────────────────

function descargarLiquidacionExcel() {
    const p = window._pujaDetalle;
    if (!p) return;
    const pesoTotal = (p.cantidad && p.pesoPromedio) ? p.cantidad * p.pesoPromedio : 0;
    const comision  = Math.round(p.monto * 0.08);
    const total     = p.monto + comision;
    const precioKilo = pesoTotal ? Math.round(p.monto / pesoTotal) : 0;

    const cols = [
        'Campo', 'Valor'
    ];
    const filas = [
        ['Lote',              'Lote #' + p.lote],
        ['Tipo',              p.tipo || '—'],
        ['Fecha',             formatearFecha(p.fecha)],
        ['Vendedor',          p.vendedor || '—'],
        ['Procedencia',       p.procedencia || '—'],
        ['Cantidad',          (p.cantidad || '—') + ' cabezas'],
        ['Raza',              p.raza || '—'],
        ['Sexo',              p.sexo || '—'],
        ['Peso Promedio',     (p.pesoPromedio || '—') + ' kg'],
        ['Peso Total',        pesoTotal ? pesoTotal + ' kg' : '—'],
        ['Modalidad',         p.modoSubasta === 'kilo' ? 'Por Kilo en Pie' : 'Por Lote'],
        ['Precio / kg',       precioKilo ? '$' + precioKilo.toLocaleString('es-CO') + '/kg' : '—'],
        ['Valor del Ganado',  '$' + p.monto.toLocaleString('es-CO')],
        ['Comisión (8%)',     '$' + comision.toLocaleString('es-CO')],
        ['TOTAL A PAGAR',     '$' + total.toLocaleString('es-CO')],
    ];

    exportarExcel(cols, filas.map(f => ({ Campo: f[0], Valor: f[1] })), `liquidacion-lote-${p.lote}`);
}

function descargarLiquidacionPDF() {
    const p = window._pujaDetalle;
    if (!p) return;
    const pesoTotal  = (p.cantidad && p.pesoPromedio) ? p.cantidad * p.pesoPromedio : 0;
    const comision   = Math.round(p.monto * 0.08);
    const total      = p.monto + comision;
    const precioKilo = pesoTotal ? Math.round(p.monto / pesoTotal) : 0;

    const cols = ['Campo', 'Valor'];
    const filas = [
        { Campo: 'Lote',             Valor: 'Lote #' + p.lote },
        { Campo: 'Tipo',             Valor: p.tipo || '—' },
        { Campo: 'Fecha',            Valor: formatearFecha(p.fecha) },
        { Campo: 'Vendedor',         Valor: p.vendedor || '—' },
        { Campo: 'Procedencia',      Valor: p.procedencia || '—' },
        { Campo: 'Cantidad',         Valor: (p.cantidad || '—') + ' cabezas' },
        { Campo: 'Raza',             Valor: p.raza || '—' },
        { Campo: 'Sexo',             Valor: p.sexo || '—' },
        { Campo: 'Peso Promedio',    Valor: (p.pesoPromedio || '—') + ' kg' },
        { Campo: 'Peso Total',       Valor: pesoTotal ? pesoTotal + ' kg' : '—' },
        { Campo: 'Modalidad',        Valor: p.modoSubasta === 'kilo' ? 'Por Kilo en Pie' : 'Por Lote' },
        { Campo: 'Precio / kg',      Valor: precioKilo ? '$' + precioKilo.toLocaleString('es-CO') + '/kg' : '—' },
        { Campo: 'Valor del Ganado', Valor: '$' + p.monto.toLocaleString('es-CO') },
        { Campo: 'Comisión (8%)',    Valor: '$' + comision.toLocaleString('es-CO') },
        { Campo: 'TOTAL A PAGAR',   Valor: '$' + total.toLocaleString('es-CO') },
    ];

    exportarPDF(
        `Liquidación — Lote #${p.lote}`,
        cols,
        filas,
        `liquidacion-lote-${p.lote}`,
        {
            'Cliente':  usuarioActual.nombre,
            'Paleta':   '#' + (usuarioActual.numeroPaleta || '—'),
            'Estado':   'ADJUDICADO',
            'Fecha':    formatearFecha(p.fecha)
        }
    );
}
