# PLAN DE TRABAJO — Portfolio Álvaro Zamora

> Actualizar este archivo ante cualquier cambio de alcance o decisión (igual que `memory.md`).
> Estado: `⬜ pendiente` · `🟨 en curso` · `✅ hecho` · `❌ descartado`
> Última actualización: 2026-10-17

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

## Fase 6 — Sección «Proyectos» animada + navegación filtrada ✅
> Referencia: `example/example.jpeg`. Avanzar de a 1 chunk, preguntando antes de cada uno.
- [x] **Chunk 0** — Registrar checklist en `memory.md` y `plan.md`
- [x] **Chunk 1** — Eliminar navegación de `Header.jsx` (nav desktop + hamburguesa + menú móvil;
      conservar logo AZ + nombre + tagline) · hecho 2026-10-17 (lint/build OK)
- [x] **Chunk 2** — Nueva sección `ProjectCategories` (panel amarillo + 5 columnas) con
      `CategoryIcons` (SVGs estáticos: etiqueta, documento, gráfico circular, claqueta, móvil),
      hover oscuro por categoría, reemplazo de `QuickCards` en `Home.jsx` + borrado del archivo;
      tarjetas clicables → `/proyectos?categoria=<nombre>` · hecho 2026-10-17 (lint/build OK)
- [x] **Chunk 3** — Animaciones CSS en `index.css`: 5 keyframes (balanceo de etiqueta, apertura
      editorial con líneas secuenciales, crecimiento angular de la cuña, apertura de claqueta,
      vibración + pulso del corazón), escalonado, intensificación en hover, reduced-motion
      · hecho 2026-10-17 (lint/build OK)
- [x] **Chunk 4** — `Projects.jsx`: filtro inicial desde `?categoria=` (`useSearchParams`),
      sincronía filtro ↔ URL, «Todas» limpia el parámetro · hecho 2026-10-17 (lint/build OK;
      URL como fuente de verdad, sin setState/en effects)
- [x] **Chunk 5** — `DataSeeder`: categorías Branding/Editorial/Infografía/Audiovisual +
      nuevo proyecto «Redes Sociales»; reset BD (`down -v`); verificación integral
      (lint, build, hover+animación+clic simultáneos, desktop/móvil, consola) y cierre de docs
      · hecho 2026-10-17 (backend y frontend compilan en Docker; API con las 5 categorías;
      frontend sirve el build nuevo; proxy y SPA OK; verificación visual manual pendiente
      del usuario)

## Fase 7 — Quitar botones del hero + navegación con hover ✅
> Completa (Chunks 0–4). Verificación visual manual pendiente del usuario en
> http://localhost:3000 (no hay navegador headless en el entorno).
- [x] **Chunk 0** — Registrar checklist en `memory.md` y `plan.md` · hecho 2026-10-17
- [x] **Chunk 1** — `Hero.jsx`: eliminar botones «Ver proyectos» y «Trabajemos juntos» +
      limpiar imports sin uso (`ArrowRight`, `Link`). Verificar lint/build.
      · hecho 2026-10-17 (lint/build OK, sin warnings nuevos)
- [x] **Chunk 2** — `ProjectCategories.jsx` (estado normal): panel amarillo «Proyectos» →
      `Link` a `/proyectos`; añadir 3 columnas de opciones (Sobre mí / Servicios / Contacto →
      `#sobre-mi`, `#servicios`, `#contacto` con scroll suave); 5 categorías quedan por ahora
      siempre visibles debajo (sin interacción). Verificar.
      · hecho 2026-10-17 (lint/build OK, sin warnings nuevos; `aside`→`Link` conservando
      clases, opciones con mismo min-h que las categorías y hover oscuro, columna derecha
      envuelta en `relative` para el overlay del Chunk 3)
- [x] **Chunk 3** — `ProjectCategories.jsx` (interacción hover): `useState` +
      `onMouseEnter`/`onMouseLeave`; en escritorio la capa de categorías pasa a
      `absolute inset-0` y cubre las 3 opciones al hacer hover sobre «Proyectos» o las
      categorías, replegándose al salir; en móvil siempre visibles. Verificar.
      · hecho 2026-10-17 (lint/build OK, sin warnings nuevos; sin salto de layout: en `lg`
      las categorías alternan `lg:hidden` ↔ `lg:absolute lg:inset-0 lg:z-10` —ambas fuera de
      flujo—; `onMouseLeave` en el wrapper que contiene panel + columna derecha)
- [x] **Chunk 4** — `index.css`: keyframes de despliegue de izquierda a derecha (delays
      escalonados 1→5); ajustes finales + cierre de docs (`memory.md`/`plan.md`). Verificar.
      · hecho 2026-10-17 (lint/build OK, sin warnings nuevos; `@keyframes cat-deploy`
      [opacity 0→1 + translateX −28px→0, 0.4s ease-out `both`] aplicada a `.cat-deploy-layer > a`
      solo dentro de `@media (min-width: 1024px)` con delays nth-child 0→0.32s —en móvil no
      aplica—; se añadió la clase `cat-deploy-layer` a la capa en el JSX; la animación arranca
      de cero en cada hover porque la capa pasa por `display: none`; `prefers-reduced-motion`
      la desactiva; verificado en el CSS compilado)

## Fase 8 — Ajustes visuales de las opciones (example2.jpeg) ✅
> Completa (Chunks 0–2). Referencia: `example/example2.jpeg`. Verificación visual manual
> pendiente del usuario en http://localhost:3000 (no hay navegador headless en el entorno).
- [x] **Chunk 0** — Registrar checklist en `memory.md` y `plan.md` · hecho 2026-10-17
- [x] **Chunk 1** — `ProjectCategories.jsx` (estado normal según el mockup): quitar números
      de las opciones (se quedan solo en las categorías); 4 columnas iguales (rejilla 25 %
      + 3), cada opción con guion encima + título verticalmente centrado, títulos
      `text-2xl lg:text-3xl`; Sobre mí/Contacto hueso + hover negro (actual), **Servicios
      negro con texto blanco y hover blanco con texto negro**; descripción «Proyectos» en
      flujo con `opacity-0` → `opacity-100` según `hovering` (fade ~500 ms, sin salto de
      layout). Verificar lint/build.
      · hecho 2026-10-17 (lint/build OK, sin warnings nuevos; `num` fuera de `OPTIONS`,
      panel amarillo con título `text-2xl lg:text-3xl` e igual guion `h-0.5 w-6` que las
      opciones —todas con la clase `opt-dash` preparada para el Chunk 2—; `invert: true`
      en Servicios; fade con `transition-opacity duration-500`; ⚠️ el grid se rompió
      temporalmente por la clase pegada a `${` en el template literal → error 10 de
      `memory.md`, ya corregido)
- [x] **Chunk 2** — `index.css` + clase `is-hovering` en el wrapper del JSX: keyframes
      `opt-dash-form` (`scaleX(0)→(1)`, origin-left, 0.6 s ease-out) aplicada a
      `.is-hovering .opt-dash` —se forma en **cada hover** y reinicia al re-entrar—;
      `prefers-reduced-motion` la desactiva; verificación integral + cierre de docs
      (`memory.md`/`plan.md`, Fase 8 completa). Verificar.
      · hecho 2026-10-17 (lint/build OK, sin warnings nuevos; `is-hovering` añadido al
      wrapper grid según `hovering`; `@keyframes opt-dash-form` [scaleX 0→1, `both`];
      reduced-motion la anula; verificado en el CSS compilado)

---

## Historial de cambios
- 2026-10-17 · **Ajuste fino post-Fase 8:** títulos de las 4 tarjetas alineados a la misma
  altura (descripción de «Proyectos» pasó a `absolute top-full`, fuera de flujo) y guion
  animado **por tarjeta** (`.opt-card:hover .opt-dash`) para que las opciones se animen al
  hacer hover directamente sobre ellas (antes el `is-hovering` de sección solo se veía en
  el panel amarillo).
- 2026-10-17 · **Ajuste de hovers de las opciones (posterior a la Fase 8):** las 3 opciones
  quedan en hueso en estado normal (Servicios ya no arranca negro); hover: Sobre mí y
  Servicios → blanco, Contacto → negro con texto blanco. Fix del grid roto por clase pegada
  a `${` en template literal (error 10 en `memory.md`).
- 2026-10-17 · **Fase 8 completa (Chunks 0–2)**: opciones de la sección «Proyectos» con
  aspecto del mockup `example2.jpeg` — sin números, 4 columnas de 25 % con guion + título
  centrado (`text-2xl lg:text-3xl`), Servicios invertido (negro ↔ blanco en hover),
  descripción de «Proyectos» con fade 500 ms en hover, y guion que se forma de izquierda a
  derecha en cada hover (`is-hovering` + `opt-dash-form`, reinicia al re-entrar;
  `prefers-reduced-motion` la desactiva). Sin backend.
- 2026-10-17 · Inicio **Fase 8** (ajustes visuales de las opciones de la sección «Proyectos»
  según `example2.jpeg`, tras revisar la Fase 7): checklist de 3 chunks (0–2) registrada en
  `memory.md` y `plan.md`. **Solo registrada; el Chunk 1 queda como próximo paso.**
  Decisiones del usuario: guion animado **en cada hover**; header **sin nav** (la del mockup
  se ignora); fila de opciones **centrada en max-w-7xl** (no a sangre).
- 2026-10-17 · **Fase 7 completa (Chunks 0–4)**: hero solo con título + subtítulo (sin
  botones); sección «Proyectos» convertida en navegación — panel amarillo clicable a
  `/proyectos`, 3 opciones con anclas a `#sobre-mi`/`#servicios`/`#contacto`, y hover que
  despliega las 5 categorías de izquierda a derecha (keyframes `cat-deploy`, delays 1→5)
  cubriéndolas sin salto de layout; en móvil las categorías siempre visibles. Sin backend.
- 2026-10-17 · **Fase 7 · Chunk 3**: hover de la sección «Proyectos» — al pasar el mouse
  por el panel amarillo o las categorías, la capa de 5 categorías se vuelve
  `absolute inset-0` y tapa las 3 opciones (sin salto de layout); al salir de ambos vuelve
  el estado normal. Móvil sin cambios (categorías siempre visibles).
- 2026-10-17 · **Fase 7 · Chunk 2**: `ProjectCategories` en estado normal — panel amarillo
  «Proyectos» ahora es enlace a `/proyectos`; añadidas 3 opciones (Sobre mí / Servicios /
  Contacto) con anclas y scroll suave; las 5 categorías quedan visibles debajo a la espera
  del hover del Chunk 3.
- 2026-10-17 · **Fase 7 · Chunk 1**: `Hero.jsx` queda solo con título + subtítulo (botones
  «Ver proyectos» y «Trabajemos juntos» eliminados, imports limpiados).
- 2026-10-17 · Inicio **Fase 7** (quitar botones del hero + convertir la sección «Proyectos»
  en navegación con hover, decisión del usuario tras revisar la Fase 6): checklist de 5 chunks
  (0–4) registrada en `memory.md` y `plan.md`. **Solo registrada; el Chunk 1 queda como próximo
  paso** (el usuario pidió no comenzar todavía).
- 2026-10-17 · Inicio **Fase 6** (sección «Proyectos» animada + navegación filtrada, según
  `example/example.jpeg`): checklist de 6 chunks (0–5) registrada en `memory.md` y `plan.md`.
  Decisiones del usuario: la nueva sección reemplaza a `QuickCards`; las categorías son
  clickeables y filtran `/proyectos?categoria=…`; se ajusta el `DataSeeder` si es necesario.
- 2026-10-17 · **Fase 6 completa (Chunks 0–5)**: navegación eliminada del `Header`;
  nueva sección `ProjectCategories` + 5 iconos SVG propios (`CategoryIcons`) con animaciones
  CSS individuales (balanceo, apertura editorial, crecimiento angular, claqueta, vibración)
  y hover oscuro por categoría; `QuickCards` eliminado; filtro por URL en `Projects.jsx`;
  `DataSeeder` con las 5 categorías del mockup + 5.º proyecto; BD reseteada y verificada.
  Nota: se liberaron puertos de contenedores del antiguo compose `portfolio2` y se recreó el
  backend (quedó sin red en el primer arranque fallido).
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
