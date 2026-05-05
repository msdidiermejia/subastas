// Verificar acceso
const usuarioActual = JSON.parse(localStorage.getItem('usuarioActual'));
if (!usuarioActual || !['martillero', 'admin'].includes(usuarioActual.rol)) {
    alert('Acceso denegado.');
    window.location.href = 'dashboard.html';
}

document.getElementById('nombreMartillero').textContent = usuarioActual.nombre;

// Estado (solo lectura — el control lo tiene el tablero)
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
    incremento: 500000
};

let pujas = [];
let estadisticas = {
    totalPujas: 0,
    participantesActivos: new Set(),
    presenciales: 0,
    remotos: 0
};

const lotes = [
    { numero: 14, tipo: 'Ganado de Levante', completado: true },
    { numero: 15, tipo: 'Ganado de Ceba', activo: true },
    { numero: 16, tipo: 'Ganado de Cría', completado: false },
    { numero: 17, tipo: 'Ganado de Ceba', completado: false },
    { numero: 18, tipo: 'Ganado de Levante', completado: false }
];

function formatearPrecio(precio) {
    return '$' + precio.toLocaleString('es-CO');
}

function formatearTiempo(fecha) {
    const diff = Math.floor((new Date() - fecha) / 1000);
    if (diff < 60) return 'Hace ' + diff + 's';
    if (diff < 3600) return 'Hace ' + Math.floor(diff / 60) + 'm';
    return fecha.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });
}

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
    document.getElementById('precioActual').textContent = formatearPrecio(loteActual.precioActual);
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
        div.onclick = () => verLote(lote);
        lista.appendChild(div);
    });
}

function verLote(lote) {
    if (lote.completado) return;
    lotes.forEach(l => l.activo = false);
    lotes.find(l => l.numero === lote.numero).activo = true;
    loteActual.numero = lote.numero;
    loteActual.tipo = lote.tipo;
    pujas = [];
    estadisticas = { totalPujas: 0, participantesActivos: new Set(), presenciales: 0, remotos: 0 };
    actualizarLoteUI();
    renderizarListaLotes();
    renderizarPujas();
    actualizarEstadisticas();
}

function agregarPuja(paleta, precio, esPresencial) {
    const puja = { paleta, precio, esPresencial, timestamp: new Date() };
    pujas.unshift(puja);
    loteActual.precioActual = precio;

    estadisticas.totalPujas++;
    estadisticas.participantesActivos.add(String(paleta));
    esPresencial ? estadisticas.presenciales++ : estadisticas.remotos++;

    document.getElementById('precioActual').textContent = formatearPrecio(precio);
    document.getElementById('ultimaPuja').innerHTML = `
        <span class="label">Última puja:</span>
        <span class="puja-info">#${paleta} — ${esPresencial ? '🏟️ Coliseo' : '🌐 Remoto'} — ${formatearPrecio(precio)}</span>
    `;

    renderizarPujas();
    actualizarEstadisticas();
}

function renderizarPujas() {
    const stream = document.getElementById('pujasStream');
    document.getElementById('pujasCount').textContent = `${pujas.length} puja${pujas.length !== 1 ? 's' : ''}`;

    if (pujas.length === 0) {
        stream.innerHTML = '<div class="no-pujas"><span class="icon">⏳</span><p>Esperando pujas...</p></div>';
        return;
    }

    stream.innerHTML = '';
    pujas.forEach((p, i) => {
        const div = document.createElement('div');
        div.className = 'puja-item' + (i === 0 ? ' nueva' : '');
        const tipo = p.esPresencial ? '🏟️ Coliseo' : '🌐 Remoto';
        div.innerHTML = `
            <div class="puja-header-item">
                <span class="puja-paleta">#${p.paleta}</span>
                <span class="puja-precio">${formatearPrecio(p.precio)}</span>
            </div>
            <div class="puja-detalles">
                <span class="puja-tipo">${tipo}</span>
                <span>⏰ ${formatearTiempo(p.timestamp)}</span>
            </div>
        `;
        stream.appendChild(div);
    });
}

function actualizarEstadisticas() {
    document.getElementById('totalPujas').textContent = estadisticas.totalPujas;
    document.getElementById('participantesActivos').textContent = estadisticas.participantesActivos.size;
    document.getElementById('presenciales').textContent = estadisticas.presenciales;
    document.getElementById('remotos').textContent = estadisticas.remotos;
}

// Simulación de pujas entrantes (en producción: WebSocket)
function simularPujas() {
    setTimeout(() => {
        if (Math.random() > 0.3) {
            const paleta = Math.floor(Math.random() * 900) + 100;
            const esPresencial = Math.random() > 0.5;
            const nuevoPrecio = loteActual.precioActual + loteActual.incremento;
            agregarPuja(paleta, nuevoPrecio, esPresencial);
            if (loteActual.precioActual < loteActual.precioBase + loteActual.incremento * 15) {
                simularPujas();
            }
        }
    }, Math.random() * 4000 + 2000);
}

// Init
actualizarLoteUI();
renderizarListaLotes();

// Pujas iniciales de demo
setTimeout(() => agregarPuja(234, 15500000, true), 2000);
setTimeout(() => agregarPuja(567, 16000000, false), 4000);
setTimeout(simularPujas, 6000);
