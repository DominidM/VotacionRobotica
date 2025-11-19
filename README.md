# Votación - Proyecto (Vite + Vue 3 + Firebase)

Una aplicación de votación simple creada con Vue 3 (Vite) y Firebase (Authentication por link sin contraseña + Firestore). Este README explica cómo poner en marcha el proyecto, configurarlo con Firebase, reglas mínimas de seguridad y cómo desplegarlo en Firebase Hosting.

---

## Contenido
- Descripción
- Requisitos
- Estructura del proyecto
- Instalación y ejecución local
- Variables de entorno / configuración de Firebase
- Configuración en Firebase Console
- Reglas de seguridad (Firestore)
- Build y despliegue (Firebase Hosting)
- Solución de problemas comunes
- Buenas prácticas y notas finales

---

## Descripción
Este proyecto implementa un formulario de votación donde los usuarios se autentican mediante Email Link (passwordless) y su voto se guarda en Firestore. Las reglas de Firestore evitan votos duplicados y restringen la creación a correos de un dominio institucional específico.

---

## Requisitos
- Node.js (recomendado LTS >= 18)
- npm (incluido con Node)
- Firebase account y proyecto creado en https://console.firebase.google.com
- Firebase CLI (se puede usar con `npx firebase ...` sin instalar globalmente)

---

## Estructura recomendada (resumen)
```
votacion/
├─ .gitignore
├─ README.md
├─ package.json
├─ vite.config.js
├─ firebase.json
├─ firestore.rules
├─ .env.local
├─ public/
└─ src/
   ├─ main.js
   ├─ firebase.js
   ├─ App.vue
   ├─ assets/
   │  └─ style.css
   ├─ components/
   │  └─ VoteForm.vue
   ├─ views/
   └─ services/
```

---

## Instalación y ejecución local (comandos)
Ejecuta los comandos desde la carpeta raíz del proyecto (donde está `package.json`):

1. Instalar dependencias
```
npm install
```

2. (si no creaste el proyecto aún) Crear proyecto Vite + Vue
```
npm create vite@latest votacion -- --template vue
cd votacion
npm install
```

3. Instalar Firebase SDK (si no está instalado)
```
npm install firebase
```

4. Levantar servidor de desarrollo
```
npm run dev
```
Abre la URL que muestre Vite (por ejemplo: http://localhost:5173)

---

## Variables de entorno y firebaseConfig
Recomiendo usar `.env.local` para las claves públicas (Vite requiere prefijo `VITE_`). Crea un archivo `.env.local` en la raíz con:

```
VITE_FIREBASE_API_KEY=tu_api_key
VITE_FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tu-proyecto
VITE_FIREBASE_STORAGE_BUCKET=tu-proyecto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=xxxx
VITE_FIREBASE_APP_ID=1:xxxx:web:yyyy
```

En `src/firebase.js` usa `import.meta.env` para leer las variables:

```javascript
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};
```

Si prefieres no usar `.env.local`, puedes pegar directamente el `firebaseConfig` en `src/firebase.js` (no recomendado para repos públicos).

---

## Configuración en Firebase Console (pasos)
1. Crea un proyecto en Firebase Console.
2. En Authentication → Sign-in method → habilita **Email link (passwordless sign-in)**.
3. En Authentication → Authorized domains → añade:
   - `localhost` (para pruebas locales)
   - tu dominio de hosting (p. ej. `tu-proyecto.web.app`) cuando esté disponible
4. En Project settings → Your apps → registra una app Web y copia el `firebaseConfig` o usa las variables de entorno.
5. Habilita Firestore Database (modo Producción o en modo de prueba temporal mientras desarrollas) y luego publica reglas.

---

## Reglas de Firestore (archivo `firestore.rules`)
Coloca este archivo en la raíz del repo (junto a `package.json`) y cámbiale el dominio por el real:

```text
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /votes/{userId} {
      allow create: if request.auth != null
                    && request.auth.uid == userId
                    && request.auth.token.email_verified == true
                    && request.auth.token.email.matches('.*@tuuniversidad.edu$')
                    && !exists(/databases/$(database)/documents/votes/$(userId));
      allow read: if request.auth != null && request.auth.token.admin == true;
      allow update, delete: if false;
    }
  }
}
```

- Reemplaza `tuuniversidad.edu` por el dominio institucional real (p. ej. `miuni.edu`).
- La regla `!exists(...)` evita que un mismo UID cree más de un documento (evita doble voto).
- `request.auth.token.admin` es un claim personalizado que puedes asignar desde el servidor si necesitas panel administrativo.

---

## Inicializar Firebase CLI y deploy
1. Login en Firebase desde la terminal (interactivo):
```
npx firebase login
```

2. Inicializar el proyecto (elige Firestore y Hosting si quieres):
```
npx firebase init
```
- Para Hosting: `public directory` → `dist` (Vite usa `dist` por defecto)
- Configure as SPA → Yes
- Cuando pregunte por las reglas de Firestore, indica el `firestore.rules` de la raíz.

3. Generar build de producción:
```
npm run build
```

4. Desplegar Hosting y reglas de Firestore:
```
npx firebase deploy --only hosting,firestore
```

O para desplegar solo hosting:
```
npx firebase deploy --only hosting
```

---

## Notas sobre el flujo de autenticación (Email Link)
- El flujo guarda temporalmente el correo en `localStorage` antes de enviar el link.
- Cuando el usuario abre el link, la app debe llamar `isSignInWithEmailLink` y luego `signInWithEmailLink`.
- Asegúrate de que el dominio que contiene la URL de callback esté en `Authorized domains`.
- En pruebas locales puedes copiar/pegar la URL del correo en el navegador si el correo no es accesible.

---

## Problemas comunes y soluciones rápidas
- Error al ejecutar `npm` en PowerShell: "ejecución de scripts está deshabilitada" → usa `cmd.exe` o ejecuta en PowerShell:
  ```
  Set-ExecutionPolicy RemoteSigned -Scope CurrentUser -Force
  ```
- Build falla por archivo faltante `./assets/style.css` → crea `src/assets/style.css` o elimina la importación en `src/main.js`.
- En CI Linux los nombres son sensibles a mayúsculas/minúsculas: verifica rutas exactas (p. ej. `src/assets/style.css`).

---

## Buenas prácticas para el entregable (alumno)
- No subas `.env.local` con claves. Añádelo a `.gitignore`.
- Incluye `firestore.rules` y `firebase.json` versionados en el repo.
- Documenta en `README.md` cómo configurar Firebase Console (dominios, auth method).
- Haz commits temáticos y claros: `feat: add VoteForm`, `chore: add firestore.rules`.
- Si haces demostración, deja `localhost` autorizado y muestra pasos para desplegar.

---

## Recursos
- Vite: https://vitejs.dev
- Vue 3: https://vuejs.org
- Firebase (Auth, Firestore, Hosting): https://firebase.google.com/docs

---

Si quieres, puedo:
- Generar automáticamente los archivos `src/firebase.js`, `src/components/VoteForm.vue` y `firestore.rules` listos para pegar,
- O preparar un bloque de comandos para PowerShell / Bash que cree la estructura y archivos base en tu proyecto.
