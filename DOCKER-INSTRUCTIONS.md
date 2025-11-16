# 🐳 Docker Setup Instructions

## ✅ Requisitos previos

- Docker instalado
- Docker Compose instalado
- Git (para clonar o actualizar el repo)

---

## 🚀 Paso 1: Construir y levantar el contenedor

```powershell
# Navegar a la carpeta del proyecto
cd C:\Users\elkin\Desktop\elkinpabon\LiveChat

# Construir la imagen y levantar el contenedor
docker-compose up -d --build
```

⏱️ **Espera 5-10 minutos** la primera vez (descarga imágenes base, instala dependencias, compila React).

---

## ✔️ Verificar que está corriendo

```powershell
# Ver contenedor activo
docker ps

# Ver logs en tiempo real
docker logs livechat-ec -f

# Probar health check
curl http://localhost/health
```

**Deberías ver:**
```json
{
  "success": true,
  "status": "healthy",
  "uptime": 123.45,
  "timestamp": "2025-11-15T...",
  "services": {
    "mongodb": "connected",
    "threadPool": {...}
  }
}
```

---

## 🌍 Paso 2: Crear túnel Cloudflare (UN SOLO TÚNEL)

```powershell
# Descargar cloudflared (si no lo tienes)
Invoke-WebRequest -Uri "https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-windows-amd64.exe" -OutFile "cloudflared.exe"

# Agregar ruta DNS del túnel
.\cloudflared.exe tunnel route dns livechat-tunnel chat.livechatec.online

# Ejecutar el túnel
.\cloudflared.exe tunnel run livechat-tunnel
```

---

## 🎉 ¡Listo!

Tu aplicación está en vivo en: **`https://chat.livechatec.online`**

---

## 📋 Comandos útiles

### Ver logs
```powershell
docker logs livechat-ec -f
```

### Reiniciar contenedor
```powershell
docker-compose restart
```

### Detener contenedor
```powershell
docker-compose down
```

### Reconstruir después de cambios en código
```powershell
docker-compose up -d --build
```

### Entrar al contenedor (debug)
```powershell
docker exec -it livechat-ec sh
```

### Ver estado del túnel
```powershell
.\cloudflared.exe tunnel info livechat-tunnel
```

---

## 🔧 Estructura del contenedor

El `docker-compose.yml` levanta **UN SOLO contenedor** que incluye:

```
livechat-ec (Puerto 80)
├── Nginx (Reverse Proxy)
├── React Frontend (compilado)
└── Node.js Backend (Puerto 3001 interno)
```

---

## ⚠️ Variables de entorno

Todas las variables están configuradas en `docker-compose.yml`:

- ✅ MongoDB Atlas
- ✅ JWT Secret
- ✅ Cloudinary
- ✅ Encriptación AES-256
- ✅ CORS: `https://chat.livechatec.online`

---

## 🛡️ Seguridad

- SSL/TLS: Automático con Cloudflare
- Mensajes: Encriptados con AES-256-GCM
- Archivos: Validados y almacenados en Cloudinary
- Autenticación: JWT + 2FA disponible

---

## ❓ Troubleshooting

### Contenedor no inicia
```powershell
docker logs livechat-ec
```

### Error de conexión a MongoDB
- Verificar `MONGODB_URI` en `docker-compose.yml`
- Asegurar que la IP está whitelistada en MongoDB Atlas

### Archivos no se suben
- Verificar credenciales de Cloudinary en `docker-compose.yml`

### Túnel no conecta
```powershell
.\cloudflared.exe tunnel info livechat-tunnel
Restart-Service cloudflared
```

---

## 📊 Health Check Endpoints

```powershell
# Health check general
curl http://localhost/health

# Stats del sistema
curl http://localhost/api/stats
```

---

**¡Tu LiveChat está listo para producción! 🚀**
