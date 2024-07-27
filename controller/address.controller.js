import Address from "../model/addresh.model.js";
import User from "../model/user.model.js";
import customError from "../utils/error.js";


// Add or Update Address
export const addOrUpdateAddress = async (req, res, next) => {
  const { street, city, state, postalCode, country, isDefault, type, _id } =
    req.body;
  const userId = req.user._id; // Assuming you have user authentication middleware

  try {
    let address;

    if (_id) {
      // Update existing address
      address = await Address.findOneAndUpdate(
        { _id, user: userId },
        { street, city, state, postalCode, country, isDefault, type },
        { new: true }
      );
    } else {
      // Add new address
      address = new Address({
        user: userId,
        street,
        city,
        state,
        postalCode,
        country,
        isDefault,
        type,
      });
      await address.save();

      // Add address reference to user

      const user = await User.findById(userId);
      if (type === "BILLING") {
        user.billingAddresses.push(address._id);
      } else if (type === "SHIPPING") {
        user.shippingAddresses.push(address._id);
      }
      await user.save();
    }

    res.status(200).json({ message: "Address saved successfully", address });
  } catch (error) {
    next(error);
  }
};

// Delete Address
export const deleteAddress = async (req, res, next) => {
  const { addressId } = req.params;
  const userId = req.user._id;

  try {
    const deletedAddress = await Address.findOneAndDelete({
      _id: addressId,
      user: userId,
    });

    if (!deletedAddress) {
      throw new customError("Address not found", 404);
    }

    const user = await User.findById(userId);
    if (deletedAddress.type === "BILLING") {
      user.billingAddresses = user.billingAddresses.filter(
        (item) => item.toString() !== deletedAddress._id.toString()
      );
    } else if (deletedAddress.type === "SHIPPING") {
      user.shippingAddresses = user.shippingAddresses.filter(
        (item) => item.toString() !== deletedAddress._id.toString()
      );
    }

    await user.save();

    res.status(200).json({ message: "Address deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// Get User Addresses
export const getUserAddresses = async (req, res, next) => {
  const userId = req.user._id;

  try {
    const addresses = await Address.find({ user: userId });
    res.status(200).json({ addresses });
  } catch (error) {
    next(error);
  }
};
