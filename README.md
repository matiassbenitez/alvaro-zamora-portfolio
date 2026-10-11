# Portfolio Álvaro Zamora

Sitio web de portafolio para el diseñador gráfico **Álvaro Zamora — Diseño + Comunicación**,
con un panel de administración privado para gestionar proyectos, mensajes y contenido.

El sitio público es 100% dinámico: textos, imágenes, servicios, redes y proyectos se sirven
desde la base de datos y se editan desde el admin. No hay que tocar código para actualizarlo.

---

## Stack

| Capa | Tecnología |
|---|---|
| Backend | Java 21 · Spring Boot 3.5.16 (web, data-jpa, security, validation) · Flyway · JJWT (HS256) |
| Base de datos | PostgreSQL 17 |
| Frontend | React 19 · Vite 8 · Tailwind CSS 4 · React Router 7 · Axios · lucide-react |
| Infraestructura | Docker Compose (`db`, `backend`, `frontend` con Nginx) |

---

## Requisitos

- [Docker](https://docs.docker.com/get-docker/) con Docker Compose v2
- Nada más. Maven y Node se ejecutan **dentro de las imágenes**; no hacen falta instalados.

---

## Cómo levantarlo

```bash
# 1. Configurar variables de entorno
cp .env.example .env

# 2. Levantar todo
docker compose up --build -d

# 3. Verificar
docker compose ps
```

En unos segundos:

| Servicio | URL |
|---|---|
| Sitio público | http://localhost:3000 |
| Panel de admin | http://localhost:3000/admin/login |
| API (directa, sin Nginx) | http://localhost:8081/api |

Nginx del frontend proxya `/api` y `/uploads` hacia el backend, así que desde afuera
**solo se expone el puerto 3000**. El 8081 queda a mano para depurar.

### Credenciales del admin

Se siembran desde el `.env` la primera vez que arranca la base de datos:

```
usuario: admin
contraseña: admin123
```

> ⚠️ Cambiá `ADMIN_PASSWORD` y `JWT_SECRET` en `.env` antes de cualquier despliegue real.

---

## Variables de entorno

Copia `.env.example` a `.env`. Todas tienen valor por defecto, pero conviene definirlas.

| Variable | Descripción | Por defecto |
|---|---|---|
| `POSTGRES_USER` | Usuario de la base de datos | `portfolio` |
| `POSTGRES_PASSWORD` | Contraseña de la base de datos | `portfolio` |
| `POSTGRES_DB` | Nombre de la base de datos | `portfolio` |
| `JWT_SECRET` | Secreto HMAC para firmar los JWT (mín. 32 caracteres) | valor de demo |
| `JWT_EXPIRATION_MINUTES` | Validez del token de admin | `720` |
| `ADMIN_USERNAME` | Usuario del admin | `admin` |
| `ADMIN_PASSWORD` | Contraseña del admin | `admin123` |
| `CORS_ALLOWED_ORIGINS` | Orígenes permitidos (útil en dev con Vite) | `http://localhost:3000,http://localhost:5173` |

---

## Despliegue en Render

El repo incluye `render.yaml` (blueprint) con tres servicios:

| Servicio | Tipo | Contenido |
|---|---|---|
| `portfolio-frontend` | Web (Docker) | `frontend/Dockerfile`, nginx con proxy de `/api` y `/uploads` a `${BACKEND_URL}` |
| `portfolio-backend` | Web (Docker) | `backend/Dockerfile`, escucha en `${PORT}` (10000 en Render) |
| `portfolio-db` | PostgreSQL gestionado | datos persistentes; el backend recibe `DB_HOST/DB_PORT/DB_NAME/DB_USER/DB_PASSWORD` y `DB_SSLMODE=require` |

Pasos:

1. Sube el repo a GitHub.
2. En Render: **New → Blueprint** → selecciona el repo (lee `render.yaml`).
3. Tras el primer deploy, en las env vars del backend completa `CORS_ALLOWED_ORIGINS`
   (con la URL del frontend) y revisa `ADMIN_USERNAME` / `ADMIN_PASSWORD`.
4. El frontend obtiene `BACKEND_URL` automáticamente desde `RENDER_EXTERNAL_URL` del backend.

Notas:

- El plan free duerme los servicios tras inactividad: la primera petición tarda ~30 s.
- El Postgres free de Render expira a los 90 días.
- `/uploads` es efímero en Render: las imágenes subidas se borran en cada deploy.

---

## Estructura

```
portfolio2/
├── docker-compose.yml      # servicios db / backend / frontend (local)
├── render.yaml             # blueprint de Render: frontend + backend + Postgres
├── .env.example            # plantilla de variables de entorno
├── memory.md · plan.md     # contexto y plan de trabajo del proyecto
├── backend/
│   ├── Dockerfile          # multi-stage: maven → temurin:21-jre
│   ├── pom.xml
│   └── src/main/
│       ├── java/com/alvarozamora/portfolio/
│       │   ├── config/         # SecurityConfig, WebConfig, DataSeeder
│       │   ├── controller/     # publicapi/ (anónimo) y admin/ (JWT)
│       │   ├── dto/
│       │   ├── entity/
│       │   ├── exception/      # ApiException + GlobalExceptionHandler
│       │   ├── repository/
│       │   ├── security/       # JwtService, JwtAuthFilter
│       │   └── service/
│       └── resources/
│           ├── application.yml
│           ├── db/migration/V1__schema.sql
│           └── seed/           # imágenes de demo copiadas a /data/uploads
└── frontend/
    ├── Dockerfile          # node build → nginx:alpine
    ├── nginx.conf.template  # proxy /api y /uploads + SPA fallback (envsubst)
    └── src/
        ├── api/client.js       # axios + interceptor JWT + apiErrorMessage
        ├── auth/               # AuthContext + RequireAuth
        ├── components/
        │   ├── admin/          # AdminLayout, StatCard
        │   ├── site/           # Header, Hero, QuickCards, ProjectCard…
        │   └── ui/
        ├── pages/
        │   ├── public/         # Home, Projects, ProjectDetail
        │   └── admin/          # Login, Dashboard, Messages, ProjectsAdmin…
        └── index.css           # tema Tailwind (colores y utilidades de marca)
```

---

## Datos demo

La primera vez que arranca la base de datos, Flyway crea el esquema (`V1__schema.sql`)
y `DataSeeder` siembra:

- 1 usuario admin
- el contenido del sitio (marca, hero, sobre mí, contacto, redes)
- 4 servicios
- 4 proyectos de ejemplo con sus portadas
- 3 mensajes de contacto
- algunos likes de muestra

Todo eso es editable y borrable desde el panel. Si querés volver al estado inicial:

```bash
docker compose down -v && docker compose up --build -d
```

> `down -v` **borra la base de datos y los uploads**. Solo para desarrollo.

---

## Rutas del sitio

**Públicas (sin login)**

| Ruta | Descripción |
|---|---|
| `/` | Home: hero, destacados, sobre mí, servicios, contacto |
| `/proyectos` | Listado de proyectos publicados |
| `/proyectos/:slug` | Detalle del proyecto con galería y likes |

**Admin (requieren JWT)**

| Ruta | Descripción |
|---|---|
| `/admin/login` | Inicio de sesión |
| `/admin` | Dashboard: métricas, likes por proyecto, últimos mensajes |
| `/admin/mensajes` | Bandeja: leer, marcar, responder, eliminar |
| `/admin/proyectos` | ABM de proyectos, portadas y galería |
| `/admin/likes` | Ranking de likes |
| `/admin/contenido` | Editor de marca, hero, sobre mí, contacto y servicios |

---

## API

### Público

```
GET    /api/public/site                 # contenido del sitio + redes
GET    /api/public/services             # servicios activos
GET    /api/public/projects             # proyectos publicados
GET    /api/public/projects/{slug}      # detalle por slug
POST   /api/public/projects/{id}/like   # cuerpo: { "visitorToken": "<uuid>" }
POST   /api/public/messages             # formulario de contacto
```

### Admin (cabecera `Authorization: Bearer <token>`)

```
POST   /api/admin/auth/login
GET    /api/admin/dashboard/summary
GET    /api/admin/projects              · GET /api/admin/projects/{id}
POST   /api/admin/projects              · PUT · DELETE /api/admin/projects/{id}
PATCH  /api/admin/projects/{id}/featured
PATCH  /api/admin/projects/{id}/order
PATCH  /api/admin/projects/{id}/cover
POST   /api/admin/projects/{id}/images
DELETE /api/admin/projects/{id}/images/{imageId}
GET    /api/admin/messages?unreadOnly=  · DELETE /api/admin/messages/{id}
PATCH  /api/admin/messages/{id}/read
GET    /api/admin/likes
GET    /api/admin/content               · PUT /api/admin/content
GET    /api/admin/services              · POST · PUT · DELETE /api/admin/services/{id}
POST   /api/admin/upload                # multipart, campo "file"
```

Los errores devuelven siempre el mismo formato:

```json
{ "status": 400, "message": "Datos inválidos", "fields": { "email": "El email no es válido" } }
```

---

## Likes

Son anónimos: cada visitante recibe un UUID en `localStorage` y puede dar **un solo like
por proyecto**. El backend además tiene un constraint único `(project_id, visitor_token)`,
así que repetir la petición no duplica el contador.

---

## Desarrollo local (sin Docker para el frontend)

```bash
# terminal 1 — backend en Docker (usa el 8081 porque el 8080 lo ocupa otro proyecto)
docker compose up -d db backend

# terminal 2 — Vite en dev con proxy hacia el backend
cd frontend
VITE_BACKEND_URL=http://localhost:8081 npm run dev
```

El frontend en dev queda en http://localhost:5173 y proxya `/api` y `/uploads`.

---

## Comandos útiles

```bash
docker compose up --build -d       # levantar todo
docker compose down                 # parar (conserva los datos)
docker compose down -v              # parar y BORRAR la base de datos
docker compose logs -f backend      # logs del backend
docker compose exec db psql -U portfolio -d portfolio   # consola SQL
docker compose exec backend ls /data/uploads            # archivos subidos

cd frontend && npm run lint         # linter (oxlint)
cd frontend && npm run build        # build de producción
```

---

## Notas

- **Puerto 8080**: en esta máquina lo usa otro proyecto, por eso el backend se publica en
  **8081**. Internamente (dentro de la red de Docker) el proxy habla con el `:8080` del contenedor.
- **Imágenes**: se suben desde el panel y quedan en el volumen Docker `uploads`
  (`/data/uploads`). Solo se aceptan `png, svg, jpg, jpeg, webp, gif`.
- **El backend responde antes de terminar el seed**: si recién levantaste y la API devuelve
  el sitio vacío, esperá unos segundos y reintentá.
