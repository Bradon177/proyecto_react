import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
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
export default mongoose.models.user || mongoose.model("user", UserSchema);
