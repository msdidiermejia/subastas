// Verificar sesión
const usuarioActual = JSON.parse(localStorage.getItem('usuarioActual'));
if (!usuarioActual) {
    window.location.href = 'index.html';
}

// ID del evento actual (en producción vendría del backend)
const EVENTO_ID = 'evento_2026_03';

// Paleta por evento: se guarda en localStorage con clave única por usuario+evento
const paletaKey = `paleta_${EVENTO_ID}_${usuarioActual.email || usuarioActual.usuario}`;
let paletaAsignada = localStorage.getItem(paletaKey);

// Números de paleta ya usados en este evento (simulado; en producción vendría del servidor)
const paletasUsadasKey = `paletas_usadas_${EVENTO_ID}`;
let paletasUsadas = JSON.parse(localStorage.getItem(paletasUsadasKey) || '[]');

// Paginación del historial grande
let paginaHistorial = 1;
const PUJAS_POR_PAGINA = 5;

function generarNumeroPaletaUnico() {
    let numero;
    do {
        numero = Math.floor(Math.random() * 900) + 100; // 100-999
    } while (paletasUsadas.includes(numero));
    paletasUsadas.push(numero);
    localStorage.setItem(paletasUsadasKey, JSON.stringify(paletasUsadas));
    return numero;
}

function solicitarPaleta() {
    // Guardar solicitud pendiente en localStorage
    const solicitudesKey = `solicitudes_paleta_${EVENTO_ID}`;
    const solicitudes = JSON.parse(localStorage.getItem(solicitudesKey) || '[]');

    // Evitar solicitud duplicada
    const yaExiste = solicitudes.find(s => s.email === (usuarioActual.email || usuarioActual.usuario));
    if (yaExiste) {
        mostrarEstadoSolicitud('pendiente');
        return;
    }

    const solicitud = {
        email: usuarioActual.email || usuarioActual.usuario,
        nombre: usuarioActual.nombre,
        eventoId: EVENTO_ID,
        estado: 'pendiente',
        timestamp: new Date().toISOString()
    };
    solicitudes.push(solicitud);
    localStorage.setItem(solicitudesKey, JSON.stringify(solicitudes));

    mostrarEstadoSolicitud('pendiente');

    // Polling: verificar cada 3s si fue aprobada
    iniciarPollingPaleta();
}

function mostrarEstadoSolicitud(estado) {
    const btnSolicitar = document.getElementById('btnSolicitarPaleta');
    const pujaInfo = document.getElementById('pujaInfo');

    if (estado === 'pendiente') {
        btnSolicitar.disabled = true;
        btnSolicitar.innerHTML = '<span class="btn-icon">⏳</span><span class="btn-text">SOLICITUD ENVIADA</span>';
        pujaInfo.textContent = 'Esperando aprobación del administrador...';
        document.getElementById('paletaUsuario').textContent = '#---';
    }
}

function iniciarPollingPaleta() {
    const intervalo = setInterval(() => {
        const paletaActual = localStorage.getItem(paletaKey);
        if (paletaActual) {
            clearInterval(intervalo);
            paletaAsignada = paletaActual;

            // Actualizar UI con paleta aprobada
            document.getElementById('paletaUsuario').textContent = `#${paletaAsignada}`;
            document.getElementById('btnSolicitarPaleta').style.display = 'none';
            document.getElementById('btnPujar').style.display = '';
            document.getElementById('pujaInfo').textContent = 'Haz clic para realizar tu oferta';

            const paletaEl = document.getElementById('paletaUsuario');
            paletaEl.style.transition = 'color 0.3s';
            paletaEl.style.color = '#4ade80';
            setTimeout(() => paletaEl.style.color = '', 1500);
        }
    }, 3000);
}

// Configurar estado inicial según si ya tiene paleta o solicitud pendiente
if (paletaAsignada) {
    document.getElementById('paletaUsuario').textContent = `#${paletaAsignada}`;
    document.getElementById('btnSolicitarPaleta').style.display = 'none';
    document.getElementById('btnPujar').style.display = '';
    document.getElementById('pujaInfo').textContent = 'Haz clic para realizar tu oferta';
} else {
    document.getElementById('paletaUsuario').textContent = '#---';
    // Verificar si ya tiene solicitud pendiente
    const solicitudesKey = `solicitudes_paleta_${EVENTO_ID}`;
    const solicitudes = JSON.parse(localStorage.getItem(solicitudesKey) || '[]');
    const solicitudPendiente = solicitudes.find(s => s.email === (usuarioActual.email || usuarioActual.usuario) && s.estado === 'pendiente');
    if (solicitudPendiente) {
        mostrarEstadoSolicitud('pendiente');
        iniciarPollingPaleta();
    }
}

document.getElementById('btnSolicitarPaleta').addEventListener('click', solicitarPaleta);

// Solo clientes pueden tener paleta y pujar
if (usuarioActual.rol !== 'cliente') {
    document.getElementById('btnSolicitarPaleta').style.display = 'none';
    document.getElementById('btnPujar').style.display = 'none';
    document.getElementById('pujaInfo').textContent = 'Solo los clientes pueden participar en las pujas.';
    document.querySelector('.user-paleta').style.display = 'none';
}

// Simular detección de ubicación (en producción sería con geolocalización o código QR)
// Para demo: puedes cambiar esto manualmente para probar ambos modos
const esPresencial = Math.random() > 0.5; // Simulación: 50% presencial, 50% remoto

// Configurar modo de visualización
const subastaContent = document.querySelector('.subasta-content');
if (esPresencial) {
    subastaContent.classList.add('modo-presencial');
    subastaContent.classList.remove('modo-remoto');
} else {
    subastaContent.classList.add('modo-remoto');
    subastaContent.classList.remove('modo-presencial');
}

// Estado de la subasta
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
    paletaVendedor: '247' // paleta del vendedor/propietario del lote
};

// Compras del día
let comprasDelDia = [];
let historialPujas = [];

// Actualizar interfaz con datos del lote
function actualizarLote() {
    document.getElementById('loteNumero').textContent = `#${loteActual.numero}`;
    document.getElementById('loteTipo').textContent = loteActual.tipo;
    document.getElementById('loteCantidad').textContent = `${loteActual.cantidad} cabezas`;
    document.getElementById('loteSexo').textContent = loteActual.sexo;
    document.getElementById('lotePeso').textContent = `${loteActual.peso} kg`;
    document.getElementById('lotePesoTotal').textContent = `${(loteActual.cantidad * loteActual.peso).toLocaleString('es-CO')} kg`;
    document.getElementById('loteRaza').textContent = loteActual.raza;
    document.getElementById('loteProcedencia').textContent = loteActual.procedencia;
    document.getElementById('loteObservaciones').textContent = loteActual.observaciones;
    document.getElementById('precioBase').textContent = formatearPrecio(loteActual.precioBase);
    actualizarPrecioActual();
}

function formatearPrecio(precio) {
    return '$' + precio.toLocaleString('es-CO');
}

function actualizarPrecioActual() {
    const precio = formatearPrecio(loteActual.precioActual);
    document.getElementById('precioActual').textContent = precio;
    document.getElementById('precioActualBar').textContent = precio;
    const proximaPuja = loteActual.precioActual + loteActual.incremento;
    document.getElementById('btnPrecio').textContent = formatearPrecio(proximaPuja);
}

function agregarPuja(paleta, precio, esMiPuja = false, esPresencial = false) {
    const esAutoPuja = String(paleta) === String(loteActual.paletaVendedor);
    const puja = {
        paleta,
        precio,
        esMiPuja,
        esPresencial,
        esAutoPuja,
        timestamp: new Date()
    };
    
    historialPujas.unshift(puja);
    
    // Actualizar precio actual
    loteActual.precioActual = precio;
    actualizarPrecioActual();
    
    // Actualizar historial visual
    renderizarHistorial();
}

function renderizarHistorial() {
    // Historial compacto (modo remoto) → mis pujas en este lote
    const pujasListCompacto = document.getElementById('pujasList');
    if (pujasListCompacto) {
        pujasListCompacto.innerHTML = '';

        const misPujas = historialPujas.filter(p => p.esMiPuja);

        if (misPujas.length === 0) {
            pujasListCompacto.innerHTML = `
                <div class="empty-pujas">
                    <div class="icon">🏷️</div>
                    <p>Aún no has pujado en este lote</p>
                </div>
            `;
        } else {
            misPujas.slice(0, 10).forEach(puja => {
                const pujaElement = document.createElement('div');
                pujaElement.className = 'puja-item mi-puja' + (puja.esAutoPuja ? ' auto-puja' : '');
                const tipo = puja.esPresencial ? '🏟️ Coliseo' : '🌐 Remoto';
                const autoBadge = puja.esAutoPuja ? '<span class="badge-autopuja">🛡️ Respaldo</span>' : '';
                pujaElement.innerHTML = `
                    <div class="puja-header">
                        <span class="puja-paleta">#${puja.paleta}</span>
                        <span class="puja-precio">${formatearPrecio(puja.precio)}</span>
                    </div>
                    <div class="puja-detalles">
                        <span class="puja-tipo">${tipo}</span>
                        <span>⏰ ${formatearTiempo(puja.timestamp)}</span>
                        ${autoBadge}
                    </div>
                `;
                pujasListCompacto.appendChild(pujaElement);
            });
        }
    }

    // Historial grande (modo coliseo) → historial general paginado
    const pujasListGrande = document.getElementById('pujasListGrande');
    if (pujasListGrande) {
        pujasListGrande.innerHTML = '';

        if (historialPujas.length === 0) {
            pujasListGrande.innerHTML = `
                <div class="empty-pujas">
                    <div class="icon">⏳</div>
                    <p>Esperando pujas...</p>
                    <small>Las pujas aparecerán aquí en tiempo real</small>
                </div>
            `;
        } else {
            const totalPaginas = Math.ceil(historialPujas.length / PUJAS_POR_PAGINA);
            if (paginaHistorial > totalPaginas) paginaHistorial = 1;

            const inicio = (paginaHistorial - 1) * PUJAS_POR_PAGINA;
            const paginaActual = historialPujas.slice(inicio, inicio + PUJAS_POR_PAGINA);

            paginaActual.forEach(puja => {
                const pujaElement = document.createElement('div');
                pujaElement.className = 'puja-item'
                    + (puja.esMiPuja ? ' mi-puja' : '')
                    + (puja.esAutoPuja ? ' auto-puja' : '');

                const tipo = puja.esPresencial ? '🏟️ Coliseo' : '🌐 Remoto';
                const autoBadge = puja.esAutoPuja ? '<span class="badge-autopuja">🛡️ Respaldo del vendedor</span>' : '';

                pujaElement.innerHTML = `
                    <div class="puja-info-left">
                        <span class="puja-paleta">#${puja.paleta}</span>
                        <div class="puja-detalles">
                            <span class="puja-tipo">${tipo}</span>
                            <span>⏰ ${formatearTiempo(puja.timestamp)}</span>
                            ${autoBadge}
                        </div>
                    </div>
                    <span class="puja-precio">${formatearPrecio(puja.precio)}</span>
                `;

                pujasListGrande.appendChild(pujaElement);
            });

            if (totalPaginas > 1) {
                const paginacion = document.createElement('div');
                paginacion.className = 'historial-paginacion';
                paginacion.innerHTML = `
                    <button class="btn-pag" onclick="cambiarPaginaHistorial(-1)" ${paginaHistorial === 1 ? 'disabled' : ''}>‹</button>
                    <span>${paginaHistorial} / ${totalPaginas}</span>
                    <button class="btn-pag" onclick="cambiarPaginaHistorial(1)" ${paginaHistorial === totalPaginas ? 'disabled' : ''}>›</button>
                `;
                pujasListGrande.appendChild(paginacion);
            }
        }
    }

    // Espejo mobile del historial compacto
    const pujasListMobile = document.getElementById('pujasListMobile');
    if (pujasListMobile && pujasListCompacto) {
        pujasListMobile.innerHTML = pujasListCompacto.innerHTML;
    }
}



function cambiarPaginaHistorial(delta) {
    const totalPaginas = Math.ceil(historialPujas.length / PUJAS_POR_PAGINA);
    paginaHistorial = Math.max(1, Math.min(paginaHistorial + delta, totalPaginas));
    renderizarHistorial();
}

function registrarCompra(lote, precio) {
    comprasDelDia.push({
        loteNumero: lote.numero,
        tipo: lote.tipo,
        cantidad: lote.cantidad,
        sexo: lote.sexo,
        pesoTotal: lote.cantidad * lote.peso,
        precio
    });
    renderizarResumen();
}

function renderizarResumen() {
    const vacio = document.getElementById('resumenVacio');
    const lista = document.getElementById('resumenLista');
    const total = document.getElementById('resumenTotal');
    const totalValor = document.getElementById('resumenTotalValor');

    if (comprasDelDia.length === 0) {
        vacio.style.display = '';
        lista.style.display = 'none';
        total.style.display = 'none';
        return;
    }

    vacio.style.display = 'none';
    lista.style.display = '';
    total.style.display = '';

    lista.innerHTML = comprasDelDia.map(c => `
        <div class="resumen-item">
            <div class="resumen-item-info">
                <span class="resumen-lote">Lote #${c.loteNumero}</span>
                <span class="resumen-detalle">${c.cantidad} cab. · ${c.sexo} · ${c.pesoTotal.toLocaleString('es-CO')} kg · ${c.tipo}</span>
            </div>
            <span class="resumen-precio">${formatearPrecio(c.precio)}</span>
        </div>
    `).join('');

    const totalDia = comprasDelDia.reduce((sum, c) => sum + c.precio, 0);
    totalValor.textContent = formatearPrecio(totalDia);
}

function formatearTiempo(fecha) {
    const ahora = new Date();
    const diff = Math.floor((ahora - fecha) / 1000);
    
    if (diff < 60) return 'Hace ' + diff + 's';
    if (diff < 3600) return 'Hace ' + Math.floor(diff / 60) + 'm';
    return fecha.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });
}

// Botón de pujar
document.getElementById('btnPujar').addEventListener('click', function() {
    if (!paletaAsignada) return;
    const nuevoPrecio = loteActual.precioActual + loteActual.incremento;
    
    // Agregar mi puja
    agregarPuja(paletaAsignada, nuevoPrecio, true, esPresencial);
    
    // Feedback visual
    this.style.transform = 'scale(0.95)';
    setTimeout(() => {
        this.style.transform = 'scale(1)';
    }, 100);
    
    // Simular pujas de otros usuarios después de un tiempo aleatorio
    setTimeout(simularPujaExterna, Math.random() * 3000 + 2000);
});

// Simular pujas de otros participantes (en producción vendría por WebSocket)
function simularPujaExterna() {
    if (Math.random() > 0.3) { // 70% de probabilidad
        const paletaAleatoria = Math.floor(Math.random() * 900) + 100;
        const esPresencialAleatorio = Math.random() > 0.5;
        const nuevoPrecio = loteActual.precioActual + loteActual.incremento;
        
        agregarPuja(paletaAleatoria, nuevoPrecio, false, esPresencialAleatorio);
        
        // Continuar simulación
        if (loteActual.precioActual < loteActual.precioBase + (loteActual.incremento * 10)) {
            setTimeout(simularPujaExterna, Math.random() * 4000 + 3000);
        }
    }
}

function siguienteLote() {
    // Si el usuario tiene paleta y fue el último en pujar, registrar como compra ganada
    if (paletaAsignada && historialPujas.length > 0 && historialPujas[0].esMiPuja) {
        registrarCompra(loteActual, loteActual.precioActual);
    }

    // Reiniciar para siguiente lote
    loteActual.numero++;
    loteActual.precioBase += 2000000;
    loteActual.precioActual = loteActual.precioBase;
    loteActual.procedencia = 'Finca La Esperanza, Aguazul';
    loteActual.observaciones = 'Lote homogéneo, buen desarrollo muscular.';
    loteActual.sexo = loteActual.numero % 2 === 0 ? 'Hembra' : 'Macho';
    historialPujas = [];
    paginaHistorial = 1;

    actualizarLote();
    renderizarHistorial();

    // Simular nueva actividad
    setTimeout(simularPujaExterna, Math.random() * 3000 + 2000);
}

// Inicializar
actualizarLote();

// Simular algunas pujas iniciales
setTimeout(() => {
    agregarPuja(234, 15500000, false, true);
}, 1000);

setTimeout(() => {
    agregarPuja(567, 16000000, false, false);
}, 2000);

setTimeout(() => {
    agregarPuja(123, 16500000, false, true);
}, 3000);

// Iniciar simulación de pujas externas
setTimeout(simularPujaExterna, 5000);


// Función para cambiar entre modos (para demo)
function cambiarModo() {
    const subastaContent = document.querySelector('.subasta-content');
    const esPresencialActual = subastaContent.classList.contains('modo-presencial');
    
    if (esPresencialActual) {
        // Cambiar a remoto
        subastaContent.classList.remove('modo-presencial');
        subastaContent.classList.add('modo-remoto');
        document.getElementById('modoIcon').textContent = '🌐';
        document.getElementById('modoTexto').textContent = 'Remoto';
    } else {
        // Cambiar a coliseo
        subastaContent.classList.remove('modo-remoto');
        subastaContent.classList.add('modo-presencial');
        document.getElementById('modoIcon').textContent = '🏟️';
        document.getElementById('modoTexto').textContent = 'Coliseo';
    }
    
    // Re-renderizar historial
    renderizarHistorial();
}

// Actualizar botón de modo inicial
if (esPresencial) {
    document.getElementById('modoIcon').textContent = '🏟️';
    document.getElementById('modoTexto').textContent = 'Coliseo';
} else {
    document.getElementById('modoIcon').textContent = '🌐';
    document.getElementById('modoTexto').textContent = 'Remoto';
}
