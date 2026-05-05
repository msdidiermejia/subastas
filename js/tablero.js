// Verificar acceso
const usuarioActual = JSON.parse(localStorage.getItem('usuarioActual'));
if (!usuarioActual || !['tablero', 'admin'].includes(usuarioActual.rol)) {
    alert('Acceso denegado. Solo el tablero puede acceder a este panel.');
    window.location.href = 'dashboard.html';
}

document.getElementById('nombreTablero').textContent = usuarioActual.nombre;

// Modo de subasta: 'lote' | 'kilo'  — Por kilo es la modalidad estándar en subastas colombianas
let modoSubasta = 'kilo';

// Estado
let subastaActiva = false;
let pujas = [];
let estadisticas = {
    totalPujas: 0,
    participantesActivos: new Set(),
    presenciales: 0,
    remotos: 0
};

let loteActual = {
    numero: 15,
    tipo: 'Ganado de Ceba',
    cantidad: 10,
    sexo: 'Macho',
    peso: 450,
    raza: 'Brahman',
    procedencia: 'Finca El Paraíso, Yopal',
    observaciones: 'Animales en buen estado sanitario, vacunados.',
    precioBase: 15000000,
    precioActual: 15000000,
    incremento: 500000,
    incrementoKilo: 100,
    paletaVendedor: '247' // paleta del propietario del lote
};

const lotes = [
    { numero: 14, tipo: 'Ganado de Levante', completado: true },
    { numero: 15, tipo: 'Ganado de Ceba', activo: true },
    { numero: 16, tipo: 'Ganado de Cría', completado: false },
    { numero: 17, tipo: 'Ganado de Ceba', completado: false },
    { numero: 18, tipo: 'Ganado de Levante', completado: false }
];

// ── Modo subasta ──────────────────────────────────────────────
function toggleModoSubasta() {
    if (subastaActiva) return;
    modoSubasta = modoSubasta === 'lote' ? 'kilo' : 'lote';
    actualizarModoUI();
    actualizarConfigFields();
    actualizarLoteUI();
}

function actualizarConfigFields() {
    const esKilo = modoSubasta === 'kilo';
    document.getElementById('configFieldsLote').style.display = esKilo ? 'none' : '';
    document.getElementById('configFieldsKilo').style.display = esKilo ? '' : 'none';
}

function aplicarConfigPrecios() {
    const pesoTotal = loteActual.cantidad * loteActual.peso;
    if (modoSubasta === 'kilo') {
        const baseKilo = parseFloat(document.getElementById('inputPrecioBaseKilo').value) || 0;
        const incKilo  = parseFloat(document.getElementById('inputIncrementoKilo').value) || 0;
        loteActual.precioBase     = Math.round(baseKilo * pesoTotal);
        loteActual.precioActual   = loteActual.precioBase;
        loteActual.incremento     = Math.round(incKilo * pesoTotal);
        loteActual.incrementoKilo = incKilo;
    } else {
        loteActual.precioBase   = parseFloat(document.getElementById('inputPrecioBase').value) || 0;
        loteActual.precioActual = loteActual.precioBase;
        loteActual.incremento   = parseFloat(document.getElementById('inputIncremento').value) || 0;
    }
    actualizarLoteUI();
}

function actualizarModoUI() {
    const esKilo = modoSubasta === 'kilo';
    document.getElementById('modoIcon').textContent = esKilo ? '⚖️' : '📦';
    document.getElementById('modoTexto').textContent = esKilo ? 'Por Kilo' : 'Por Lote';
    document.getElementById('precioKiloWrap').style.display = esKilo ? '' : 'none';
    document.getElementById('precioKiloDisplay').style.display = esKilo ? '' : 'none';
    document.getElementById('precioVivoLabel').textContent = esKilo ? 'PRECIO ACTUAL / KG' : 'PRECIO ACTUAL';
}

// ── Datos del lote ────────────────────────────────────────────
function actualizarLoteUI() {
    const pesoTotal = loteActual.cantidad * loteActual.peso;
    document.getElementById('loteNumero').textContent = `#${loteActual.numero}`;
    document.getElementById('loteTipo').textContent = loteActual.tipo;
    document.getElementById('loteCantidad').textContent = `${loteActual.cantidad} cabezas`;
    document.getElementById('loteSexo').textContent = loteActual.sexo;
    document.getElementById('lotePeso').textContent = `${loteActual.peso} kg`;
    document.getElementById('lotePesoTotal').textContent = `${pesoTotal.toLocaleString('es-CO')} kg`;
    document.getElementById('loteRaza').textContent = loteActual.raza;
    document.getElementById('loteProcedencia').textContent = loteActual.procedencia;
    document.getElementById('loteObservaciones').textContent = loteActual.observaciones;
    document.getElementById('precioBase').textContent = formatearPrecio(loteActual.precioBase);

    const precioKiloBase = Math.round(loteActual.precioBase / pesoTotal);
    document.getElementById('precioBaseKilo').textContent = `${formatearPrecio(precioKiloBase)}/kg`;

    actualizarPrecioUI();
    renderizarListaLotes();
}

function actualizarPrecioUI() {
    const pesoTotal = loteActual.cantidad * loteActual.peso;
    if (modoSubasta === 'kilo') {
        const precioKilo = Math.round(loteActual.precioActual / pesoTotal);
        document.getElementById('precioActual').textContent = formatearPrecio(loteActual.precioActual);
        document.getElementById('precioKiloValor').textContent = formatearPrecio(precioKilo);
    } else {
        document.getElementById('precioActual').textContent = formatearPrecio(loteActual.precioActual);
    }
}

function renderizarListaLotes() {
    const lista = document.getElementById('lotesLista');
    lista.innerHTML = '';
    const q = (document.getElementById('buscarLote')?.value || '').toLowerCase().trim();
    const filtrados = q
        ? lotes.filter(l => String(l.numero).includes(q) || l.tipo.toLowerCase().includes(q))
        : lotes;

    if (filtrados.length === 0) {
        lista.innerHTML = '<div class="lotes-sin-resultado">Sin resultados</div>';
        return;
    }

    filtrados.forEach(lote => {
        const div = document.createElement('div');
        div.className = 'lote-mini' + (lote.activo ? ' activo' : '') + (lote.completado ? ' completado' : '');
        div.textContent = `Lote #${lote.numero} — ${lote.tipo}`;
        div.onclick = () => cambiarLote(lote);
        lista.appendChild(div);
    });
}

// ── Control de subasta ────────────────────────────────────────
function iniciarSubasta() {
    subastaActiva = true;
    document.getElementById('estadoBadge').textContent = '🔴 EN VIVO';
    document.getElementById('estadoBadge').className = 'estado-badge activa';
    document.getElementById('btnIniciar').disabled = true;
    document.getElementById('btnPausar').disabled = false;
    document.getElementById('btnCerrar').disabled = false;
    document.getElementById('btnModoSubasta').disabled = true;
    document.querySelectorAll('#configPreciosCard input').forEach(i => i.disabled = true);
    iniciarSimulacion();
}

function pausarSubasta() {
    subastaActiva = false;
    document.getElementById('estadoBadge').textContent = '⏸️ PAUSADA';
    document.getElementById('estadoBadge').className = 'estado-badge pausada';
    document.getElementById('btnIniciar').disabled = false;
    document.getElementById('btnPausar').disabled = true;
    document.getElementById('btnModoSubasta').disabled = false;
    document.querySelectorAll('#configPreciosCard input').forEach(i => i.disabled = false);
}

function abrirModalCierre() {
    if (pujas.length === 0) { alert('No hay pujas para este lote.'); return; }
    const ultima = pujas[0];
    document.getElementById('modalLoteNum').textContent = `#${loteActual.numero}`;
    document.getElementById('ganadorPaleta').textContent = `#${ultima.paleta}`;
    document.getElementById('ganadorPrecio').textContent = formatearPrecio(ultima.precio);
    document.getElementById('ganadorModo').textContent = ultima.esPresencial ? '🏟️ Coliseo' : '🌐 Remoto';
    document.getElementById('modalCierre').style.display = 'flex';
}

function cerrarModal() {
    document.getElementById('modalCierre').style.display = 'none';
}

function confirmarCierre() {
    const ultima = pujas[0];
    const resultado = {
        lote: loteActual.numero,
        ganador: ultima.paleta,
        precioFinal: ultima.precio,
        modoSubasta,
        totalPujas: pujas.length,
        fecha: new Date().toISOString()
    };
    let resultados = JSON.parse(localStorage.getItem('resultadosSubastas') || '[]');
    resultados.push(resultado);
    localStorage.setItem('resultadosSubastas', JSON.stringify(resultados));
    cerrarModal();
    siguienteLote();
}

function siguienteLote() {
    const idx = lotes.findIndex(l => l.numero === loteActual.numero);
    if (idx !== -1) { lotes[idx].completado = true; lotes[idx].activo = false; }

    if (idx < lotes.length - 1) {
        lotes[idx + 1].activo = true;
        const sig = lotes[idx + 1];
        loteActual.numero = sig.numero;
        loteActual.tipo = sig.tipo;
        loteActual.precioBase += 2000000;
        loteActual.precioActual = loteActual.precioBase;
        loteActual.sexo = sig.numero % 2 === 0 ? 'Hembra' : 'Macho';
        loteActual.procedencia = 'Finca La Esperanza, Aguazul';
        loteActual.observaciones = 'Lote homogéneo, buen desarrollo muscular.';
    }

    resetearPujas();
    actualizarLoteUI();
    pausarSubasta();
}

function cambiarLote(lote) {
    if (lote.completado) { alert('Este lote ya fue subastado.'); return; }
    if (subastaActiva && !confirm('¿Cambiar de lote? La subasta se pausará.')) return;
    lotes.forEach(l => l.activo = false);
    lotes.find(l => l.numero === lote.numero).activo = true;
    loteActual.numero = lote.numero;
    loteActual.tipo = lote.tipo;
    resetearPujas();
    actualizarLoteUI();
    pausarSubasta();
}

function resetearPujas() {
    pujas = [];
    estadisticas = { totalPujas: 0, participantesActivos: new Set(), presenciales: 0, remotos: 0 };
    renderizarPujas();
    actualizarEstadisticas();
    document.getElementById('ultimaPaleta').textContent = '—';
}

// ── Pujas ─────────────────────────────────────────────────────
function agregarPuja(paleta, precio, esPresencial) {
    const esAutoPuja = String(paleta) === String(loteActual.paletaVendedor);
    const puja = { paleta, precio, esPresencial, esAutoPuja, timestamp: new Date() };
    pujas.unshift(puja);
    loteActual.precioActual = precio;

    estadisticas.totalPujas++;
    estadisticas.participantesActivos.add(String(paleta));
    esPresencial ? estadisticas.presenciales++ : estadisticas.remotos++;

    actualizarPrecioUI();
    renderizarPujas();
    actualizarEstadisticas();
    document.getElementById('ultimaPaleta').textContent = `#${paleta}`;
}

function renderizarPujas() {
    const stream = document.getElementById('pujasStream');
    if (pujas.length === 0) {
        stream.innerHTML = '<div class="no-pujas"><span>⏳</span><p>Esperando pujas...</p></div>';
        document.getElementById('pujasCount').textContent = '0 pujas';
        return;
    }
    stream.innerHTML = '';
    pujas.forEach((p, i) => {
        const div = document.createElement('div');
        div.className = 'puja-row' + (i === 0 ? ' nueva' : '') + (p.esAutoPuja ? ' auto-puja' : '');
        const tipo = p.esPresencial ? '🏟️' : '🌐';
        const pesoTotal = loteActual.cantidad * loteActual.peso;
        const extra = modoSubasta === 'kilo'
            ? `<span class="puja-kilo">${formatearPrecio(Math.round(p.precio / pesoTotal))}/kg</span>`
            : '';
        const autoBadge = p.esAutoPuja ? '<span class="badge-autopuja-tablero">🛡️ Respaldo</span>' : '';
        div.innerHTML = `
            <span class="pr-paleta">#${p.paleta}</span>
            <span class="pr-tipo">${tipo}</span>
            <span class="pr-precio">${formatearPrecio(p.precio)}</span>
            ${extra}
            ${autoBadge}
            <span class="pr-tiempo">${formatearTiempo(p.timestamp)}</span>
        `;
        stream.appendChild(div);
    });
    document.getElementById('pujasCount').textContent = `${pujas.length} puja${pujas.length !== 1 ? 's' : ''}`;
}

function actualizarEstadisticas() {
    document.getElementById('totalPujas').textContent = estadisticas.totalPujas;
    document.getElementById('participantes').textContent = estadisticas.participantesActivos.size;
    document.getElementById('presenciales').textContent = estadisticas.presenciales;
    document.getElementById('remotos').textContent = estadisticas.remotos;
}

// ── Simulación ────────────────────────────────────────────────
function iniciarSimulacion() {
    if (!subastaActiva) return;
    setTimeout(() => {
        if (!subastaActiva) return;
        if (Math.random() > 0.25) {
            const paleta = Math.floor(Math.random() * 900) + 100;
            const esPresencial = Math.random() > 0.5;
            const nuevoPrecio = loteActual.precioActual + loteActual.incremento;
            agregarPuja(paleta, nuevoPrecio, esPresencial);
            if (loteActual.precioActual < loteActual.precioBase + loteActual.incremento * 15) {
                iniciarSimulacion();
            }
        }
    }, Math.random() * 3000 + 2000);
}

// ── Utilidades ────────────────────────────────────────────────
function formatearPrecio(precio) {
    return '$' + precio.toLocaleString('es-CO');
}

function formatearTiempo(fecha) {
    const diff = Math.floor((new Date() - fecha) / 1000);
    if (diff < 60) return diff + 's';
    if (diff < 3600) return Math.floor(diff / 60) + 'm';
    return fecha.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });
}

// ── Init ──────────────────────────────────────────────────────
actualizarModoUI();
actualizarConfigFields();
// Sincronizar inputs de config con los valores iniciales del lote
const _pesoTotalInit = loteActual.cantidad * loteActual.peso;
document.getElementById('inputPrecioBaseKilo').value = Math.round(loteActual.precioBase / _pesoTotalInit);
document.getElementById('inputIncrementoKilo').value = loteActual.incrementoKilo;
document.getElementById('inputPrecioBase').value = loteActual.precioBase;
document.getElementById('inputIncremento').value = loteActual.incremento;
actualizarLoteUI();
