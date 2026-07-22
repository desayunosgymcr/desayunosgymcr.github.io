# Sabores de Tati — Página de pedidos

Página web de una sola carpeta: todo el contenido vive en `data.json` y el diseño en `index.html`.
Es estática (sin servidor), responsive (celular, tablet, compu) y lista para **GitHub Pages**.

## Archivos
- `index.html` — la página de pedidos (menú, identificación, totales, cierre con Sinpe).
- `data.json` — el contenido: negocio, menú, precios, Sinpe/WhatsApp de Tati y el ID de Formspree.
- `admin.html` — **panel de Tati** para revisar los pedidos finalizados, en vivo si conectás Firebase.
- `pedidos.json` — registro de respaldo de pedidos (formato que también lee el panel).
- `firebase-config.js` — credenciales de tu proyecto de Firebase (opcional, ver abajo).

Para cambiar precios, nombres o agregar platillos **solo editás `data.json`** — no tocás el HTML.

## Panel de administrador (admin.html)

Abrí `.../admin.html` (o el enlace **"Panel de Tati"** al pie de la página). Pide un código:
el predeterminado es **`1234`** — cambialo en `admin.html`, en la línea `const ADMIN_PIN = "1234";`.
Es una protección básica para evitar entradas casuales, **no es seguridad real** (el archivo es público).

El panel muestra los pedidos en tarjetas con totales, permite buscar por nombre, filtrar por estado
(pendiente / pagado / entregado), y **exportar** o **importar** `pedidos.json`.

### Cómo se juntan los pedidos

Hay dos modos, y **conviven sin problema**:

1. **Sin configurar nada** (funciona ya): cada pedido finalizado se guarda en el dispositivo de quien
   pidió y le llega a Tati por WhatsApp/correo. El panel solo ve los pedidos hechos en ese mismo
   celular, más los que Tati cargue a mano a `pedidos.json`.
2. **Con Firebase conectado** (siguiente sección): todos los pedidos, sin importar desde qué celular
   se hagan, aparecen **solos y en vivo** en `admin.html` — sin exportar ni importar nada.

---

## Conectar Firebase (pedidos en vivo, de todos los celulares)

Esto hace que **todos los pedidos se junten automáticamente** en el panel de Tati, en tiempo real,
sin que nadie tenga que exportar ni importar archivos. Es gratis para este volumen de uso.

### 1. Crear el proyecto (una sola vez)

1. Entrá a [console.firebase.google.com](https://console.firebase.google.com) con una cuenta Google
   (podés usar `carlosmarchena@gmail.com` o la de Tati) y creá un proyecto nuevo — por ejemplo
   `sabores-de-tati`. No hace falta activar Google Analytics.
2. En el menú izquierdo entrá a **Build → Firestore Database** y tocá **Crear base de datos**.
   Elegí una ubicación (cualquiera de EE.UU. está bien) y modo **producción**.
3. Andá a **Firestore Database → Reglas** y reemplazá el contenido por esto:

   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /pedidos/{pedidoId} {
         // Cualquiera puede CREAR un pedido (así funciona el checkout)
         allow create: if request.resource.data.persona is string
                       && request.resource.data.total is number
                       && request.resource.data.items is list;
         // Cualquiera puede LEER (así el panel de Tati ve los pedidos)
         allow read: if true;
         // Solo se puede cambiar el campo "estado" (pendiente/pagado/entregado).
         // Nadie puede editar el pedido en sí ni borrarlo desde el navegador.
         allow update: if request.resource.data.diff(resource.data).affectedKeys().hasOnly(['estado']);
         allow delete: if false;
       }
     }
   }
   ```

   Esto deja crear y leer pedidos libremente (necesario, porque no hay login de clientes), pero
   **nadie puede editar ni borrar** un pedido ya hecho — solo marcar su estado. Guardá con **Publicar**.

4. En el ícono ⚙️ (junto a "Project Overview") → **Configuración del proyecto** → bajá a
   **"Tus apps"** → tocá el ícono `</>` (Web) → ponele un nombre (ej. "Pedidos web") → **Registrar app**.
5. Firebase te muestra un bloque `firebaseConfig = { apiKey: "...", ... }`. Copiá esos valores.

### 2. Pegar la configuración en la página

Abrí `firebase-config.js` y reemplazá los valores de ejemplo por los tuyos:

```js
window.FIREBASE_CONFIG = {
  apiKey: "AIzaSy...",
  authDomain: "sabores-de-tati.firebaseapp.com",
  projectId: "sabores-de-tati",
  storageBucket: "sabores-de-tati.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890"
};
```

Subí el archivo actualizado a GitHub junto con los demás. Listo — no hay que tocar `index.html` ni
`admin.html`, ya están conectados.

> Este archivo es público (cualquiera que abra la página lo puede ver), y **eso es normal y seguro**:
> esos valores solo identifican tu proyecto de Firebase, no dan permiso de nada por sí solos — el
> permiso real lo controlan las Reglas de Firestore del paso 1.

### 3. Probarlo

- Publicá los cambios en GitHub Pages (o esperá a que se actualice sola).
- Abrí `index.html` desde el celular, hacé un pedido de prueba y enviálo.
- Abrí `admin.html` en otra pestaña o dispositivo: debería aparecer un badge verde **"🟢 En vivo · N
  en la nube"** arriba a la derecha, y el pedido de prueba en la lista, sin recargar.

> Nota: Firebase necesita que la página esté servida por **https** (como GitHub Pages). Si abrís
> `index.html` localmente con doble clic (`file://`), es normal que la nube no conecte — para probar
> local corré un mini-servidor (`python -m http.server`) o probá directo en GitHub Pages.

---

## Publicar en GitHub Pages (gratis)

1. Creá un repositorio en GitHub (por ejemplo `pedidos-tati`).
2. Subí los dos archivos: `index.html` y `data.json` (podés arrastrarlos en *Add file → Upload files*).
3. En el repo andá a **Settings → Pages**.
4. En *Build and deployment → Source* elegí **Deploy from a branch**.
5. En *Branch* elegí `main` y carpeta `/ (root)`. Guardá.
6. Esperá ~1 minuto. GitHub te da un link tipo `https://TU-USUARIO.github.io/pedidos-tati/`.

¡Listo! Ese link se lo pasás a la gente y ya pueden pedir desde el celular.

> Cada vez que cambiés precios: editá `data.json` en GitHub (lápiz ✏️ → *Commit changes*) y la página se actualiza sola.

---

## Cómo pide la gente

**Cada persona pide por sí misma** (no hay un administrador que pida por el grupo). El flujo es:

1. La persona abre el link en su propio celular.
2. Escribe su nombre para **identificarse**.
3. Marca del menú lo que va a pedir; la página calcula **su** total.
4. Toca **Enviar mi pedido a Tati por WhatsApp** → se abre el chat con Tati con el detalle,
   su nombre y el monto. Solo tiene que tocar enviar.
5. Hace su propio **Sinpe Móvil a Tati (8877-2700)** por ese monto, poniendo su nombre de detalle.

Así Tati recibe un pedido por persona, cada uno con su nombre y su monto. Funciona **sin configurar
nada** (WhatsApp) y sin base de datos, ideal para GitHub Pages.

> Nota técnica: GitHub Pages es estático, así que no existe un "carrito compartido" en vivo entre
> varios celulares. Por eso cada quien envía y paga lo suyo por separado. Si en el futuro querés un
> pedido de grupo combinado en tiempo real, se puede conectar un backend gratis (ej. Firebase).

---

## Recibir pedidos por correo (opcional, con Formspree)

WhatsApp ya funciona sin configurar nada. Si además querés que a Tati le lleguen los pedidos por
**correo**:

1. Entrá a [formspree.io](https://formspree.io) y creá una cuenta (gratis).
2. Creá un formulario nuevo (por ejemplo *"Pedidos Tati"*) con el correo de Tati.
3. Copiá el **ID del formulario** (algo como `xpwznjpq`, aparece en la URL del endpoint).
4. Pegalo en `data.json`:

   ```json
   "formspree": { "id": "xpwznjpq" }
   ```
5. Guardá / subí el cambio. Ahora el botón **Enviar por correo** le manda el pedido a Tati.

---

## Cambiar precios

En `data.json`, cada ítem tiene su `"price"`. Editá el número y guardá:

```json
{ "id": "emp_queso", "name": "Empanada de Queso", "price": 1000, "emoji": "🧀", "img": "" }
```

## Poner fotos reales

Cada ítem trae dos campos visuales:
- `"emoji"`: se muestra sobre un fondo de color si no hay foto (ya funciona así, se ve lindo).
- `"img"`: si le ponés la URL de una foto, la usa en lugar del emoji.

Para usar una foto: subí la imagen a un lugar público (por ejemplo [imgur.com](https://imgur.com) o
directamente al repo de GitHub) y pegá su enlace directo:

```json
{ "id": "pancakes", "name": "Pancakes", "price": 3000, "emoji": "🥞", "img": "https://i.imgur.com/xxxx.jpeg" }
```

Si dejás `"img": ""` vacío, se muestra el emoji con su fondo de color. No hace falta tocar el HTML.
