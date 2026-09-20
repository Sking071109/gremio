# 🚨 Rescate en Producción — Gremio de Cazadores

**Viernes, 6:00 p.m.** El dev que armó este proyecto renunció hace una hora.
Dejó el repo, un mensaje en Slack que decía *"en mi máquina funcionaba"* y nada más.
El cliente lanza el lunes.

Tu trabajo: **dejar esto funcionando en internet.**

---

## 🎯 Qué tienes que lograr

Una app del Gremio de Cazadores, viva en internet, donde cada cazador entra con su
cuenta y ve **solo sus propios encargos**. Tres piezas:

| Pieza | Dónde va |
|---|---|
| Base de datos | Supabase |
| Backend (API) | Render |
| Frontend | Vercel |

El código ya está escrito. **Pero tiene fallas.** Unas hacen que nada arranque y otras
no se notan: la app responde bien y aun así está mal. Tú las encuentras y las arreglas.

---

## 📏 Reglas

- **Trabajo individual.** Cada uno con su repo y sus propias URLs.
- **55 minutos.** El reloj corre para todos igual.
- **2 pistas gratis.** Me escribes por el chat de Meet y te oriento. A partir de la
  tercera, cada pista cuesta **−3 puntos**.
- Puedes usar tus apuntes, las misiones anteriores de Notion y `requests.http`.
- Los errores están **solo dentro de `backend/src/` y `frontend/js/`**,
  más un archivo de configuración. El HTML, el CSS y `app.js` ya están correctos.

---

## 🏆 Marcador (100 puntos)

Ve marcando a medida que avanzas. Al final yo verifico cada punto contra tus URLs.

**Que funcione (50)**

- [ ] **10** — El backend está vivo: `GET /salud` responde desde la URL de Render
- [ ] **10** — La lista de encargos sale de Supabase con datos reales
- [ ] **10** — El login funciona en producción y devuelve un token
- [ ] **10** — El front en Vercel carga y deja entrar con una cuenta
- [ ] **10** — Desde el front puedes crear, completar y borrar encargos

**Que esté bien hecho (50)**

- [x] **10** — Pedir `/encargos` sin token responde **401**
- [x] **5** — Crear un encargo con datos inválidos responde **400** (no 500, no 201)
- [x] **10** — Kael ve **solo** los encargos de Kael, no los de Mira
- [x] **5** — Ninguna respuesta de la API devuelve la contraseña ni su hash
- [x] **10** — La petición 4 de `requests.http` responde **401**, no un **500** con un error de SQL
- [x] **10** — No hay ningún secreto escrito dentro del código

**Bonus (+5)** — Al primero que complete el bloque *"Que funcione"* con las 5 URLs vivas.

---

## 🧭 Antes de empezar (2 min)

Necesitas cuenta en **GitHub**, **Supabase**, **Render** y **Vercel**.
En las tres últimas, entra con "Continue with GitHub" y te ahorras el registro.

1. Haz **Fork** de este repo a tu cuenta de GitHub.
2. Clónalo en tu máquina:
   ```
   git clone <la-url-de-tu-fork>
   cd rescate-gremio
   ```

---

## 🗄️ Parte 1 — La base de datos (Supabase)

1. Entra a [supabase.com](https://supabase.com) → **New project**.
2. Rellena así:
   - **Name:** `gremio-cazadores`
   - **Database Password:** invéntala y **cópiala en un bloc de notas**. La vas a
     necesitar en un minuto y Supabase no te la vuelve a mostrar.
   - **Region:** la más cercana (East US suele ser la mejor desde Colombia).
3. Espera a que el proyecto termine de crearse (1–2 min).
4. Menú izquierdo → **SQL Editor** → **New query**.
5. Abre el archivo `schema.sql` de este repo, **copia todo su contenido**, pégalo
   ahí y dale a **Run**.
6. Ve a **Table Editor** y confirma que existen las tablas `cazadores` y `encargos`
   con datos adentro.

### Copiar la cadena de conexión

1. Arriba a la derecha → botón **Connect**.
2. Busca la sección **Session pooler** (no la "Direct connection").
3. Copia esa URL. Se ve parecida a:
   ```
   postgresql://postgres.abcdefgh:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:5432/postgres
   ```
4. Reemplaza `[YOUR-PASSWORD]` por la contraseña que guardaste en el paso 2.
   **Sin los corchetes.**
5. Guárdala en tu bloc de notas. Es tu `DATABASE_URL`.

> ℹ️ Usamos el **Session pooler** porque la conexión directa no siempre funciona
> desde Render. Si eliges la otra, el backend no va a poder conectarse.

---

## 🖥️ Parte 2 — El backend (Render)

### 2.1 Probarlo primero en tu máquina

Más fácil arreglar en local que esperar un deploy de 2 minutos por cada intento.

```
cd backend
npm install
cp .env.example .env
```

Abre el `.env` que acabas de crear y rellena las tres variables:

```
DATABASE_URL=   (la del Session pooler, con tu contraseña)
JWT_SECRET=     (inventa una frase larga, la que quieras)
FRONTEND_URL=http://127.0.0.1:5500
```

Arranca el servidor:

```
npm run dev
```

Abre `requests.http` en VS Code y ve corriendo las peticiones **en orden**.
La 1 y la 2 te dirán rápido si algo está roto.

### 2.2 Subirlo a Render

1. Cuando algo te funcione en local, súbelo:
   ```
   git add .
   git commit -m "arreglos"
   git push
   ```
2. Entra a [render.com](https://render.com) → **New** → **Web Service**.
3. Conecta tu repo del fork.
4. Configura **exactamente** así:

   | Campo | Valor |
   |---|---|
   | Name | `gremio-api-tunombre` |
   | Root Directory | `backend` |
   | Runtime | Node |
   | Build Command | `npm install` |
   | Start Command | `npm start` |
   | Instance Type | Free |

5. Baja a **Environment Variables** y crea las mismas tres que tienes en tu `.env`:
   `DATABASE_URL`, `JWT_SECRET` y `FRONTEND_URL`.
   `FRONTEND_URL` déjala vacía por ahora — la llenas en la Parte 3.
6. **Create Web Service** y quédate mirando la pestaña **Logs**.

### 2.3 Leer los logs

Los logs son tu mejor herramienta hoy. Dos momentos distintos:

- **Build:** instala las dependencias. Si falla aquí, es un problema del `package.json`.
- **Runtime:** arranca el servidor. Si el build pasa pero el servicio nunca queda
  en verde (`Live`), el problema está en cómo arranca la app.

Cuando esté en **Live**, abre en el navegador:
`https://tu-servicio.onrender.com/salud`

Debe responder `{"ok":true,"servicio":"gremio-api"}`.

> ⚠️ **El plan gratis duerme el servicio** cuando pasa un rato sin uso. La primera
> petición después de eso puede tardar hasta un minuto en responder. No es un bug.

Ya con la URL de Render, cambia el `@url` de arriba en `requests.http` y vuelve a
correr las peticiones **contra producción**.

---

## 🌐 Parte 3 — El frontend (Vercel)

1. Entra a [vercel.com](https://vercel.com) → **Add New** → **Project**.
2. Importa el mismo repo.
3. Configura así:

   | Campo | Valor |
   |---|---|
   | Framework Preset | Other |
   | Root Directory | `frontend` |

4. **Deploy.** Tarda menos de un minuto.
5. Abre la URL que te da Vercel. La página carga… pero todavía no va a funcionar.
   Abre las **DevTools (F12)**, pestaña **Network**, e intenta entrar con
   `kael@gremio.com` / `cazador123`. Mira **a qué dirección** se está mandando esa
   petición y **con qué status** responde.
6. Arregla lo que encuentres, haz `git push` y Vercel vuelve a desplegar solo.
7. Copia la URL de Vercel, vuelve a Render → **Environment** → pégala en
   `FRONTEND_URL` → guarda. Render reinicia el servicio.

> 💡 La URL de `FRONTEND_URL` va **sin barra al final**:
> `https://tu-app.vercel.app` ✅ — `https://tu-app.vercel.app/` ❌

---

## 🕵️ Parte 4 — La auditoría (no la dejes para el final)

Aquí están los 40 puntos que **nadie te va a avisar que perdiste**. La app responde
200, todo se ve bien, y aun así está mal. Revisa el código con estas preguntas:

1. **Lo que entra.** `req.body`, `req.params` — ¿se revisa el dato antes de usarlo?
2. **Lo que va a la base.** ¿Las consultas usan placeholders (`$1`, `$2`) o pegan
   texto del usuario directo en el SQL?
3. **Lo que sale.** ¿Algún `res.json()` devuelve el objeto completo tal como viene
   de la base, con campos que el front no necesita?
4. **Quién puede pedir qué.** Entra con Kael. ¿Ves encargos que no son tuyos?
5. **Qué hay escrito en el código.** ¿Alguna clave, secreto o contraseña está
   escrita ahí, a la vista de cualquiera que abra el repo?

Compara `registrar()` con `iniciarSesion()` en `auth.controller.js`.
Una de las dos está bien hecha. La otra no.

---

## 🗂️ Mapa del repo

```
rescate-gremio/
├── schema.sql              ← pégalo en Supabase
├── requests.http           ← tus pruebas (REST Client)
│
├── backend/
│   ├── package.json
│   ├── .env.example
│   └── src/
│       ├── app.js                 ← servidor, CORS, arranque
│       ├── db/conexion.js         ← ✅ correcto
│       ├── middlewares/auth.js    ← verifica el token
│       ├── routes/                ← qué URL llama a qué función
│       ├── controllers/           ← recibe la petición y responde
│       └── services/              ← habla con la base de datos
│
└── frontend/
    ├── index.html          ← ✅ correcto
    ├── css/styles.css      ← ✅ correcto
    └── js/
        ├── config.js       ← la dirección de la API
        ├── api.js          ← peticiones al backend
        └── app.js          ← ✅ correcto, pinta la pantalla
```

Hay **dos TICKETs** marcados con comentarios dentro del código
(`TICKET A` y `TICKET B`). Esos son huecos que tienes que completar, no errores.
El resto son fallas que tienes que encontrar tú.

---

## 🧯 Si te atascas

| Lo que ves | Por dónde empezar |
|---|---|
| El build falla en Render | Logs de **Build** |
| El build pasa pero nunca queda `Live` | Logs de **Runtime**, desde la primera línea |
| `500` al pedir datos | Logs del backend: el mensaje del error dice qué tabla o columna falló |
| `401` en todo, incluso recién logueado | ¿Con qué se firma el token y con qué se verifica? ¿Son lo mismo? |
| Error de **CORS** en la consola | Network: mira el método y el status de la petición que falló |
| El front carga pero no pasa nada | Network: ¿a qué dirección le está pegando? |
| `ECONNREFUSED` o `timeout` contra la base | Revisa que usaste el **Session pooler** y que reemplazaste `[YOUR-PASSWORD]` |
| Cambié algo y sigue igual | ¿Hiciste `git push`? ¿Render/Vercel terminaron de redesplegar? |

**Un cambio por vez.** Si tocas tres cosas y funciona, no sabes cuál lo arregló.

---

## 📬 Entrega

Pega en el chat de la clase:

```
Nombre:
Backend (Render):  https://...onrender.com/salud
Frontend (Vercel): https://...vercel.app
Repo (GitHub):     https://github.com/...
```

**Cuentas de prueba:** `kael@gremio.com` / `cazador123` · `mira@gremio.com` / `gremio456`
