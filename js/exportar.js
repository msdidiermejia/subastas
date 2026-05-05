/**
 * exportar.js — Utilidades de exportación a Excel (CSV) y PDF
 * Sin dependencias externas. Usa APIs nativas del navegador.
 */

// ── Excel (CSV con BOM UTF-8 para compatibilidad con Excel) ──────────────────

function exportarExcel(columnas, filas, nombreArchivo) {
    // columnas: [{ titulo, campo }] o [string]
    // filas: array de objetos o array de arrays

    const encabezados = columnas.map(c => typeof c === 'string' ? c : c.titulo);
    const campos      = columnas.map(c => typeof c === 'string' ? null : c.campo);

    const escapar = val => {
        if (val === null || val === undefined) return '';
        const str = String(val).replace(/"/g, '""');
        return /[,"\n\r]/.test(str) ? `"${str}"` : str;
    };

    const lineas = [encabezados.map(escapar).join(',')];

    filas.forEach(fila => {
        const valores = campos[0] !== null
            ? campos.map(c => escapar(fila[c]))
            : fila.map(escapar);
        lineas.push(valores.join(','));
    });

    // BOM para que Excel reconozca UTF-8
    const bom  = '\uFEFF';
    const blob = new Blob([bom + lineas.join('\r\n')], { type: 'text/csv;charset=utf-8;' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = nombreArchivo.endsWith('.csv') ? nombreArchivo : nombreArchivo + '.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// ── PDF (ventana de impresión con estilos dedicados) ─────────────────────────

function exportarPDF(titulo, columnas, filas, nombreArchivo, metadatos) {
    const encabezados = columnas.map(c => typeof c === 'string' ? c : c.titulo);
    const campos      = columnas.map(c => typeof c === 'string' ? null : c.campo);

    const filaHTML = (fila, idx) => {
        const celdas = campos[0] !== null
            ? campos.map(c => `<td>${fila[c] ?? ''}</td>`).join('')
            : fila.map(v => `<td>${v ?? ''}</td>`).join('');
        return `<tr class="${idx % 2 === 0 ? 'par' : 'impar'}">${celdas}</tr>`;
    };

    const metaHTML = metadatos
        ? Object.entries(metadatos).map(([k, v]) => `<div class="meta-item"><span>${k}:</span><strong>${v}</strong></div>`).join('')
        : '';

    const html = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<title>${titulo}</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: Arial, sans-serif; font-size: 11px; color: #1a1a1a; padding: 20px; }
  .pdf-header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 3px solid #E8751A; padding-bottom: 12px; margin-bottom: 14px; }
  .pdf-titulo { font-size: 18px; font-weight: 900; color: #E8751A; }
  .pdf-empresa { font-size: 11px; color: #555; margin-top: 2px; }
  .pdf-fecha { font-size: 10px; color: #888; text-align: right; }
  .meta-bar { display: flex; flex-wrap: wrap; gap: 16px; background: #f8f8f8; border-radius: 6px; padding: 8px 12px; margin-bottom: 14px; }
  .meta-item { font-size: 10px; color: #555; } .meta-item strong { color: #1a1a1a; margin-left: 4px; }
  table { width: 100%; border-collapse: collapse; margin-top: 4px; }
  thead tr { background: #E8751A; color: #fff; }
  th { padding: 7px 8px; text-align: left; font-size: 10px; font-weight: 700; letter-spacing: 0.3px; }
  td { padding: 6px 8px; font-size: 10px; border-bottom: 1px solid #eee; }
  tr.par td { background: #fff; }
  tr.impar td { background: #fafafa; }
  .pdf-footer { margin-top: 16px; font-size: 9px; color: #aaa; text-align: center; border-top: 1px solid #eee; padding-top: 8px; }
  .total-filas { margin-top: 8px; font-size: 10px; color: #555; text-align: right; }
  @media print { body { padding: 10px; } button { display: none; } }
</style>
</head>
<body>
<div class="pdf-header">
  <div>
    <div class="pdf-titulo">${titulo}</div>
    <div class="pdf-empresa">SubaCasanare — Subastas Ganaderas</div>
  </div>
  <div class="pdf-fecha">Generado: ${new Date().toLocaleString('es-CO')}</div>
</div>
${metaHTML ? `<div class="meta-bar">${metaHTML}</div>` : ''}
<table>
  <thead><tr>${encabezados.map(h => `<th>${h}</th>`).join('')}</tr></thead>
  <tbody>${filas.map((f, i) => filaHTML(f, i)).join('')}</tbody>
</table>
<div class="total-filas">Total registros: ${filas.length}</div>
<div class="pdf-footer">SubaCasanare &bull; Documento generado automáticamente &bull; ${new Date().toLocaleDateString('es-CO')}</div>
<script>window.onload = () => { window.print(); }<\/script>
</body></html>`;

    const ventana = window.open('', '_blank', 'width=900,height=700');
    ventana.document.write(html);
    ventana.document.close();
}

// ── Botones de exportación reutilizables ─────────────────────────────────────

/**
 * Inserta botones Excel + PDF en un contenedor dado.
 * onExcel y onPDF son funciones callback.
 */
function crearBotonesExport(contenedorId, onExcel, onPDF) {
    const contenedor = document.getElementById(contenedorId);
    if (!contenedor) return;
    const wrap = document.createElement('div');
    wrap.className = 'export-btns';
    wrap.innerHTML = `
        <button class="btn-export btn-excel" onclick="(${onExcel.toString()})()">📊 Excel</button>
        <button class="btn-export btn-pdf"   onclick="(${onPDF.toString()})()">📄 PDF</button>
    `;
    contenedor.appendChild(wrap);
}
