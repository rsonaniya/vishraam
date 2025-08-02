import express, { Request, Response } from "express";
import User from "../models/user";
import jwt from "jsonwebtoken";
import { check, validationResult } from "express-validator";

const router = express.Router();


router.post("/register",[check("firstName","Firstname is required").isString(),
    check("lastName","Lastname is required").isString(),
    check("email","Email is required").isEmail(),
    check("password","Password is required with min 6 and max 20 characters").isLength({ min: 6, max: 20 })
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }
    user = new User(req.body);

    await user.save();

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
    return res.status(200).json({message:"User registered OK"});
  } catch (error) {
    console.error("Error registering user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
