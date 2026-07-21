# Sabores de Tati — Página de pedidos

Página web de una sola carpeta: todo el contenido vive en `data.json` y el diseño en `index.html`.
Es estática (sin servidor), responsive (celular, tablet, compu) y lista para **GitHub Pages**.

## Archivos
- `index.html` — el diseño y toda la lógica (menú, registro de personas, cálculo de totales, cierre con Sinpe).
- `data.json` — el contenido: negocio, menú, precios, datos de Sinpe/WhatsApp de Tati y el ID de Formspree.

Para cambiar precios, nombres o agregar platillos **solo editás `data.json`** — no tocás el HTML.

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
