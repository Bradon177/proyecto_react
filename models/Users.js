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
    identificacion: { type: String, unique: true, required: function() { return this.provider === "local"; } },
    fechaNacimiento: { type: Date, required: function() { return this.provider === "local"; } },
    password: { type: String, minlength: 6, required: function() { return this.provider === "local"; } },
    provider: { type: String, enum: ["local", "google"], default: "local" },
    googleId: { type: String },
    rol: { type: String, enum: ["user", "admin"], default: "user" },
  },
  {
    //esto es para el create y el update
    timestamps: true,
  }
);
export default mongoose.models.user || mongoose.model("user", UserSchema);
