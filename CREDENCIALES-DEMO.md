# 🔑 Credenciales de Acceso - Demo

## Usuarios Pre-configurados para Pruebas

---

## 👨‍💼 ADMINISTRADOR

**Acceso completo al sistema**

```
Email:    admin@subastas.com
Password: Admin123
Rol:      Administrador
Paleta:   #001
```

**Acceso a:**
- ✅ Dashboard
- ✅ Panel de Administración (completo)
- ✅ Panel del Martillero
- ✅ Catálogo de lotes
- ✅ Subasta en vivo (como observador)

---

## 🎤 MARTILLERO

**Control de subastas en vivo**

```
Email:    martillero@subastas.com
Password: Martillero123
Rol:      Martillero
Paleta:   Sin paleta (por transparencia)
```

**Acceso a:**
- ✅ Dashboard
- ✅ Panel del Martillero
- ✅ Catálogo de lotes
- ❌ Panel de Administración

---

## 🤝 CLIENTE 1

**Participante presencial**

```
Email:    cliente1@email.com
Password: Cliente123
Rol:      Cliente
Paleta:   #101
Modo:     Presencial (simulado)
```

**Acceso a:**
- ✅ Dashboard
- ✅ Catálogo de lotes
- ✅ Subasta en vivo (pujar)
- ❌ Paneles administrativos

---

## 🤝 CLIENTE 2

**Participante remoto**

```
Email:    cliente2@email.com
Password: Cliente123
Rol:      Cliente
Paleta:   #102
Modo:     Remoto (simulado)
```

**Acceso a:**
- ✅ Dashboard
- ✅ Catálogo de lotes
- ✅ Subasta en vivo (pujar)
- ❌ Paneles administrativos

---

## 🤝 CLIENTE/GANADERO

**Ganadero registrado presencialmente**

```
Email:    ganadero@email.com
Password: Ganadero123
Rol:      Cliente
Paleta:   #201
```

**Acceso a:**
- ✅ Dashboard
- ✅ Catálogo de lotes
- ✅ Ver subastas
- ❌ Paneles administrativos

---

## 🚀 Inicio Rápido

### Opción 1: Usar Usuarios Pre-configurados

1. Abrir `index.html` en el navegador
2. Hacer clic en "Iniciar Sesión"
3. Usar cualquiera de las credenciales de arriba
4. Explorar según el rol

### Opción 2: Crear Usuarios Manualmente

1. Abrir `index.html`
2. Hacer clic en "Registrarse"
3. Completar formulario
4. Seleccionar el rol deseado
5. Anotar las credenciales generadas

---

## 📋 Script de Inicialización

Para cargar automáticamente los usuarios de prueba, ejecuta este código en la consola del navegador (F12):

```javascript
// Usuarios de prueba
const usuariosPrueba = [
    {
        nombre: "Administrador Sistema",
        cedula: "1000000001",
        email: "admin@subastas.com",
        telefono: "3001000001",
        password: "Admin123",
        tipoUsuario: "admin",
        rol: "admin",
        numeroPaleta: 1,
        fechaRegistro: new Date().toISOString()
    },
    {
        nombre: "Juan Angarita",
        cedula: "1000000002",
        email: "martillero@subastas.com",
        telefono: "3001000002",
        password: "Martillero123",
        tipoUsuario: "martillero",
        rol: "martillero",
        numeroPaleta: null,
        fechaRegistro: new Date().toISOString()
    },
    {
        nombre: "Juan Pérez García",
        cedula: "1000000101",
        email: "cliente1@email.com",
        telefono: "3001000101",
        password: "Cliente123",
        tipoUsuario: "cliente",
        rol: "cliente",
        numeroPaleta: 101,
        fechaRegistro: new Date().toISOString()
    },
    {
        nombre: "María López Sánchez",
        cedula: "1000000102",
        email: "cliente2@email.com",
        telefono: "3001000102",
        password: "Cliente123",
        tipoUsuario: "cliente",
        rol: "cliente",
        numeroPaleta: 102,
        fechaRegistro: new Date().toISOString()
    },
    {
        nombre: "Pedro Ramírez Gómez",
        cedula: "1000000201",
        email: "ganadero@email.com",
        telefono: "3001000201",
        password: "Ganadero123",
        tipoUsuario: "cliente",
        rol: "cliente",
        numeroPaleta: 201,
        fechaRegistro: new Date().toISOString()
    }
];

// Guardar en localStorage
localStorage.setItem('usuarios', JSON.stringify(usuariosPrueba));
console.log('✅ Usuarios de prueba cargados exitosamente');
console.log('Total usuarios:', usuariosPrueba.length);
```

---

## 🎬 Escenarios de Demostración

### Escenario 1: Flujo Completo de Administrador

1. Login como **Administrador**
2. Ir a Panel de Administración
3. Crear un evento de subasta
4. Agregar lotes de ganado
5. Registrar un nuevo usuario presencialmente
6. Ver reportes financieros

### Escenario 2: Control de Subasta (Martillero)

1. Login como **Martillero**
2. Ir a Panel del Martillero
3. Iniciar subasta
4. Observar pujas en tiempo real
5. Cerrar lote y adjudicar
6. Pasar al siguiente lote

### Escenario 3: Participación en Subasta (Clientes)

**Ventana 1:**
1. Login como **Cliente 1**
2. Ir a "Entrar a la Subasta"
3. Hacer pujas

**Ventana 2:**
1. Login como **Cliente 2**
2. Ir a "Entrar a la Subasta"
3. Competir con Cliente 1

**Ventana 3:**
1. Login como **Martillero**
2. Panel del Martillero
3. Ver ambas pujas sincronizadas

---

## 🔄 Resetear Datos

Si necesitas empezar de cero:

```javascript
// Ejecutar en consola del navegador
localStorage.clear();
location.reload();
console.log('✅ Datos reseteados');
```

Luego vuelve a ejecutar el script de inicialización.

---

## 💡 Tips para la Demo

### Para impresionar:

1. **Abre 3 ventanas del navegador:**
   - Ventana 1: Panel del Martillero (admin@subastas.com)
   - Ventana 2: Cliente Presencial (cliente1@email.com)
   - Ventana 3: Cliente Remoto (cliente2@email.com)

2. **Flujo de demostración:**
   - Martillero inicia la subasta
   - Compradores pujan desde diferentes ventanas
   - Martillero ve todo sincronizado
   - Cierra el lote
   - Muestra reportes financieros

3. **Puntos a destacar:**
   - Sincronización en tiempo real
   - Identificación presencial vs remoto
   - Panel del martillero con estadísticas
   - Reportes financieros automáticos
   - Registro presencial de usuarios

---

## 📱 Prueba en Móvil

Puedes usar las mismas credenciales en tu celular:

1. Abre el navegador del móvil
2. Navega a la URL del proyecto
3. Login con cualquier usuario
4. Prueba la experiencia móvil

**Recomendado:** Usar rol de Cliente para probar pujas desde móvil

---

## ⚠️ Notas Importantes

- Las contraseñas son simples para facilitar la demo
- En producción, usar contraseñas seguras
- Los datos se guardan en localStorage (se borran al limpiar navegador)
- Las pujas de otros usuarios son simuladas automáticamente
- El modo presencial/remoto se simula aleatoriamente

---

## 🆘 Solución de Problemas

**No puedo iniciar sesión:**
- Verifica que hayas ejecutado el script de inicialización
- Revisa que el email y password sean exactos (case-sensitive)
- Intenta resetear datos y volver a cargar usuarios

**No veo el Panel del Martillero:**
- Verifica que iniciaste sesión con rol "martillero" o "admin"
- Solo estos roles tienen acceso

**No veo el Panel de Administración:**
- Solo el rol "admin" tiene acceso completo
- El martillero NO tiene acceso a administración

**Las pujas no aparecen:**
- Asegúrate de que el martillero haya iniciado la subasta
- Verifica que estés en la página correcta (subasta-live.html)

---

## 📞 Soporte

Para más ayuda, consulta:
- `README.md` - Documentación completa
- `GUIA-RAPIDA.md` - Guía de uso rápido
- `MANUAL-REGISTRO-PRESENCIAL.md` - Para personal de oficina

---

**¡Listo para demostrar! 🎉**

*Última actualización: Marzo 2026*
