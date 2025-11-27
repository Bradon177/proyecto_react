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


Configuracion Mongo DB

para poder configurar mondo primero es necesario tener una cuenta en [Mongo DB](https://www.mongodb.com/).
luego de tener la cuenta es necesario crear un proyecto en [Mongo DB](https://www.mongodb.com/).

ya despues es necesario descargar las librerias de mongo para poder conectar con la base de datos.
es npm install mongoose o yarn add mongoose o pnpm add mongoose dependiendo el proyecto

ya teniendo todo es necesario crear nuestra base de datos existen bases de datos gratuitas y pagas.
en este proyecto se va a usar la base de datos gratuita de [Mongo DB](https://www.mongodb.com/).
ya que tiene un almacenamiento en la nube de 512 MB de almacenamiento. 
para hacer la coneccion se necesita un archivo .env en la raiz del proyecto.
en el archivo .env se va a agregar la variable de entorno MONGO_URI.
del cual se va a copiar la cadena de conexion de [Mongo DB](https://www.mongodb.com/).

en la cadena de conexion se va a reemplazar <password> por la contraseña de la cuenta de [Mongo DB](https://www.mongodb.com/).
y ademas configurar el puerto dentro de mongo para poder poder ingresar datos  ingresando el puerto 0.00.00/0. 
y porque ese puerto pues debido a que no tenemos un servidor propio para poder ingresar datos.
en cambio el puerto 0.00.00/0 es para poder ingresar datos desde cualquier ip.

despues para poder hacer ingreso de datos tenemos que hacer la conexion en el archivo lib/db.js
en el archivo db.js se va a agregar la siguiente linea de codigo:
import mongoose from "mongoose";

y para probar la conexion creamos un archivo api y probamos la conexion.

en el archivo api/db.test.js se va a agregar la siguiente linea de codigo:
import { connectDB } from "../../lib/db";


export async function GET() {
  try {
    await connectDB();
    return Response.json({ message: "Conexión exitosa a MongoDB" });
  } catch (error) {
    return Response.json({ error: "Error al conectar a MongoDB", details: error.message }, { status: 500 });
  }
}

ya sabiendo que la conexion funciona correctamente.

podemos crear un modelo en el archivo models/user.js estableciendo el schema de usuario y sus tipos de datos
en el archivo user.js se va a agregar la siguiente linea de codigo:
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

export default mongoose.models.User || mongoose.model("User", userSchema);

esto lo que hace es crear un modelo de usuario en la base de datos y mongo lo que hace es convetirlos en json.
donde en la carpeta api/user puedes establecer los metodos para poder ingresar y obtener datos de la base de datos y aplicar validaciones.


