# 📸 Instrucciones para Agregar el Logo de SubaCasanare

## 📁 Estructura de Carpetas

Crea la siguiente estructura si no existe:

```
proyecto/
├── images/
│   ├── logo-subacasanare.png          (Logo para navbar - fondo claro)
│   └── logo-subacasanare-white.png    (Logo para footer - fondo oscuro)
```

---

## 🎨 Especificaciones del Logo

### Logo para Navbar (logo-subacasanare.png)

**Características:**
- Formato: PNG con fondo transparente
- Altura recomendada: 150-200px (se ajustará automáticamente a 45px)
- Colores: Logo original de SubaCasanare
- Uso: Navbar (fondo blanco)

### Logo para Footer (logo-subacasanare-white.png)

**Opciones:**

**Opción 1 - Versión Blanca:**
- Si tienes una versión blanca del logo, úsala
- Formato: PNG con fondo transparente
- Altura recomendada: 150-200px

**Opción 2 - Usar el Mismo Logo:**
- Si solo tienes una versión, usa el mismo archivo
- El CSS aplicará un filtro automático para convertirlo a blanco
- Simplemente copia `logo-subacasanare.png` y renómbralo a `logo-subacasanare-white.png`

---

## 📋 Pasos para Agregar el Logo

### Paso 1: Crear la Carpeta
```bash
# En la raíz del proyecto, crea la carpeta images
mkdir images
```

### Paso 2: Agregar los Archivos
1. Guarda tu logo como `logo-subacasanare.png`
2. Colócalo en la carpeta `images/`
3. Si tienes versión blanca, guárdala como `logo-subacasanare-white.png`
4. Si no, copia el mismo archivo con el nombre `logo-subacasanare-white.png`

### Paso 3: Verificar
Abre `index.html` en el navegador y verifica que:
- ✅ El logo aparece en el navbar (arriba)
- ✅ El logo aparece en el footer (abajo)
- ✅ El logo en el footer se ve en blanco

---

## 🔧 Ajustes Opcionales

### Si el logo se ve muy grande o pequeño:

**En el Navbar:**
Edita `css/home.css`, busca `.brand-logo` y ajusta:
```css
.brand-logo {
    height: 45px;  /* Cambia este valor (30px - 60px) */
    width: auto;
    object-fit: contain;
}
```

**En el Footer:**
Busca `.footer-brand .brand-logo` y ajusta:
```css
.footer-brand .brand-logo {
    height: 40px;  /* Cambia este valor (30px - 50px) */
    width: auto;
    object-fit: contain;
    filter: brightness(0) invert(1);
}
```

### Si el logo del footer no se ve bien en blanco:

Opción 1 - Quitar el filtro:
```css
.footer-brand .brand-logo {
    height: 40px;
    width: auto;
    object-fit: contain;
    /* filter: brightness(0) invert(1); */ /* Comentar esta línea */
}
```

Opción 2 - Usar una versión blanca real del logo

---

## 🎯 Formatos Alternativos

Si tu logo está en otro formato:

### SVG (Recomendado)
```html
<!-- Cambiar en index.html -->
<img src="images/logo-subacasanare.svg" alt="SubaCasanare Logo" class="brand-logo">
```

### JPG
```html
<img src="images/logo-subacasanare.jpg" alt="SubaCasanare Logo" class="brand-logo">
```

**Nota:** PNG con transparencia es el formato ideal

---

## 📱 Responsive

El logo se ajustará automáticamente en dispositivos móviles:
- Desktop: 45px de altura
- Móvil: Se mantiene proporcional

Si necesitas ajustes específicos para móvil, agrega en `css/home.css`:

```css
@media (max-width: 768px) {
    .brand-logo {
        height: 35px;  /* Más pequeño en móvil */
    }
    
    .brand-name {
        font-size: 1.2em;  /* Texto más pequeño */
    }
}
```

---

## ✅ Checklist Final

Antes de considerar terminado:

- [ ] Logo en carpeta `images/`
- [ ] Archivo `logo-subacasanare.png` existe
- [ ] Archivo `logo-subacasanare-white.png` existe
- [ ] Logo visible en navbar
- [ ] Logo visible en footer
- [ ] Logo se ve bien en móvil
- [ ] Logo se ve bien en diferentes navegadores

---

## 🆘 Solución de Problemas

**El logo no aparece:**
- Verifica que la ruta sea correcta: `images/logo-subacasanare.png`
- Verifica que el archivo exista en la carpeta
- Abre la consola del navegador (F12) y busca errores

**El logo se ve distorsionado:**
- Asegúrate de que `object-fit: contain;` esté en el CSS
- Verifica que el logo original tenga buena calidad

**El logo es muy grande:**
- Reduce el valor de `height` en el CSS
- Recomendado: 35px - 50px

**El logo del footer no se ve:**
- Verifica que el archivo `logo-subacasanare-white.png` exista
- Si el fondo del footer es claro, quita el filtro de inversión

---

## 📧 Necesitas Ayuda?

Si tienes problemas para agregar el logo:
1. Verifica que los archivos estén en la carpeta correcta
2. Revisa la consola del navegador (F12) para errores
3. Comprueba que los nombres de archivo coincidan exactamente

---

**¡Listo! Una vez agregues el logo, la interfaz estará completamente personalizada para SubaCasanare.**
