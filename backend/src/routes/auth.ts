import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/user";
import { check, validationResult } from "express-validator";
import verifyToken from "../middleware/auth";
const router = express.Router();

router.post(
  "/login",
  [
    check("email", "Email is a required field").isEmail(),
    check("password", "Password is a required field").isString(),
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;
      const foundUser = await User.findOne({ email });
      if (!foundUser) {
        return res.status(400).json({
          message: "Invalid Credentials",
        });
      }
      const isPasswordCorrect = await bcrypt.compare(
        password,
        foundUser.password
      );
      if (!isPasswordCorrect) {
        res.status(401).json({
          message: "Invalid Credentials",
        });
      }
      const token = jwt.sign(
        { userId: foundUser.id },
        process.env.JWT_SECRET as string,
        { expiresIn: "1h" }
      );
      res.cookie("auth_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 3600000, // 1 Hour in milliseconds
      });
      return res.status(200).json({ userId: foundUser._id });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Something went wrong",
      });
    }
  }
);

router.get("/validate-token", verifyToken, (req: Request, res: Response) => {
  res.status(200).send({ userId: req.userId });
});

router.post("/logout", (req: Request, res: Response) => {
  res.cookie("auth_token", "", {
    expires: new Date(0),
  });
  res.status(200).json({ message: "Signed Out" });
});
export default router;
