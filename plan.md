# PLAN DE TRABAJO — Portfolio Álvaro Zamora

> Actualizar este archivo ante cualquier cambio de alcance o decisión (igual que `memory.md`).
> Estado: `⬜ pendiente` · `🟨 en curso` · `✅ hecho` · `❌ descartado`
> Última actualización: 2026-10-11

## Fase 0 — Documentación
- [x] Crear `memory.md` y `plan.md` en la raíz

## Fase 1 — Scaffolding e infraestructura ✅
- [x] `docker-compose.yml`: servicios `db` (healthcheck + volumen), `backend` (puerto **8081**:
      el 8080 lo usa el proyecto `prueba2` del usuario), `frontend`
- [x] `.env.example` + `.env`: `POSTGRES_*`, `JWT_SECRET`, `ADMIN_USERNAME/PASSWORD`
- [x] `backend/`: `pom.xml`, `Dockerfile` multi-stage, `application.yml`
- [x] `frontend/`: app Vite + React + Tailwind 4 + Router + axios + lucide-react,
      proxy dev `/api` y `/uploads` (variable `VITE_BACKEND_URL`)
- [x] Esquema `V1__schema.sql` (todas las tablas + constraint UNIQUE de likes)
- [x] Verificación: imagen del backend compila OK
- ⚠️ Pendiente de Fase 5: `frontend/Dockerfile` + `nginx.conf`

## Fase 2 — Backend ✅ (verificada en runtime)
- [x] Entidades + repositorios + DTOs + `GlobalExceptionHandler`
- [x] Seguridad: `SecurityConfig`, `JwtService` (jjwt, HS256), `JwtAuthFilter`, login
- [x] API pública: site, services, projects, like (idempotente por token), messages
- [x] API admin: dashboard/summary, CRUD projects (+imágenes, featured, order, cover),
      messages (leer/borrar), content, services, likes, upload
- [x] `DataSeeder`: admin, contenido del mockup, 4 servicios, 4 proyectos demo
      (con imágenes copiadas a `/data/uploads`), 3 mensajes, likes demo
- [x] Verificación: `docker compose up -d db backend` OK; probados con curl:
      `GET /api/public/site`, `GET /api/public/projects`, `POST /api/admin/auth/login` (JWT)
- 📝 Errores corregidos durante la fase: `>` perdido en `AdminMessageController` y
      import faltante de `StorageService` en `DataSeeder`

## Fase 3 — Frontend público ✅
- [x] Sistema base: tema Tailwind (colores/tipos), Layout con Header/Footer, SiteProvider
- [x] Hero con clip diagonal + decoraciones, tira de 4 tarjetas, secciones del home,
      `ContactForm`, `ProjectCard`, `LikeButton`, páginas `/`, `/proyectos`, `/proyectos/:slug`
- [x] `npm run build` sin errores + sitio sirviendo en http://localhost:3000

## Fase 4 — Frontend admin ✅ (verificada en runtime)
- [x] Login + `AuthContext` + `RequireAuth` + interceptor axios (JWT, 401→login)
- [x] Layout admin con sidebar + Dashboard (tarjetas, barras de likes, últimos mensajes)
- [x] Mensajes (lista, filtro sin leer, detalle, responder, marcar leído, eliminar)
- [x] Proyectos (tabla con destacar/publicar/eliminar + editor con portada y galería por upload)
- [x] Likes (ranking con barras y total)
- [x] Contenido (tabs Marca/Hero/Sobre mí/Contacto/Servicios con CRUD)
- [x] Prueba manual de punta a punta: 42 checks sobre los endpoints reales
      (proyectos, galería, upload, mensajes, servicios, contenido, likes, dashboard)
- 📝 Errores corregidos durante la fase: ver "Errores encontrados" en `memory.md`

## Fase 5 — Puesta a punto ✅
- [x] `frontend/Dockerfile` + `nginx.conf` (proxy `/api` y `/uploads` → backend)
- [x] `README.md`: qué es, requisitos, cómo levantar, credenciales, estructura, API
- [x] QA general:
  - **validaciones** — límites de campo alineados DTO ↔ esquema ↔ inputs HTML
  - **errores de API** — ningún camino devuelve 500; respuestas con `message` + `fields`
  - **responsive** — header con menú móvil, sidebar del admin colapsable, tablas con scroll
  - **likes repetidos** — idempotentes por `visitor_token` + constraint única en BD
- [x] Correcciones finales y revisión final de `memory.md` + `plan.md`

---

## Historial de cambios
- 2026-10-10 · Plan inicial acordado (todas las decisiones del usuario cerradas)
- 2026-10-10 · Backend mapeado al puerto **8081** (8080 ocupado por proyecto `prueba2`)
- 2026-10-10 · Fases 0–2 completas y verificadas; Fase 3 y 4 iniciadas (frontend parcial)
- 2026-10-11 · Corte de energía: nada corrupto en código ni BD. Recreados `backend` y
      `frontend` (el stream de logs de Docker del backend quedó roto). Fase 4 verificada
      en runtime; corregidos 3 bugs del backend (detalle de proyecto, slug al editar,
      portada ignorada al crear/editar)
- 2026-10-11 · **Proyecto completo (Fases 0–5)**. Fase 5: README, QA general y correcciones.
      Nuevos bugs corregidos: 500 en upload sin archivo, 500 en métodos no permitidos,
      500 al superar límites de columna, editor de contenido rechazado por redes vacías,
      sidebar del admin y menú móvil sin responsive. Añadidos `@Size` en todos los DTOs
      y `maxLength` en los inputs del frontend.
