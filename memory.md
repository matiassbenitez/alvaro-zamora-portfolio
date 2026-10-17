# MEMORY — Portfolio Álvaro Zamora

> Archivo de contexto. Refrescar al inicio de cada sesión de trabajo.
> Última actualización: 2026-10-17

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

### Fase 8
10. **El grid de la sección «Proyectos» se colapsó** (panel amarillo a todo el ancho y
    categorías desplegándose por debajo): al mover `lg:grid-cols-[minmax(0,25%)_1fr]` de un
    `className` plano a un template literal **pegado a `${…}`**, el scanner de Tailwind 4
    dejó de extraer la candidata y la clase no se generó en el CSS compilado.
    → separar con un espacio antes de `${` (cualquier clase pegada a `${` se pierde);
    verificado en el CSS compilado y en el build servido por nginx (`minmax(0,25%)` presente).

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
- [x] **Fase 6** completa (2026-10-17): cabecera sin navegación; sección «Proyectos» con
      5 categorías animadas + hover oscuro + clic que filtra `/proyectos?categoria=…`;
      BD con las 5 categorías del mockup (`example/example.jpeg`). Ver ver notas de infra.
- [x] **Fase 7** completa (2026-10-17): hero solo con título + subtítulo (sin botones);
      sección «Proyectos» = navegación — panel amarillo clicable a `/proyectos` + 3 opciones
      con anclas (`#sobre-mi`/`#servicios`/`#contacto`) y hover que despliega las 5
      categorías de izq a der (`cat-deploy`) cubriéndolas sin salto de layout; móvil con
      categorías siempre visibles. Verificación visual manual pendiente del usuario.
- [x] **Fase 8** completa (2026-10-17): opciones estilo `example2.jpeg` — sin números,
      4 columnas de 25 % (guion + título centrado `text-2xl lg:text-3xl`), Servicios
      invertido (negro ↔ blanco), descripción «Proyectos» con fade 500 ms en hover, guion
      que se forma en cada hover (`is-hovering` + `opt-dash-form`, reduced-motion off).
      Verificación visual manual pendiente del usuario.

## Proyecto: COMPLETO (Fases 0–8)
Sitio público en **http://localhost:3000** · admin en **/admin/login** (`admin` / `admin123`).
Estado de la BD = seed con las 5 categorías (5 proyectos, 3 mensajes, 4 servicios, likes, 3 redes).
Si algo queda raro tras experimentar: `docker compose down -v && docker compose up --build -d`.

## Fase 6 (completa 2026-10-17): Sección «Proyectos» animada + navegación filtrada
Referencia visual: `example/example.jpeg` (mockup nuevo). Decisiones del usuario:
- La nueva sección de 5 categorías (Branding, Editorial, Infografía, Audiovisual, Redes Sociales)
  **reemplaza a `QuickCards`** y se coloca tras el Hero.
- Cada categoría es **clicable**: navega a `/proyectos?categoria=<nombre>` con el filtro activo.
- La BD se ajusta para que esas 5 categorías existan (vía `DataSeeder` + reset con `-v`).
- Animaciones 100 % CSS/SVG propias (sin dependencias externas); hover oscuro por categoría.

### Checklist de chunks (avanzar de a 1, preguntando antes de cada chunk)
- [x] **Chunk 0** — Registrar checklist en `memory.md` y `plan.md`
- [x] **Chunk 1** — Eliminar navegación de `Header.jsx` (nav desktop + menú móvil; logo intacto)
      (2026-10-17: `NAV`, `handleNavClick`, nav desktop, hamburguesa y menú móvil borrados;
      imports limpiados; `npm run lint` y `npm run build` OK, sin warnings nuevos)
- [x] **Chunk 2** — Sección `ProjectCategories` + `CategoryIcons` (SVGs estáticos) + hover oscuro;
      reemplazar `QuickCards` en `Home.jsx` y borrar su archivo
      (2026-10-17: creados `CategoryIcons.jsx` [etiqueta, documento, gráfico circular, claqueta,
      móvil; grupos `cat-shadow`/`cat-body`/`cat-line`… listos para el Chunk 3] y
      `ProjectCategories.jsx` [panel amarillo + 5 columnas, hover bg-negro/texto-blanco
      `duration-300`, `<Link to="/proyectos?categoria=…">`, delay escalonado vía
      `--cat-delay`]; `QuickCards.jsx` eliminado; lint/build OK sin warnings nuevos)
- [x] **Chunk 3** — Animaciones CSS de los 5 iconos en `index.css` (keyframes, escalonado,
      intensificación en hover, `prefers-reduced-motion`)
      (2026-10-17: añadidas clases `cat-icon--*` a los SVG y envoltorio `.cat-open` en el
      documento; keyframes: balanceo etiqueta+profundidad sombra, apertura de pliego + líneas
      con `stroke-dashoffset` secuenciales, cuña con crecimiento angular (`transform-origin`
      al centro del círculo), claqueta con bisagra (`transform-origin` esquina sup-izq) +
      guiño del play, vibración del móvil + pulso doble del corazón; escalonado vía
      `--cat-delay`; hover intensifica con `scale(1.06)` en el contenedor SIN alterar las
      keyframes (evita saltos de fase); `prefers-reduced-motion` desactiva todo; lint/build OK)
- [x] **Chunk 4** — Filtro por URL en `Projects.jsx` (`useSearchParams` + sincronía con botones)
      (2026-10-17: la URL es la única fuente de verdad — sin `useState`/effects en el filtro,
      evitando warnings `set-state-in-effect`; parámetro `?categoria=` validado contra las
      categorías cargadas [inválido → "Todas"]; botones y botón atrás/adelante del navegador
      sincronizados; "Todas" limpia el parámetro; lint/build OK)
- [x] **Chunk 5** — `DataSeeder` con las 5 categorías (+ 5.º proyecto «Redes Sociales»),
      reset de BD, verificación integral y cierre de docs
      (2026-10-17: `seedProjects` ajustado a Branding / Editorial / Infografía / Audiovisual /
      Redes Sociales con 5 proyectos [Identidad Nébula, Revista Kontur, Informe Anual Órbita,
      Reel Estudio Lumen, Campaña Conecta]; reset con `down -v && up --build -d`; API
      verifica 5/5 categorías con 1 proyecto cada una; frontend Docker sirve el build nuevo
      [mismos hashes], bundle contiene clases `cat-icon--*` y las 5 keyframes; proxy
      frontend→backend y ruta SPA `/proyectos` OK; lint/build OK)

### Notas de infra de este chunk (2026-10-17)
- Había contenedores **viejos del proyecto `portfolio2`** (nombre previo del repo) ocupando
  3000 y 8081 → liberados con `docker compose -p portfolio2 stop && rm -f`.
- Tras un primer `up -d` fallido (por el puerto), el contenedor `backend` quedó **sin red
  asignada** (UnknownHostException: db en bucle de reinicios) → se arregla con
  `docker compose up -d --force-recreate backend`.
- Verificación visual (hover, animaciones, responsive) **pendiente de revisión manual** del
  usuario en http://localhost:3000 (no hay navegador headless en el entorno).

## Fase 7 COMPLETA (2026-10-17): Quitar botones del hero + sección de navegación con hover
> Chunks 0–4 hechos. Verificación visual manual pendiente del usuario en
> http://localhost:3000 (no hay navegador headless en el entorno).

Decisiones del usuario (cerradas):
- **Hero:** eliminar los botones «Ver proyectos» y «Trabajemos juntos» (el hero queda solo con
  título + subtítulo, como el mockup).
- **Sección «Proyectos» → navegación con hover:**
  - *Estado normal:* panel amarillo «Proyectos» (ahora **clicable → `/proyectos`**) + 3 columnas
    **Sobre mí · Servicios · Contacto** (número + guion + título, sin icono) que llevan a las
    anclas de la home (`#sobre-mi`, `#servicios`, `#contacto`) con scroll suave.
  - *Hover sobre «Proyectos» o sobre alguna categoría:* las **5 categorías** se despliegan
    **de izquierda a derecha** (revelado escalonado) y **tapan** las 3 opciones → es la vista
    actual (panel amarillo + categorías), con animaciones de icono y hover oscuro intactos.
  - El hover se sostiene mientras el mouse esté sobre el panel «Proyectos» **o** las categorías;
    al salir de ambos se **repliegan** y vuelven las 3 opciones.
  - *Móvil (sin hover):* las 5 categorías quedan **siempre visibles** debajo de las 3 opciones.

### Checklist de chunks Fase 7 (avanzar de a 1, preguntando antes de cada chunk)
- [x] **Chunk 0** — Registrar esta checklist en `memory.md` y `plan.md`  (2026-10-17)
- [x] **Chunk 1** — `Hero.jsx`: borrar el bloque de botones y limpiar imports sin uso
      (`ArrowRight`, `Link`). Verificar lint/build.
      (2026-10-17: botones «Ver proyectos» y «Trabajemos juntos» eliminados junto con el
      bloque `<div class="mt-10 flex flex-wrap gap-4">`; imports de `lucide-react` y
      `react-router-dom` borrados; `npm run lint` y `npm run build` OK, sin warnings nuevos)
- [x] **Chunk 2** — `ProjectCategories.jsx` (estado normal): panel amarillo «Proyectos» pasa a
      `Link` a `/proyectos`; añadir 3 columnas de opciones (Sobre mí / Servicios / Contacto →
      anclas home); las 5 categorías quedan **por ahora siempre visibles** debajo (sin lógica
      de interacción todavía). Verificar.
      (2026-10-17: `<aside>` amarillo convertido a `<Link to="/proyectos">` con las mismas
      clases; array `OPTIONS` con 3 anclas `<a href="#…">` — el `scroll-behavior: smooth`
      global ya existía en `index.css`; opciones con `min-h` igual al de las categorías
      [300px/380px] y hover oscuro consistente, número + guion + título sin icono; la columna
      derecha se envolvió en un `<div class="relative">` que aloja opciones + categorías
      [preparatorio del overlay del Chunk 3]; lint/build OK sin warnings nuevos)
- [x] **Chunk 3** — `ProjectCategories.jsx` (interacción hover): `useState` +
      `onMouseEnter`/`onMouseLeave`; en escritorio la capa de categorías pasa a
      `absolute inset-0` y **cubre** las 3 opciones al hacer hover sobre «Proyectos» o las
      categorías, replegándose al salir; en móvil siempre visibles. Verificar.
      (2026-10-17: estado `hovering`; `onMouseLeave` en el wrapper grid que contiene el panel
      amarillo + la columna derecha —al salir de ambos se repliega—; `onMouseEnter` en el
      `Link` del panel y en la capa de categorías; en `lg` la capa alterna `lg:hidden`
      [estado normal] ↔ `lg:absolute lg:inset-0 lg:z-10` [hover] —ambas fuera de flujo, así
      **no hay salto de layout**—; en móvil no aplica `lg:` y siguen siempre visibles
      debajo; lint/build OK sin warnings nuevos)
- [x] **Chunk 4** — `index.css`: keyframes de despliegue **de izquierda a derecha** (delays
      escalonados 1→5) para el revelado; ajustes finales + cierre de docs. Verificar.
      (2026-10-17: `@keyframes cat-deploy` [opacity 0→1 + translateX −28px→0, 0.4s ease-out
      `both`] aplicada vía `.cat-deploy-layer > a` **solo en `@media (min-width: 1024px)`** —en
      móvil no aplica— con delays por `nth-child` 0→0.32s [1→5]; la capa pasó a llamarse
      `cat-deploy-layer` en el JSX; como la capa alterna `lg:hidden`↔`lg:absolute`, la
      animación **arranca de cero en cada hover**; `prefers-reduced-motion` la desactiva;
      verificado en el CSS compilado [keyframes + 7 reglas presentes]; lint/build OK sin
      warnings nuevos)

### Notas Fase 7
- Archivos a tocar: `Hero.jsx`, `ProjectCategories.jsx`, `index.css`. **Sin backend.**
- Verificación final: `npm run lint` + `npm run build` sin errores; en
  http://localhost:3000 comprobar hero sin botones, normal = amarillo + 3 opciones, hover
  despliega categorías de izq a der tapando las opciones, repliegue al salir, móvil con
  categorías visibles.

## Fase 8 COMPLETA (2026-10-17): Ajustes visuales de las opciones
> Ajuste tras revisar la Fase 7 en el navegador. Referencia: `example/example2.jpeg`
> (estado normal de la sección «Proyectos»). Chunks 0–2 hechos.
> Verificación visual manual pendiente del usuario en http://localhost:3000.

Decisiones del usuario (cerradas):
- **Estado normal = mockup `example2.jpeg`:** 4 columnas iguales — Proyectos (amarillo),
  Sobre mí (hueso), Servicios (**negro, texto blanco**), Contacto (hueso).
- **Sin números en las opciones**: solo las 5 categorías llevan número.
- **Guion sobre el nombre** de cada opción: se anima formándose **de izquierda a derecha**
  (`scaleX` origin-left) **en cada hover** de la sección; al re-entrar, reinicia.
  ⚠️ **Ajustado el 2026-10-17:** la animación es **por tarjeta** (`.opt-card:hover
  .opt-dash`, incluida la amarilla) en vez de por sección con `is-hovering` — así los
  guiones de las opciones se animan al hacer hover directamente sobre ellas (antes solo
  se veía el del panel amarillo porque las categorías tapaban las opciones).
- **Descripción bajo «Proyectos»**: solo visible con hover — fade-in suave al entrar,
  fade-out al salir (sin salto de layout).
  ⚠️ **Ajustado el 2026-10-17:** pasó a **fuera de flujo** (`absolute top-full` bajo el
  bloque guion+título) para que los 4 títulos queden **a la misma altura** en estado
  normal (en flujo, el espacio invisible de la descripción desplazaba el título de
  «Proyectos» hacia arriba).
- **Servicios invertido**: negro sin hover → blanco con hover (texto al revés).
  ⚠️ **Cambiado el 2026-10-17 tras revisión del usuario:** las 3 opciones (Sobre mí,
  Servicios, Contacto) arrancan **todas en hueso**; en hover: Sobre mí y Servicios →
  **blanco** (`hover:bg-white hover:text-brand-black`), Contacto → **negro con texto
  blanco** (el hover antiguo de Sobre mí).
- **Header**: se queda **sin nav** (la nav del mockup se ignora; la navegación vive en la
  sección).
- **Ancho**: fila de opciones **centrada en `max-w-7xl`** como el resto del sitio (no
  a sangre).

### Checklist de chunks Fase 8 (avanzar de a 1, preguntando antes de cada chunk)
- [x] **Chunk 0** — Registrar esta checklist en `memory.md` y `plan.md` (2026-10-17)
- [x] **Chunk 1** — `ProjectCategories.jsx` (estado normal según el mockup): quitar `num`
      de `OPTIONS` y del render; 4 columnas iguales (rejilla `25%` + 3), opción =
      guion + título centrados verticalmente, títulos `text-2xl lg:text-3xl`; Sobre
      mí/Contacto hueso + hover negro (actual), **Servicios `bg-brand-black text-white`
      hover `bg-white text-brand-black`**; descripción «Proyectos» en flujo con
      `opacity-0`↔`opacity-100` según `hovering` (transición ~500 ms). Verificar
      lint/build.
      (2026-10-17: sin `num` en `OPTIONS` [flag `invert: true` en Servicios]; rejilla
      `lg:grid-cols-[minmax(0,25%)_1fr]` → 4 columnas de 25 %; guion `h-0.5 w-6
      bg-current origin-left` con clase `opt-dash` en las 4 tarjetas [incluida la
      amarilla, antes `h-0.5 w-7`], `mt-5`/`mb-5` entre guion y título; título del
      panel amarillo bajado de `text-3xl lg:text-4xl` a `text-2xl lg:text-3xl` para
      igualdad con las opciones; descripción con `transition-opacity duration-500
      ease-out` + `opacity-0`/`opacity-100` según `hovering` —sigue en flujo, ocupa
      espacio invisible en estado normal—; lint/build OK, sin warnings nuevos)
- [x] **Chunk 2** — `index.css` + `is-hovering`: añadir clase `is-hovering` al wrapper
      (donde vive el estado `hovering`); `@keyframes opt-dash-form` (`scaleX(0)→(1)`,
      `transform-origin: left`, 0.6 s ease-out `both`) aplicada a `.is-hovering .opt-dash`
      —los 4 guiones se reforman en cada hover—; `.opt-dash` base = `h-0.5 w-6 bg-current
      origin-left`; `prefers-reduced-motion` la desactiva; verificación integral
      (lint/build) + cierre de docs (Fase 8 ✅).
      (2026-10-17: `is-hovering` añadido al wrapper grid según `hovering`; sección
      «Fase 8» en `index.css` con `.is-hovering .opt-dash { animation: opt-dash-form
      0.6s ease-out both }` + `@keyframes opt-dash-form` [scaleX 0→1, origin-left via
      la clase Tailwind `origin-left`]; la animación **reinicia en cada hover** porque
      la clase se quita/vuelve a añadir al salir/re-entrar; `prefers-reduced-motion`
      la anula con `animation: none`; verificado en el CSS compilado [regla + keyframes
      presentes]; lint/build OK sin warnings nuevos)

### Notas Fase 8
- Archivos a tocar: `ProjectCategories.jsx`, `index.css`. **Sin backend.**
- El hover de las categorías (`cat-deploy`) y el overlay `absolute inset-0` **no se tocan**.
- Verificación final: en http://localhost:3000 — estado normal = 4 columnas del mockup
  (Servicios negro), sin números en opciones; al hacer hover: guiones se forman de izq a
  der + descripción fade-in + categorías se despliegan igual que antes; al salir todo
  vuelve; móvil sin cambios.

## Reglas del proyecto
- Todo cambio de alcance/decisión → actualizar `memory.md` **y** `plan.md` en el mismo turno
- El progreso (checkboxes de `plan.md`) se marca apenas se completa un chunk
- No commitear sin pedirlo explícitamente
- En fases con checklist de chunks: **no encadenar chunks**; preguntar antes de empezar el siguiente
