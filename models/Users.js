import mongoose from "mongoose";

const UsersShecema = new mongoose.Schema(
  {
    nombre: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    identificacion: { type: String, required: true, unique: true },
    fechaNacimiento: {
      type: Date,
      required: true,
    },
    password: { type: String, required: true, minlength: 6 },
    rol: { type: String, enum: ["user", "admin"], default: "user" },
  },
  {
    //esto es para el create y el update
    timestamps: true,
  }
);
//eso es para evitar volver a crear el modelo cuadno se recargue la pagina
export default mongoose.models.User || mongoose.model("user", UsersShecema);
