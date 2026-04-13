import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String,enum: ["user", "admin"], default: "user" },
    password: { type: String },
    googleId: { type: String },
    authProvider: {
      type: String,
      enum: ["local", "google"],
      default: "local"
    },
    avatar: { type: String },
    tokenVersion: { type: Number, default: 0 }
}, { timestamps: true });

// Hash password before saving
// userSchema.pre("save", async function () {
//   if (!this.password) return next(); // skip if no password (Google user)
//   if (!this.isModified("password")) return;

//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
// });
userSchema.pre("save", async function () {
  // Skip if no password (Google users)
  if (!this.password) return;

  // Skip if password not modified
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// 🔑 Compare passwords safely
userSchema.methods.matchPassword = async function (enteredPassword) {
  if (!this.password) return false; // Google users won't have password
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;