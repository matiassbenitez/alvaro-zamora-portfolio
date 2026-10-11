# MEMORY — Portfolio Álvaro Zamora

> Archivo de contexto. Refrescar al inicio de cada sesión de trabajo.
> Última actualización: 2026-10-11

## Qué es este proyecto
Portfolio web de un diseñador gráfico (marca: **Álvaro Zamora — Diseño + Comunicación**)
con panel de administración privado. Repo: `/media/tuchito/DATOS/Proyectos/OpenCode/portfolio2`

## Decisiones ya tomadas (no volver a preguntar)
- **DB:** PostgreSQL 17 + Flyway (esquema versionado en `V1__schema.sql`)
- **Auth admin:** JWT simple (HS256), un solo usuario admin sembrado desde `.env`
- **Imágenes:** subida de archivos desde el dashboard → volumen Docker `/data/uploads`
- **Likes:** anónimos, un like por visitante (UUID en `localStorage` + constraint única en BD)
- **Contenido editable:** marca/logo, hero (título/subtítulo/imagen), sobre mí, servicios, contacto/redes
- **Proyectos:** galería múltiple (portada + varias imágenes), campo `featured` para destacar, `order`, `published`
- **Docker:** puertos separados → frontend `:3000`, backend `:8081` (ver "OJO"), db interna. Nginx proxya `/api` y `/uploads`
- **Datos demo:** sí, se siembra todo al arrancar (admin, contenido, 4 servicios, 4 proyectos, mensajes, likes)
- **Frontend:** React + Vite + Tailwind CSS 4 + React Router + Axios
- **Backend:** Java 21 + Spring Boot 3.5.x (línea madura; alternativa 4.1.1 si se decide cambiar)

## Stack y versiones
| Capa | Tech |
|---|---|
| Backend | Java 21, Spring Boot 3.5.x (web, data-jpa, security, validation), Flyway |
| DB | PostgreSQL 17-alpine |
| Frontend | React 19, Vite 8, Tailwind CSS 4, react-router-dom, axios |
| Infra | Docker Compose: `db`, `backend`, `frontend` (nginx) |

## Estructura
```
portfolio2/
├── docker-compose.yml · .env.example · README.md
├── memory.md · plan.md
├── backend/          # Maven, multi-stage Dockerfile (maven → temurin:21-jre)
└── frontend/         # Vite build → nginx:alpine
```
Imágenes base en la raíz: `hero-eye.jpeg` (mockup de la portada), `imagen.jpeg` (foto del ojo del hero).

## Diseño (fiel a hero-eye.jpeg)
- Colores: amarillo `#FFD100`, negro `#0D0D0D`, hueso `#F4F3EF`, gris `#8A8A8A`
- Tipo: **Archivo** (titulares) + **Inter** (texto), Google Fonts
- Header sticky con monograma AZ · Hero "Ideas que se ven." con foto en clip diagonal,
  banda amarilla y círculo naranja · Tira de 4 tarjetas numeradas
  (01 Proyectos / 02 Sobre mí / 03 Servicios / 04 Contacto)
- Secciones home: destacados, sobre mí, servicios, contacto (formulario), footer

## API resumen
- Público: `GET /api/public/{site,services,projects,projects/{slug}}`,
  `POST /api/public/projects/{id}/like`, `POST /api/public/messages`
- Admin (JWT): `auth/login`, `dashboard/summary`, `projects` (CRUD+imágenes+featured),
  `messages` (leer/marcar/borrar), `content`, `services`, `likes`, `upload`
- Archivos servidos en `/uploads/**` (proxy Nginx y en dev con Vite)
- Errores: siempre `{ status, message, timestamp }` y, si es validación, también
  `fields: { campo: mensaje }`. El frontend los lee con `apiErrorMessage()` de `client.js`.
- Los `@Size` de los DTOs están alineados 1:1 con los `VARCHAR` de `V1__schema.sql`.
  **Si se cambia una columna, cambiar también el DTO y el `maxLength` del input.**

## Comandos clave
```bash
docker compose up --build          # levanta todo
docker compose down -v             # baja y limpia la BD
docker compose logs -f backend     # logs
docker compose exec db psql -U portfolio -d portfolio   # shell SQL
# dev: backend (sin Maven local, se usa la imagen) y frontend con Vite proxy
```

## OJO — entorno y peculiaridades
- **El puerto 8080 del host lo usa otro proyecto (`prueba2`)** → el backend del portfolio
  se publica en **8081** (`8081:8080`). El proxy interno de Nginx/Vite usa el 8080 interno.
- En dev local con Vite contra backend Docker: `VITE_BACKEND_URL=http://localhost:8081 npm run dev`
- Maven no está instalado localmente; la compilación se hace **dentro de Docker**.
- La imagen `postgres:17-alpine` tardó en descargarse (falló una vez por red de Docker Hub;
  un reintento la resolvió).
- El HTTP del backend responde **antes** de que termine el `DataSeeder` → un curl inmediato
  tras el arranque puede devolver el sitio vacío; esperar ~5s o reintentar.
- **Corte de energía (2026-10-11):** no corrompió código, BD ni volumen de uploads, pero
  **dejó roto el stream de logs de Docker** del contenedor del backend (corriendo pero sin
  escribir nada nuevo). Se arregla con `docker compose up -d --force-recreate backend`.
  El volumen `pgdata` sobrevivió intacto.
- `project_images = 0` en el seed **es esperado**: el seeder solo setea `coverImage` en
  `projects`; la galería queda vacía hasta que se sube desde el admin.

## Errores encontrados y corregidos
### Fase 2
- `AdminMessageController.java`: se perdió un `>` de un genérico al escribir el archivo
  (error javac `> or ',' expected`) → corregido.
- `DataSeeder.java`: faltaba `import ...service.StorageService` → corregido.

### Fase 4 (detectados el 2026-10-11 con la prueba de punta a punta)
1. **`GET /api/admin/projects/{id}` y `GET /api/public/projects/{slug}` devolvían 500**
   → `LazyInitializationException` en `Project.images` (`@OneToMany` LAZY por defecto).
   `ProjectService.getDetail()` y `getBySlug()` no tenían `@Transactional`.
   **Esto también rompía la página pública `/proyectos/:slug`.** → corregido con
   `@Transactional(readOnly = true)`.
2. **`ProjectService.resolveSlug(source, currentId)` ignoraba `currentId`**: al editar un
   proyecto, `existsBySlug` encontraba el slug del propio proyecto y le añadía `-2`.
   Cada guardado renombraba el slug y rompía el enlace público. → corregido con
   `ProjectRepository.existsBySlugAndIdNot`.
3. **`coverImage` no estaba en `ProjectDtos.ProjectRequest`**: la portada subida desde el
   editor se perdía silenciosamente al guardar (quedaba `null` en crear y no se tocaba en
   editar). → añadido al DTO y aplicado en `create()`; en `update()` solo se aplica si el
   campo viene en el body (para no borrar portadas de clientes que no lo envían).
   ⚠️ A propósito **no** se borra el archivo anterior al cambiar la portada: los proyectos
   seed comparten `hero-inicio.jpeg` / `sobre-mi.jpeg` y borrarlo rompería a los demás.

### Fase 5 (QA general, 2026-10-11)
4. **`POST /admin/upload` sin archivo → 500.** `@RequestParam("file")` es *required* por
   defecto, así que Spring fallaba antes de llegar a la validación de `StorageService`.
   → `required = false` + handler para `MissingServletRequestPartException` (400).
5. **Método HTTP no soportado → 500 en vez de 405** (p. ej. `DELETE /api/public/site`).
   El `@ExceptionHandler(Exception.class)` se lo comía. → handler dedicado.
6. **Superar un `VARCHAR` de la columna → 500** (`name > 120`, `subject > 160`…).
   → handler para `DataIntegrityViolationException` (409) **y** `@Size` en todos los DTOs
   alineados 1:1 con el esquema, más `maxLength` en los inputs del frontend.
7. **El editor de Contenido se rompía al agregar una red social vacía**: el botón
   «+ Agregar red» crea `{label:'', url:''}` y `SocialUpdate` tenía `@NotBlank` → 400.
   → `@NotBlank` quitado de `SocialUpdate`; `ContentService` ya descartaba las filas vacías.
8. **Menú móvil de `Header` usaba `<a href>` para «Proyectos»** → recarga completa de la
   página en vez de navegar con Router. → cambiado a `<Link>`.
9. **`AdminLayout` tenía el sidebar fijo de 256px siempre visible** → en móvil el contenido
   quedaba comprimido. → `flex-col md:flex-row`, nav horizontal con scroll en pantallas
   chicas y padding de contenido reducido.

> El catch-all `@ExceptionHandler(Exception.class)` era el culpable de la mayoría de los
> 500: convertía cualquier excepción de Spring en «Error interno del servidor». Si aparece
> un 500 nuevo, lo primero es mirar si falta un handler específico.

## Estado actual
- [x] Plan definido con el usuario (decisiones cerradas)
- [x] Archivos `memory.md` y `plan.md` creados
- [x] **Fase 0** completa
- [x] **Fase 1** completa
- [x] **Fase 2** completa y verificada en runtime (db+backend, seed, JWT)
- [x] **Fase 3** completa: `docker compose up -d` → sitio público en **http://localhost:3000**
      (Nginx proxya `/api` y `/uploads` al backend; build de Vite sin errores)
- [x] **Fase 4** completa y **verificada en runtime** (2026-10-11): 42 checks sobre los
      endpoints reales de login, dashboard, proyectos, galería, upload, mensajes, servicios,
      contenido y likes. `npm run lint` sin errores (solo warnings preexistentes de React).
- [x] **Fase 5** completa (2026-10-11): `README.md` en la raíz, QA general
      (validaciones / errores de API / responsive / likes) y correcciones finales.

## Proyecto: COMPLETO (Fases 0–5)
Sitio público en **http://localhost:3000** · admin en **/admin/login** (`admin` / `admin123`).
Estado de la BD = seed original (4 proyectos, 3 mensajes, 4 servicios, 8 likes, 3 redes).
Si algo queda raro tras experimentar: `docker compose down -v && docker compose up --build -d`.

## Reglas del proyecto
- Todo cambio de alcance/decisión → actualizar `memory.md` **y** `plan.md` en el mismo turno
- El progreso (checkboxes de `plan.md`) se marca apenas se completa un chunk
- No commitear sin pedirlo explícitamente
