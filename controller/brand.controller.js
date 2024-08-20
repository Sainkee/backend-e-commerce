import Brand from "../model/brand.model.js";
import User from "../model/user.model.js";
import cloudinary from "../utils/cloudinary.js";
import fs from "node:fs";

export const createBrand = async (req, res, next) => {
  const { name, description, _id } = req.body;
  const userId = req.user._id;

  try {
    const user = await User.findById(userId);
    if (!user || user.role === "CUSTOMER") {
      return next(new customError("Unauthorized error", 403));
    }

    if (!req.file) {
      return res.status(400).json({ message: "No logo uploaded" });
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      public_id: crypto.randomUUID(),
      folder: "uploads",
    });

    const brandData = {
      name,
      description,
      logo: result.secure_url,
    };

    let brand;
    if (_id) {
      brand = await Brand.findByIdAndUpdate(_id, brandData, {
        new: true,
        runValidators: true,
      });
      if (!brand) {
        return res.status(404).json({ message: "Brand not found" });
      }
      res.status(200).json({ message: "Brand updated successfully", brand });
    } else {
      brand = new Brand(brandData);
      await brand.save();
      res.status(201).json({ message: "Brand created successfully", brand });
    }
  } catch (error) {
    next(error);
  } finally {
    fs.unlink(req.file.path, (err) => {
      if (err) {
        console.error("Failed to delete local file:", err);
      } else {
        console.log("Local file deleted successfully");
      }
    });
  }
};

export const getAllBrands = async (req, res, next) => {
  try {
    const brands = await Brand.find();

    res.status(200).json({ message: "Brands retrieved successfully", brands });
  } catch (error) {
    next(error);
  }
};

export const getSingleBrand = async (req, res, next) => {
  const brandId = req.params.id;

  try {
    const brand = await Brand.findById(brandId);

    if (!brand) {
      return res.status(404).json({ message: "Brand not found" });
    }

    res.status(200).json({ message: "Brand retrieved successfully", brand });
  } catch (error) {
    next(error);
  }
};

export const updateBrand = async (req, res, next) => {
  const brandId = req.params.id;
  const { name, description } = req.body;
  const userId = req.user._id;

  try {
    const user = await User.findById(userId);

    if (!user || user.role === "CUSTOMER") {
      return next(new customError("Unauthorized error", 403));
    }

    const brand = await Brand.findById(brandId);

    if (!brand) {
      return res.status(404).json({ message: "Brand not found" });
    }

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        public_id: uuidv4(),
        folder: "uploads",
      });
      brand.logo = result.secure_url;
    }

    brand.name = name || brand.name;
    brand.description = description || brand.description;

    const updatedBrand = await brand.save();

    res
      .status(200)
      .json({ message: "Brand updated successfully", updatedBrand });
  } catch (error) {
    next(error);
  }
};

export const deleteBrand = async (req, res, next) => {
  const brandId = req.params.id;
  const userId = req.user._id;

  try {
    const user = await User.findById(userId);

    if (!user || user.role === "CUSTOMER") {
      return next(new customError("Unauthorized error", 403));
    }

    const brand = await Brand.findByIdAndDelete(brandId);

    if (!brand) {
      return res.status(404).json({ message: "Brand not found" });
    }

    res.status(200).json({ message: "Brand deleted successfully" });
  } catch (error) {
    next(error);
  }
};
