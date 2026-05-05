# 🚀 Guía Rápida de Uso

## Acceso Rápido por Roles

Para probar el sistema rápidamente, puedes crear usuarios con diferentes roles:

### 1️⃣ Crear Usuario Comprador
1. Ir a `registro.html`
2. Llenar formulario
3. Seleccionar: **Comprador**
4. Anotar tu número de paleta
5. Iniciar sesión

**Acceso a:**
- Dashboard
- Catálogo de lotes
- Subasta en vivo (pujar)

---

### 2️⃣ Crear Usuario Martillero
1. Ir a `registro.html`
2. Llenar formulario
3. Seleccionar: **Martillero**
4. Iniciar sesión

**Acceso a:**
- Dashboard
- **Panel del Martillero** ⭐
  - Controlar subasta en vivo
  - Ver pujas en tiempo real
  - Cerrar lotes y adjudicar

---

### 3️⃣ Crear Usuario Administrador
1. Ir a `registro.html`
2. Llenar formulario
3. Seleccionar: **Administrador**
4. Iniciar sesión

**Acceso a:**
- Dashboard
- Panel del Martillero
- **Panel de Administración** ⭐
  - Gestionar eventos
  - Crear lotes
  - Administrar usuarios
  - Ver resultados
  - Configuración

---

## 🎬 Flujo de Demostración Completo

### Escenario: Subasta en Vivo

#### Paso 1: Preparación (Administrador)
1. Login como **Administrador**
2. Ir a Panel de Administración
3. Crear un evento de subasta
4. Agregar lotes de ganado
5. Verificar que todo esté listo

#### Paso 2: Control de Subasta (Martillero)
1. Login como **Martillero**
2. Ir a Panel del Martillero
3. Verificar lote actual
4. Hacer clic en **"Iniciar Subasta"**
5. Observar pujas entrando en tiempo real
6. Cuando termine, hacer clic en **"Cerrar Lote"**
7. Confirmar ganador
8. Pasar al siguiente lote

#### Paso 3: Participación (Compradores)
1. Login como **Comprador** (puedes abrir múltiples ventanas)
2. Ir a "Entrar a la Subasta"
3. Ver transmisión del martillero
4. Hacer clic en **"PUJAR"**
5. Ver tu puja en el historial
6. Competir con otros participantes

---

## 🔑 Diferencias Clave entre Roles

| Característica | Comprador | Martillero | Admin |
|---------------|-----------|------------|-------|
| Ver catálogo | ✅ | ✅ | ✅ |
| Pujar en subasta | ✅ | ❌ | ❌ |
| Controlar subasta | ❌ | ✅ | ✅ |
| Cerrar lotes | ❌ | ✅ | ✅ |
| Crear eventos | ❌ | ❌ | ✅ |
| Gestionar usuarios | ❌ | ❌ | ✅ |
| Ver resultados | Propios | Todos | Todos |

---

## 💡 Tips para la Demo

### Para impresionar en la presentación:

1. **Prepara 3 navegadores/ventanas:**
   - Ventana 1: Panel del Martillero
   - Ventana 2: Comprador Presencial
   - Ventana 3: Comprador Remoto

2. **Muestra el flujo completo:**
   - Martillero inicia la subasta
   - Compradores pujan desde diferentes ubicaciones
   - Pujas se sincronizan en tiempo real
   - Martillero ve todo y cierra el lote

3. **Destaca características únicas:**
   - Identificación de pujas presenciales vs remotas
   - Sincronización instantánea
   - Panel del martillero con estadísticas en vivo
   - Sistema de adjudicación automática

4. **Muestra el panel de administración:**
   - Gestión de eventos
   - Creación de lotes
   - Reportes y estadísticas

---

## 🎯 Puntos Clave para Explicar

### Sistema Híbrido:
- **Presencial**: Usuario está en el evento físico, usa su celular/tablet
- **Remoto**: Usuario ve desde casa por streaming
- **Ambos**: Usan la misma plataforma, mismas pujas sincronizadas

### Paleta Digital:
- Cada usuario tiene un número único
- Funciona igual presencial o remoto
- El martillero ve de dónde viene cada puja

### Tiempo Real:
- WebSockets simulados (en producción serían reales)
- Latencia mínima
- Todas las pujas visibles instantáneamente

---

## 📱 Prueba en Móvil

El sistema es responsive. Prueba en tu celular:
1. Abre `index.html` en el navegador del móvil
2. Regístrate como comprador
3. Entra a la subasta
4. Puja desde el móvil

---

## 🐛 Solución de Problemas

**No veo el Panel del Martillero:**
- Verifica que te registraste como "Martillero" o "Administrador"

**No veo el Panel de Administración:**
- Solo usuarios con rol "Administrador" tienen acceso

**Las pujas no aparecen:**
- Asegúrate de que la subasta esté "Iniciada" (botón verde en panel del martillero)

**Perdí mi número de paleta:**
- Revisa en el Dashboard, aparece en la esquina superior derecha

---

## 📊 Datos de Prueba

El sistema viene con datos de ejemplo:
- 2 eventos pre-cargados
- 8 lotes en el catálogo
- Simulación automática de pujas

Puedes agregar más desde el Panel de Administración.

---

**¡Listo para demostrar! 🎉**
