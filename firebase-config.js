// Configuración de Firebase — pegá acá los datos de TU proyecto.
// Se obtienen en https://console.firebase.google.com → ⚙️ Configuración del proyecto
// → "Tus apps" → app web (</>) → "Config".
//
// Este archivo es público (lo ve cualquiera que abra la página), pero eso es normal
// y seguro para Firebase: estos valores solo identifican tu proyecto, no dan acceso
// de escritura por sí solos — eso lo controlan las "Reglas de seguridad" de Firestore
// (ver instrucciones en README.md).
//
// Mientras dejes "TU_API_KEY" tal cual, la página funciona igual que antes
// (WhatsApp, correo y guardado local), simplemente sin sincronizar a la nube.

window.FIREBASE_CONFIG = {
  apiKey: "TU_API_KEY",
  authDomain: "TU_PROYECTO.firebaseapp.com",
  projectId: "TU_PROYECTO",
  storageBucket: "TU_PROYECTO.appspot.com",
  messagingSenderId: "000000000000",
  appId: "1:000000000000:web:xxxxxxxxxxxxxxxxxxxxxx"
};
