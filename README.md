# Sistema de Subastas Ganaderas - Casanare

Prototipo de plataforma web híbrida para subastas ganaderas con participación presencial y remota en tiempo real.

## 🎯 Características Principales

- **Sistema Híbrido**: Participación presencial y remota simultánea
- **Paletas Digitales**: Asignación automática de número de paleta único
- **Transmisión en Vivo**: Simulación de streaming del martillero
- **Pujas en Tiempo Real**: Sincronización instantánea de ofertas
- **Catálogo de Lotes**: Visualización previa de ganado disponible
- **Historial de Pujas**: Seguimiento en vivo de todas las ofertas
- **Panel del Martillero**: Control completo de la subasta en vivo
- **Panel de Administración**: Gestión de eventos, lotes y usuarios

## 📁 Estructura del Proyecto

```
/
├── index.html              # Página principal
├── registro.html           # Registro de usuarios
├── login.html             # Inicio de sesión
├── dashboard.html         # Panel de usuario
├── subasta-live.html      # Sala de subasta en vivo (Compradores)
├── panel-martillero.html  # Panel del Martillero (NUEVO)
├── panel-admin.html       # Panel de Administración (NUEVO)
├── catalogo.html          # Catálogo de lotes
├── css/
│   ├── styles.css         # Estilos generales
│   ├── forms.css          # Estilos de formularios
│   ├── dashboard.css      # Estilos del dashboard
│   ├── subasta.css        # Estilos de la subasta en vivo
│   ├── panel-martillero.css  # Estilos del panel del martillero
│   ├── panel-admin.css    # Estilos del panel de administración
│   └── catalogo.css       # Estilos del catálogo
└── js/
    ├── registro.js        # Lógica de registro
    ├── login.js           # Lógica de login
    ├── dashboard.js       # Lógica del dashboard
    ├── subasta-live.js    # Lógica de subasta (Compradores)
    ├── panel-martillero.js  # Lógica del panel del martillero
    ├── panel-admin.js     # Lógica del panel de administración
    └── catalogo.js        # Lógica del catálogo
```

## 🚀 Cómo Usar el Demo

### 1. Abrir el Proyecto
Simplemente abre `index.html` en tu navegador web.

### 2. Registrarse
- Haz clic en "Registrarse"
- Completa el formulario
- Selecciona tu tipo de usuario:
  - **Comprador**: Para participar en subastas
  - **Vendedor/Ganadero**: Para vender ganado
  - **Martillero**: Para controlar subastas (acceso al panel del martillero)
  - **Administrador**: Para gestionar el sistema completo
- El sistema te asignará automáticamente un número de paleta único
- Guarda tu número de paleta

### 3. Iniciar Sesión
- Usa el email y contraseña que registraste
- Serás redirigido al dashboard
- Verás opciones según tu rol

### 4. Roles y Accesos

#### Comprador/Vendedor:
- Ver catálogo de lotes
- Entrar a subasta en vivo
- Realizar pujas
- Ver historial

#### Martillero:
- Acceso al Panel del Martillero
- Iniciar/pausar/cerrar subastas
- Ver pujas en tiempo real
- Controlar flujo de lotes
- Adjudicar ganadores
- Ver estadísticas en vivo

#### Administrador:
- Acceso completo al Panel de Administración
- Gestionar eventos de subasta
- Crear y editar lotes
- Administrar usuarios
- Ver resultados y estadísticas
- Configurar parámetros del sistema
- Exportar reportes

### 5. Panel del Martillero
- Haz clic en "Panel del Martillero" desde el dashboard
- Controles disponibles:
  - **Iniciar Subasta**: Activa el lote actual
  - **Pausar**: Detiene temporalmente las pujas
  - **Cerrar Lote**: Finaliza y adjudica al ganador
- Verás pujas en tiempo real con identificación de presencial/remoto
- Estadísticas actualizadas automáticamente
- Navegación entre lotes

### 6. Panel de Administración
- Haz clic en "Panel de Administración" desde el dashboard
- Secciones disponibles:
  - **Eventos**: Crear y gestionar subastas
  - **Lotes**: Agregar y editar ganado
  - **Usuarios**: Ver y administrar participantes
  - **Resultados**: Historial de subastas completadas
  - **Configuración**: Parámetros del sistema

## 🔑 Conceptos Clave del Sistema Híbrido

### Paleta Digital
Cada usuario recibe un número único al registrarse. Este número funciona como su "paleta" tanto si está presencial como remoto.

### Modo Presencial vs Remoto
- **Presencial**: Usuario está físicamente en el evento, usa su dispositivo para pujar
- **Remoto**: Usuario ve la transmisión desde casa y puja online
- Ambos se sincronizan en el mismo sistema en tiempo real

### Sincronización
Todas las pujas (físicas digitales y remotas) se muestran instantáneamente a:
- El martillero (en su panel)
- Todos los participantes presenciales
- Todos los participantes remotos

## 💡 Funcionalidades Implementadas

### Módulo de Compradores:
✅ Registro de usuarios con asignación de paleta
✅ Sistema de autenticación
✅ Dashboard personalizado
✅ Catálogo de lotes con filtros
✅ Sala de subasta en vivo
✅ Sistema de pujas en tiempo real
✅ Historial de pujas con identificación de tipo (presencial/remoto)
✅ Simulación de pujas de otros participantes

### Módulo del Martillero:
✅ Panel de control de subasta en vivo
✅ Iniciar/pausar/cerrar lotes
✅ Visualización de pujas en tiempo real
✅ Identificación de pujas presenciales vs remotas
✅ Estadísticas en vivo (total pujas, participantes, etc.)
✅ Navegación entre lotes
✅ Sistema de adjudicación de ganadores
✅ Alertas visuales de nuevas pujas
✅ Historial completo de pujas por lote

### Módulo de Administración:
✅ Gestión de eventos de subasta
✅ Creación y edición de lotes
✅ Administración de usuarios
✅ **Registro presencial de usuarios** (para ganaderos sin acceso a tecnología)
✅ Búsqueda y filtrado de usuarios
✅ Edición de información de usuarios
✅ Visualización de resultados históricos
✅ Exportación de datos a CSV
✅ Configuración de parámetros del sistema
✅ Estadísticas generales
✅ Control de acceso por roles
✅ Generación automática de credenciales
✅ Impresión de credenciales para usuarios

### General:
✅ Diseño responsive (móvil, tablet, desktop)
✅ Interfaz moderna e intuitiva
✅ Sistema de roles y permisos
✅ Almacenamiento local de datos

## 🔮 Para Implementación Real

Para convertir este prototipo en un sistema de producción, necesitarías:

1. **Backend**:
   - Node.js + Express
   - Base de datos (PostgreSQL/MongoDB)
   - WebSockets (Socket.io) para tiempo real
   - Autenticación JWT

2. **Streaming**:
   - Servidor de streaming (WebRTC, HLS)
   - CDN para distribución
   - Latencia ultra baja (<250ms)

3. **Seguridad**:
   - Verificación de identidad (KYC)
   - Autenticación de dos factores
   - Encriptación SSL/TLS
   - Sistema de garantías/depósitos

4. **Funcionalidades Adicionales**:
   - Panel del martillero
   - Sistema de pagos
   - Generación de facturas
   - Notificaciones push
   - Chat en vivo
   - Grabación de subastas
   - Reportes y estadísticas

## 📱 Tecnologías Utilizadas

- HTML5
- CSS3 (Grid, Flexbox, Animations)
- JavaScript Vanilla (ES6+)
- LocalStorage (simulación de base de datos)

## 🎨 Diseño

- Interfaz moderna y limpia
- Colores corporativos personalizables
- Animaciones suaves
- Responsive design
- Accesibilidad considerada

## 📝 Notas Importantes

- Este es un PROTOTIPO/DEMO funcional
- Los datos se guardan en LocalStorage (se borran al limpiar el navegador)
- Las pujas de otros usuarios son simuladas
- El video del martillero es un placeholder
- En producción, todo debe conectarse a un backend real con WebSockets

## 🤝 Contacto

Para más información sobre la implementación completa del sistema, contacta al equipo de desarrollo.

---

**Desarrollado para Subastas Ganaderas Casanare - 2026**
