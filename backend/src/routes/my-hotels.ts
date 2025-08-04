import express, { Request, Response } from "express";
import multer from "multer";
import cloudinary from "cloudinary";
import Hotel, { HotelType } from "../models/hotel";
import verifyToken from "../middleware/auth";
import { body, validationResult } from "express-validator";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, //5 MB
  },
});

router.post(
  "/",
  verifyToken,
  upload.array("imageFiles", 6),
  [
    body("name").notEmpty().withMessage("Hotel Name is required"),
    body("city").notEmpty().withMessage("City Name is required"),
    body("country").notEmpty().withMessage("Country Name is required"),
    body("description").notEmpty().withMessage("Hotel description is required"),
    body("type").notEmpty().withMessage("Hotel type is required"),
    body("pricePerNight")
      .notEmpty()
      .isNumeric()
      .withMessage("Price per Night is required and must be a number"),
    body("facilities")
      .notEmpty()
      .isArray()
      .withMessage("facilities is required"),
    body("starRating")
      .notEmpty()
      .withMessage("starRating is required")
      .isInt({ min: 1, max: 5 })
      .withMessage("starRating must be between 1 and 5"),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const imageFiles = req.files as Express.Multer.File[];
      const newHotel: HotelType = req.body;
      // 1. Upload images to cloudinary
      const uploadPromises = imageFiles.map(async (image) => {
        const b64 = Buffer.from(image.buffer).toString("base64");
        let dataUri = "data:" + image.mimetype + ";base64," + b64;
        const res = await cloudinary.v2.uploader.upload(dataUri);
        return res.url;
      });

      const imageUrls = await Promise.all(uploadPromises);

      // 2. If upload is success, add urls to the new hotel
      newHotel.imageUrls = imageUrls;
      newHotel.lastUpdated = new Date();
      newHotel.userId = req.userId;

      // 3. Save new hotel in DB

      const hotel = new Hotel(newHotel);
      await hotel.save();
      // 4. Return 201
      res.status(201).json(hotel);
    } catch (error) {
      console.log("error creating hotel", error);
      res.status(500).json({ message: "Something went wrong" });
    }
  }
);

router.get("/", verifyToken, async (req: Request, res: Response) => {
  try {
    const hotels = await Hotel.find({ userId: req.userId });
    res.status(200).json(hotels);
  } catch (error) {
    console.log("error fetching hotels", error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

export default router;
