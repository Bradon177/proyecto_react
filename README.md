This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev


```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


Configuración de MongoDB

Sigue estos pasos para conectar el proyecto a MongoDB usando Mongoose.

1) Crear cuenta y proyecto
- Crea una cuenta en [MongoDB Atlas](https://www.mongodb.com/). 
- Crea un proyecto y un cluster (puedes usar el plan gratuito).
- En Network Access, añade la IP `0.0.0.0/0` para permitir acceso desde cualquier IP durante desarrollo.

2) Instalar dependencias
- Instala Mongoose en el proyecto: `npm i mongoose` (o `yarn add mongoose` / `pnpm add mongoose`).

3) Configurar variables de entorno
- En el archivo `.env` del proyecto, añade `MONGO_URI` con la cadena de conexión SRV que entrega Atlas.
- Reemplaza `<password>` por la contraseña del usuario que creaste en Atlas.

4) Conexión en el código
- Usa un helper de conexión reutilizable en `app/lib/db.js` (ya presente en el proyecto). Ejemplo de implementación:

```js
import mongoose from "mongoose";

let cached = global.mongoose || { conn: null, promise: null };

export async function connectDB() {
  if (cached.conn) return cached.conn;
  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error("MONGO_URI no configurado");
  if (!cached.promise) {
    cached.promise = mongoose.connect(uri, { bufferCommands: false }).then((m) => m);
  }
  cached.conn = await cached.promise;
  global.mongoose = cached;
  return cached.conn;
}
```

5) Probar la conexión
- Crea un endpoint de prueba en `app/api/db-test/route.js` (ajusta el import según tu estructura):

```js
import { connectDB } from "../../lib/db";

export async function GET() {
  try {
    await connectDB();
    return Response.json({ message: "Conexión exitosa a MongoDB" });
  } catch (error) {
    return Response.json({ error: "Error al conectar a MongoDB", details: error.message }, { status: 500 });
  }
}
```

6) Definir modelos
- Crea tus esquemas en `proyecto/models/*.js`. Ejemplo básico de usuario:

```js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Users || mongoose.model("Users", userSchema);
```

7) Usar los modelos en tus endpoints
- En `app/api/.../route.js` importa el modelo, llama `connectDB()` y ejecuta las operaciones necesarias (crear, leer, actualizar, borrar), aplicando las validaciones correspondientes.


