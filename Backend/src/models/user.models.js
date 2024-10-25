import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Define the user schema
const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      index: true,
      lowercase: true,
      unique: true,
    },
    fullname: {  // Ensure this matches your frontend
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      index: true,
      lowercase: true,
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, 'Password must be at least 6 characters long'],
    },
    refreshToken: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);


// Middleware to hash password before saving the user
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); // If password is not modified, move to the next process

  this.password = await bcrypt.hash(this.password, 10); // If password is modified, hash it
  next(); // Proceed to the next middleware or save the document
});

// Instance method to compare passwords
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Instance method to generate access token
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    { _id: this._id, username: this.username }, // Changed 'user._id' to 'this._id' to reference the current instance
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );
};

// Instance method to generate refresh token
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

// Export the User model
export const User = mongoose.model("User", userSchema);
