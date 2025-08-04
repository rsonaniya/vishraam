import mongoose from "mongoose";
import bcrypt from "bcryptjs";

export type PendingUserType = {
  _id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  otp: string;
  expiresAt: Date;
};

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    expires: 600,
  },
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 10 * 60 * 1000), // 10 minutes from now
  },
});
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});
userSchema.pre("save", async function (next) {
  if (this.isModified("otp")) {
    this.otp = await bcrypt.hash(this.otp, 10);
  }
  next();
});

const PendingUser = mongoose.model<PendingUserType>("PendingUser", userSchema);

export default PendingUser;
