// ── Categorías desde el módulo admin ─────────────────────────────────────────

const CATEGORIAS_KEY = 'categorias_ganado';

const categoriasDefault = [
    { id: 1, codigo: 'ML', nombre: 'Macho de Levante',   sexo: 'macho'  },
    { id: 2, codigo: 'MC', nombre: 'Macho de Ceba',      sexo: 'macho'  },
    { id: 3, codigo: 'TP', nombre: 'Toro Puro',          sexo: 'macho'  },
    { id: 4, codigo: 'NL', nombre: 'Novilla de Levante', sexo: 'hembra' },
    { id: 5, codigo: 'VP', nombre: 'Vaca Parida',        sexo: 'hembra' },
    { id: 6, codigo: 'VH', nombre: 'Vaca Horra',         sexo: 'hembra' },
];

function getCategorias() {
    return JSON.parse(localStorage.getItem(CATEGORIAS_KEY) || 'null') || categoriasDefault;
}

function getCatPorCodigo(codigo) {
    return getCategorias().find(c => c.codigo === (codigo || '').toUpperCase());
}

// Poblar el select de filtro con las categorías reales agrupadas por sexo
function poblarFiltroCategoria() {
    const select = document.getElementById('filtroTipo');
    const cats   = getCategorias();
    const grupos = { macho: [], hembra: [], mixto: [] };
    cats.forEach(c => { (grupos[c.sexo] || grupos.mixto).push(c); });
    const labels = { macho: '♂ Machos', hembra: '♀ Hembras', mixto: '⚥ Mixto' };

    select.innerHTML = '<option value="">Todas las categorías</option>';
    Object.entries(grupos).forEach(([sexo, lista]) => {
        if (!lista.length) return;
        const group = document.createElement('optgroup');
        group.label = labels[sexo];
        lista.forEach(c => {
            const opt = document.createElement('option');
            opt.value       = c.codigo;
            opt.textContent = `${c.codigo} — ${c.nombre}`;
            group.appendChild(opt);
        });
        select.appendChild(group);
    });
}

// ── Lotes ─────────────────────────────────────────────────────────────────────

const lotesAdmin = JSON.parse(localStorage.getItem('lotesAdmin') || '[]');

const lotesEjemplo = [
    { numero: 1, categoria: 'MC', cantidad: 15, peso: 480, raza: 'Brahman',   sexo: 'Macho',  precioBase: 18000000, vendedor: 'Carlos Martínez',         procedencia: 'Finca El Paraíso, Yopal',         adjuntos: [] },
    { numero: 2, categoria: 'ML', cantidad: 20, peso: 320, raza: 'Cebú',      sexo: 'Macho',  precioBase: 12000000, vendedor: 'Hacienda Los Llanos S.A.S', procedencia: 'Finca La Esperanza, Aguazul',     adjuntos: [] },
    { numero: 3, categoria: 'TP', cantidad: 10, peso: 450, raza: 'Angus',     sexo: 'Macho',  precioBase: 15000000, vendedor: 'José Rodríguez e Hijos',    procedencia: 'Finca Santa Rosa, Tauramena',     adjuntos: [] },
    { numero: 4, categoria: 'VP', cantidad:  8, peso: 520, raza: 'Brahman',   sexo: 'Hembra', precioBase: 22000000, vendedor: 'Agropecuaria El Llano',     procedencia: 'Finca Bella Vista, Yopal',        adjuntos: [] },
    { numero: 5, categoria: 'ML', cantidad: 25, peso: 280, raza: 'Mestizo',   sexo: 'Macho',  precioBase: 10000000, vendedor: 'Ganadería San Pedro',       procedencia: 'Finca El Retiro, Paz de Ariporo', adjuntos: [] },
    { numero: 6, categoria: 'MC', cantidad: 12, peso: 500, raza: 'Simmental', sexo: 'Macho',  precioBase: 20000000, vendedor: 'Inversiones Casanare',      procedencia: 'Finca La Palma, Villanueva',      adjuntos: [] },
    { numero: 7, categoria: 'VH', cantidad:  6, peso: 550, raza: 'Gyr',       sexo: 'Hembra', precioBase: 25000000, vendedor: 'Hacienda Ganadera Casanare', procedencia: 'Finca Los Algarrobos, Orocué',   adjuntos: [] },
    { numero: 8, categoria: 'NL', cantidad: 18, peso: 300, raza: 'Brahman',   sexo: 'Hembra', precioBase: 11000000, vendedor: 'Rancho El Progreso',        procedencia: 'Finca El Progreso, Trinidad',     adjuntos: [] },
];

// Normalizar lote del admin: puede venir con campo 'categoria' (código) o 'tipo' (legacy)
function normalizarLote(l) {
    const cat = getCatPorCodigo(l.categoria) || getCatPorCodigo(l.tipo);
    return {
        numero:      l.numero,
        categoria:   cat ? cat.codigo : (l.categoria || l.tipo || '—'),
        catNombre:   cat ? cat.nombre : (l.tipoNombre || l.tipo || '—'),
        catSexo:     cat ? cat.sexo   : '',
        cantidad:    l.cantidad,
        peso:        l.peso,
        raza:        l.raza,
        sexo:        l.sexo,
        vendedor:    l.vendedor,
        procedencia: l.procedencia,
        precioBase:  l.precioBase,
        estado:      l.estado,
        adjuntos:    (l.adjuntos || []).filter(a => a && a.tipo && a.tipo.startsWith('image/'))
    };
}

const lotes = (lotesAdmin.length ? lotesAdmin : lotesEjemplo).map(normalizarLote);

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatearPrecio(precio) {
    return '$' + precio.toLocaleString('es-CO');
}

function badgeColor(sexo) {
    if (sexo === 'macho')  return '#1d4ed8';
    if (sexo === 'hembra') return '#be185d';
    return '#6d28d9';
}

function buildImagenHTML(lote) {
    const imgs = lote.adjuntos || [];
    const color = badgeColor(lote.catSexo);

    if (imgs.length === 0) {
        return `
            <div class="lote-img-placeholder" style="background:${color}10;border-color:${color}30;">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                     stroke="${color}" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M3 9c0-1.1.9-2 2-2h1l1-2h8l1 2h1a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9z"/>
                    <circle cx="12" cy="13" r="3"/>
                </svg>
                <span>Sin imágenes</span>
            </div>`;
    }

    if (imgs.length === 1) {
        return `<div class="lote-img-single">
            <img src="${imgs[0].datos}" alt="Lote #${lote.numero}" loading="lazy"
                 onclick="abrirGaleria(${lote.numero}, 0)">
        </div>`;
    }

    const visibles = imgs.slice(0, 4);
    const resto    = imgs.length - 4;
    const cells    = visibles.map((img, i) => {
        const overlay = (i === 3 && resto > 0) ? `<div class="img-mas">+${resto}</div>` : '';
        return `<div class="img-thumb" onclick="abrirGaleria(${lote.numero}, ${i})">
                    <img src="${img.datos}" alt="foto ${i + 1}" loading="lazy">${overlay}
                </div>`;
    }).join('');

    return `<div class="lote-img-grid lote-img-grid--${visibles.length}">${cells}</div>`;
}

// ── Galería lightbox ──────────────────────────────────────────────────────────

let galeriaLote = null;
let galeriaIdx  = 0;

function abrirGaleria(numeroLote, idx) {
    galeriaLote = lotes.find(l => l.numero === numeroLote);
    galeriaIdx  = idx;
    if (!galeriaLote || !galeriaLote.adjuntos.length) return;
    renderizarGaleria();
    document.getElementById('galeriaOverlay').style.display = 'flex';
}

function renderizarGaleria() {
    const imgs = galeriaLote.adjuntos;
    document.getElementById('galeriaImg').src = imgs[galeriaIdx].datos;
    document.getElementById('galeriaContador').textContent = `${galeriaIdx + 1} / ${imgs.length}`;
    document.getElementById('galeriaPrev').style.visibility = galeriaIdx > 0 ? 'visible' : 'hidden';
    document.getElementById('galeriaNext').style.visibility = galeriaIdx < imgs.length - 1 ? 'visible' : 'hidden';
}

function galeriaNavegar(delta) {
    galeriaIdx = Math.max(0, Math.min(galeriaIdx + delta, galeriaLote.adjuntos.length - 1));
    renderizarGaleria();
}

function cerrarGaleria() {
    document.getElementById('galeriaOverlay').style.display = 'none';
}

// ── Render catálogo ───────────────────────────────────────────────────────────

function renderizarLotes(lotesFiltrados = lotes) {
    const grid = document.getElementById('lotesGrid');
    grid.innerHTML = '';
    document.getElementById('totalLotes').textContent = lotesFiltrados.length;

    if (lotesFiltrados.length === 0) {
        grid.innerHTML = `
            <div class="empty-state" style="grid-column:1/-1;">
                <div class="icon">📦</div>
                <h3>No se encontraron lotes</h3>
                <p>Intenta con otro filtro</p>
            </div>`;
        return;
    }

    lotesFiltrados.forEach(lote => {
        const color = badgeColor(lote.catSexo);
        const card  = document.createElement('div');
        card.className = 'lote-card';
        card.innerHTML = `
            <div class="lote-imagen">${buildImagenHTML(lote)}</div>
            <div class="lote-contenido">
                <div class="lote-header">
                    <span class="lote-numero">Lote #${lote.numero}</span>
                    <span class="lote-badge-cat" style="background:${color}18;color:${color};border:1px solid ${color}40;">
                        ${lote.categoria} — ${lote.catNombre}
                    </span>
                </div>
                <div class="lote-detalles">
                    <div class="detalle-row">
                        <span class="detalle-label">Cantidad:</span>
                        <span class="detalle-valor">${lote.cantidad} cabezas</span>
                    </div>
                    <div class="detalle-row">
                        <span class="detalle-label">Peso Promedio:</span>
                        <span class="detalle-valor">${lote.peso} kg</span>
                    </div>
                    <div class="detalle-row">
                        <span class="detalle-label">Raza:</span>
                        <span class="detalle-valor">${lote.raza}</span>
                    </div>
                    ${lote.vendedor ? `<div class="detalle-row">
                        <span class="detalle-label">Vendedor:</span>
                        <span class="detalle-valor">${lote.vendedor}</span>
                    </div>` : ''}
                </div>
                <div class="lote-precio">
                    <span class="label">Precio Base</span>
                    <div class="precio">${formatearPrecio(lote.precioBase)}</div>
                </div>
                <div class="lote-acciones">
                    <a href="subasta-live.html" class="btn-ver-detalle">Ver en Subasta</a>
                </div>
            </div>`;
        grid.appendChild(card);
    });
}

function filtrarLotes() {
    const cat     = document.getElementById('filtroTipo').value;
    const pesoMin = parseFloat(document.getElementById('pesoMin').value) || 0;
    const pesoMax = parseFloat(document.getElementById('pesoMax').value) || Infinity;

    renderizarLotes(lotes.filter(l =>
        (!cat || l.categoria === cat) &&
        l.peso >= pesoMin && l.peso <= pesoMax
    ));
}

function limpiarFiltros() {
    document.getElementById('filtroTipo').value = '';
    document.getElementById('pesoMin').value    = '';
    document.getElementById('pesoMax').value    = '';
    renderizarLotes();
}

// ── Init ──────────────────────────────────────────────────────────────────────
poblarFiltroCategoria();
renderizarLotes();
