import mongoose from "mongoose";
import bcrypt from "bcryptjs"; 
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      trim: true,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
  },
  {
    timestamps: true,
    collection: "users",
  }
);

userSchema.pre('save' , async function (next ){
  const user = this 
  if (! user.isModified('password')){
    return next()
  }

  user.password = await bcrypt.hash(user.password , 8)
  next ()
})
const User = mongoose.model("User", userSchema);
export default User;