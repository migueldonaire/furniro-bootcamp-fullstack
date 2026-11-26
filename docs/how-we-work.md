# Furniro: cómo trabajamos

Las normas del proyecto: cómo nos organizamos, cómo se reparte el trabajo y cómo llega el código a `main`.

Lo importante no es terminar muchas pantallas. Lo importante es que **cada persona entienda y sepa explicar lo que ha hecho**.

---

# 1. La idea en una frase

Construimos Furniro en **parejas**, con un tablero **Kanban** en Jira, tarjetas pequeñas y bien definidas, y PRs pequeñas que revisa otra persona.

No hay equipos de "Tienda" o de "Backoffice". **Todo el mundo toca de todo**: base de datos, API, web y tests.

---

# 2. ¿Por qué Kanban y no Scrum?

Scrum ha sido durante años la forma más común de organizar equipos: sprints de dos semanas, puntos de historia, *planning poker*, reunión diaria, retrospectiva...

Hoy muchos equipos trabajan de otra forma:

- La mayoría usa un **híbrido** hecho a su medida, no Scrum "de libro". En la encuesta *State of Agile* de 2025, el 74 % de los equipos trabaja así.
- Con la IA, escribir código es más rápido. El trabajo difícil ahora es **decidir bien qué se construye** y **revisar** lo que se ha hecho.
- Por eso estimar con puntos tiene menos sentido. Pesa más **especificar bien cada tarea** (historia, escenarios, subtareas) y **trocearla** en partes pequeñas.

Nosotros haremos lo que se ve hoy en muchos equipos:

| Lo que usamos | Lo que NO usamos |
|---|---|
| Tablero Kanban con límite de tarjetas en curso | Sprints con fecha de cierre |
| Historias con escenarios (lo que vimos en BDD) | Puntos de historia y *planning poker* |
| Tarjetas pequeñas, de punta a punta (API + web + test) | Reparto por especialidades (solo front, solo back) |
| PR pequeña + checks + revisión | Reuniones largas |

Las historias de Jira ya traen **puntos de historia** (S = 4, M = 8, L = 12). Los usaremos el día de Scrum y, el resto del proyecto, solo como referencia del tamaño de cada tarjeta.

Scrum lo veremos igualmente en una sesión de un día (apartado 10), porque lo vas a oír en entrevistas y en muchas empresas.

---

# 3. El tablero

Usamos el proyecto **FUR** de Jira. Cada tarjeta pasa por estas columnas:

| Columna | Qué significa |
|---|---|
| **Backlog** | Ideas e historias que todavía no están listas |
| **Lista** | Bien definida: se puede empezar ya (apartado 4) |
| **En curso** | Una pareja la está programando |
| **En revisión** | Tiene una PR abierta |
| **Hecha** | La PR se ha fusionado en `main` y funciona en staging |

**Límite: una tarjeta En curso por pareja.** No se empieza otra hasta que la anterior está En revisión. Así se terminan las cosas en lugar de tener muchas a medias.

### Ejercicio 1

Mira el tablero de FUR. ¿Cuántas tarjetas hay en cada columna? ¿Cuál de las que están En curso lleva más tiempo ahí?

---

# 4. Una tarjeta lista para programar

Una tarjeta solo pasa a **Lista** si tiene estas cuatro cosas:

1. **La historia**: *Como... quiero... para...*
2. **Los escenarios**: *Dado / Cuando / Entonces*. Cada escenario será, como mínimo, un test.
3. **Las subtareas**: los trozos de trabajo que hay que hacer.
4. **Las dudas resueltas**: si hay una pregunta para el Product Owner (el profesor), primero se pregunta.

Ejemplo de subtareas de **FUR-35 · Ver la ficha de un producto**:

| Subtarea | Dónde |
|---|---|
| `GET /api/v1/products/:id` (solo productos `ACTIVE`, 404 si no existe) | `api/src/products` |
| Test del servicio: producto que existe y producto que no | `api/src/products` |
| Página `ProductPage` con nombre, precio con IVA, stock e imágenes | `shop/src/features/catalog` |
| Test de la página: se ve el precio con IVA | `shop/src/features/catalog` |

Cada subtarea suele ser **una PR pequeña**.

### Ejercicio 2

Escribe las subtareas de **FUR-34 · Buscar productos por nombre**. Pista: piensa qué cambia en la API, qué cambia en la web y qué tests demuestran que funciona.

---

# 5. Las parejas

**Todo el código se escribe en pareja.** Hay dos papeles:

- **Conductor/a**: tiene el teclado y escribe el código.
- **Navegante**: piensa, revisa, busca en la documentación y propone.

La norma: **teclea quien tiene menos experiencia.** Quien sabe más guía y pregunta, pero no coge el teclado.

Si una tarjeta la ha escrito entera una sola persona, no cuenta como hecha.

---

# 6. Cómo se reparten las tarjetas

1. Cada pareja tiene un **carril**: un bloque del MVP (acceso, catálogo, carrito, compra, productos o pedidos y clientes). Está en Confluence, en la página [Orden de trabajo y dependencias](https://bootcamp-fullstack-valencia-2026.atlassian.net/wiki/spaces/DDS/pages/753665), junto con el contrato de la API y los usuarios de prueba.
2. El profesor asigna **una tarjeta** a cada pareja.
3. Cuando la PR de esa tarjeta está fusionada, la pareja coge la siguiente de su carril.
4. Si una pareja termina su carril, ayuda a otra o coge una tarjeta libre (hablándolo antes con el profesor).

Cada pareja va a su ritmo. No hay prisa por fusionar el primer día: el objetivo es terminar el MVP en una semana y pico, y si hacen falta dos, se tarda dos.

### Si la API que necesitas aún no está

No te quedes parado: **empieza por el frontend**.

1. Divide la tarjeta en subtareas (API, web, tests).
2. Haz la parte de la web contra un **servidor simulado** con json-server: `npx json-server db.json`.
3. El `db.json` con datos de ejemplo se lo puedes pedir a la IA, dándole el contrato de la API de Confluence para que los campos coincidan.
4. Cuando la API esté fusionada, cambia la URL y conecta la web de verdad.

Nadie toca la tarjeta de otra pareja sin hablar antes con ella.

---

# 7. Del código a `main`

Nadie sube código directamente a `main`. El camino es siempre este:

1. Mueve la tarjeta a **En curso**.
2. Crea tu rama desde `main`. **La rama se llama como la tarjeta de Jira**: `feature/FUR-35` para la tarjeta FUR-35. El código va en mayúsculas, igual que en Jira, para que la rama se relacione con su tarjeta.

```bash
git switch main
git pull
git switch -c feature/FUR-35
```

Si una tarjeta se hace en varias PRs (una por subtarea), añade una palabra al final: `feature/FUR-35-api`, `feature/FUR-35-web`.

3. Programad en pareja, con commits pequeños.
4. Antes de subir, en la carpeta que hayas tocado:

```bash
npm run format   # deja el código con el formato común (Prettier)
npm run lint
npm test
```

Con VS Code y la extensión **Prettier** (el editor la recomienda al abrir el repo), el formato se aplica solo al guardar. El CI comprueba el formato con `npm run format:check`.

5. Sube la rama y abre una **PR** contra `main`, con un buen título y una buena descripción (ver "Título y descripción de la PR", justo debajo).
6. Mueve la tarjeta a **En revisión**.
7. Espera a que el check **`ci-ok`** salga en verde. Si sale en rojo, abre el detalle, arréglalo y vuelve a subir.
8. Revisan la PR **otra pareja** y el **revisor automático (Claude)**. Responde a cada comentario y corrige.
9. Con la aprobación y `ci-ok` en verde, se fusiona. En unos minutos el cambio está en **staging**.
10. Comprueba en staging que funciona y mueve la tarjeta a **Hecha**.

### Título y descripción de la PR

Con los títulos de las PRs se genera la **release** (las notas de cada versión que sale a producción). Por eso el título y la descripción importan tanto como el código.

**Título**: el código de la tarjeta y qué hace, en una frase que entienda cualquiera.

- Bien: `FUR-35 - Ficha de producto: endpoint GET /products/:id y página`
- Mal: `cambios`, `arreglos`, `feature/FUR-35`

**Descripción**: rellena la plantilla que aparece al abrir la PR:

- **Qué se ha hecho**: los cambios, en lista.
- **Qué no se ha hecho**: lo que queda pendiente o se deja para otra PR, y por qué.
- **Cómo probarlo**: pasos para que quien revisa lo compruebe.

Puedes pedir a la IA que te ayude a redactar la descripción a partir de tus commits y del diff (por ejemplo, en Claude Code: "resume los cambios de esta rama para la descripción de la PR"). Léela y corrígela antes de publicarla: la firmas tú.

### Las PRs, pequeñas

- **Máximo 1000 líneas** cambiadas (sin contar `package-lock.json` ni los ficheros de test). Si te pasas, el check `pr-size` sale en rojo.
- **Una tarjeta, o una subtarea, por PR.**
- Una PR pequeña se revisa en 10 minutos. Una grande no la revisa nadie de verdad.

### Revisar la PR de otra pareja

- Lee la tarjeta y sus escenarios antes que el código.
- Descarga la rama y pruébala.
- Comenta el código, nunca a la persona. Mejor una pregunta ("¿qué pasa si el producto no existe?") que una orden.

---

# 8. ¿Cuándo está hecha una tarjeta?

- [ ] Cumple la historia y todos sus escenarios.
- [ ] Tiene al menos un test por escenario importante, y todos pasan.
- [ ] La PR tiene `ci-ok` en verde y está aprobada.
- [ ] Está fusionada en `main` y funciona en staging.
- [ ] Quien la ha tecleado sabe explicarla.

"En mi ordenador funciona" no cuenta como hecha.

---

# 9. La IA

La IA es una herramienta para **entender**, no para que programe por ti.

- **Usa el modo plan** (*plan mode*). En Claude Code se activa con `Shift + Tab`: la IA lee el código, explica y propone un plan, pero **no escribe ficheros**. Sirve para preguntar dudas, entender un error o pensar cómo hacer una subtarea.
- **El código lo escribís vosotros.** No se pega código generado.
- **Si firmas un código, lo sabes explicar línea a línea.** En la revisión y en la demo se os puede preguntar por cualquier línea. Si no sabes explicarla, se rehace.
- Antes de preguntar a la IA, mira la documentación oficial: [NestJS](https://docs.nestjs.com/), [React](https://react.dev/), [Redux Toolkit](https://redux-toolkit.js.org/), [PostgreSQL](https://www.postgresql.org/docs/), [MDN](https://developer.mozilla.org/es/).
- El repositorio tiene un fichero [`CLAUDE.md`](../CLAUDE.md) con las normas del proyecto. La IA lo lee, así que sus respuestas siguen nuestras normas.

### Ejercicio 3

En modo plan, pide a la IA que te explique qué hace `api/src/app.controller.ts` y qué pasaría si la base de datos estuviera apagada. Después compruébalo tú: para la base de datos (`docker compose stop`) y llama a `/api/v1/health`.

---

# 10. Un día de Scrum

El **primer día** del proyecto lo hacemos "a lo Scrum", como juego de rol, para conocer cómo se ha trabajado en muchas empresas:

| Ceremonia | Qué haremos |
|---|---|
| **Sprint planning** | Elegir las tarjetas del "sprint" y repasar sus puntos de historia (ya vienen puestos en Jira) con *planning poker* |
| **Daily** | 15 minutos de pie: qué hice, qué haré, qué me bloquea |
| **Sprint review** | Enseñar lo hecho al Product Owner |
| **Retrospectiva** | Qué ha ido bien, qué ha ido mal y qué cambiamos |

Y veremos los roles: **Product Owner**, **Scrum Master** y **equipo de desarrollo**.

El resto de días trabajamos con Kanban.

---

# 11. Normas para todos

- Si llevas **30 minutos bloqueado**, pide ayuda: primero a tu pareja, luego a otra pareja, luego al profesor o al asistente.
- El tablero refleja la realidad. Si estás con una tarjeta, está En curso y con vuestros nombres.
- No se instalan librerías nuevas sin preguntar al profesor.
- Nunca se suben contraseñas ni tokens. El fichero `.env` no se sube; el `.env.example` sí.
- Las críticas son al código, nunca a las personas.

---

# 12. Si no sabes qué hacer

1. ¿Tu PR tiene comentarios sin responder? Respóndelos.
2. ¿Hay PRs de otras parejas esperando revisión? Revisa una.
3. ¿Queda alguna subtarea de tu tarjeta? Cógela.
4. Pregunta al profesor por la siguiente tarjeta.

---

# Resumen

- Trabajamos en **parejas**, con un tablero **Kanban** y **una tarjeta en curso** por pareja.
- Una tarjeta está lista cuando tiene **historia, escenarios, subtareas y dudas resueltas**.
- **Teclea quien menos experiencia tiene.**
- **PRs pequeñas** (menos de 1000 líneas sin contar tests), con **`ci-ok` en verde** y revisión de otra pareja.
- La IA, en **modo plan**: para preguntar y entender. El código lo escribís vosotros.
- Una tarjeta está **hecha** cuando funciona en staging y sabes explicarla.
