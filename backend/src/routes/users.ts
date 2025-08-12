import express, { Request, Response } from "express";
import User from "../models/user";
import PendingUser from "../models/pendingUser";
import jwt from "jsonwebtoken";
import { check, validationResult } from "express-validator";
import sendEmail from "../utils/mail";
import bcrypt from "bcryptjs";
import { generateOtpEmail } from "../templates/registerOtpEmail";
import verifyToken from "../middleware/auth";

const router = express.Router();

router.get("/me", verifyToken, async (req: Request, res: Response) => {
  const userId = req.userId;
  try {
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

router.post(
  "/request-otp",
  [
    check("firstName", "Firstname is required").isString(),
    check("lastName", "Lastname is required").isString(),
    check("email", "Email is required").isEmail(),
    check(
      "password",
      "Password is required with min 6 and max 20 characters"
    ).isLength({ min: 6, max: 20 }),
  ],

  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, ...rest } = req.body;

      const foundRegisteredUser = await User.findOne({ email });

      if (foundRegisteredUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      // generate 6-digit numeric OTP
      const otp = Math.floor(100000 + Math.random() * 900000);

      // remove any existing pending user with same email
      await PendingUser.findOneAndDelete({ email });

      // store user data + otp in PendingUser collection
      const pendingUser = new PendingUser({
        email,
        otp,
        ...rest,
      });
      await pendingUser.save();

      await sendEmail({
        email,
        subject: "Verify your email",
        html: generateOtpEmail(otp.toString()),
      });

      return res
        .status(200)
        .json({ message: "OTP sent to your email address" });
    } catch (error) {
      console.error("Error creating pending user:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
);

router.post(
  "/verify-otp",
  [
    check("email", "Valid email is required").isEmail(),
    check("otp", "OTP must be a 6-digit number")
      .isLength({ min: 6, max: 6 })
      .isNumeric(),
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      let foundPendingUser = await PendingUser.findOne({
        email: req.body.email,
      });

      if (!foundPendingUser) {
        return res
          .status(400)
          .json({ message: "No Registration initiated with provided email" });
      }
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res.status(400).json({ message: "User already exists" });
      }
      const otpCorrect = await bcrypt.compare(
        req.body.otp,
        foundPendingUser.otp
      );

      if (!otpCorrect) {
        return res.status(401).json({ message: "Invalid OTP" });
      }
      if (foundPendingUser.expiresAt < new Date()) {
        return res.status(400).json({ message: "OTP expired" });
      }

      const { email, password, firstName, lastName } = foundPendingUser;

      user = new User({ email, password, firstName, lastName });

      await user.save();
      await PendingUser.findByIdAndDelete(foundPendingUser._id);

      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET as string,
        {
          expiresIn: "1h",
        }
      );

      res.cookie("auth_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 3600000, // 1 Hour in milliseconds
      });
      return res.status(200).json({ message: "User registered OK" });
    } catch (error) {
      console.error("Error registering user:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
);

export default router;
