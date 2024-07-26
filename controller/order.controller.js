import Cart from "../model/cart.model.js";
import Order from "../model/order.model.js";
import customError from "../utils/error.js";

export const createOrder = async (req, res, next) => {
  const userId = req.user._id;

  try {
    const cart = await Cart.findOne({ user: userId }).populate({
      path: "cartItem.product",
      model: "Product",
    });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Calculate total price
    const totalPrice = cart.cartItem.reduce((acc, item) => {
      return acc + item.quantity * item.product.price;
    }, 0);

    // Create the order
    const newOrder = new Order({
      user: userId,
      items: cart.cartItem.map((item) => ({
        productId: item.product._id,
        quantity: item.quantity,
        price: item.product.price,
      })),
      totalPrice,
    });

    await newOrder.save();

    // Clear the cart
    cart.cartItem = [];
    await cart.save();

    res.status(201).json({ message: "Order created successfully", newOrder });
  } catch (error) {
    next(error);
  }
};
export const getAllOrder = async (req, res, next) => {
  const userId = req.user._id;

  try {
    const orders = await Order.find({ user: userId }).populate({
      path: "items.productId",
      model: "Product",
    });

    if (orders.length === 0) {
      return res.status(404).json({ message: "No orders found for this user" });
    }

    res.status(200).json({ message: "Orders retrieved successfully", orders });
  } catch (error) {
    next(error);
  }
};

export const deleteOrder = async (req, res, next) => {
  const userId = req.user._id;

  const orderId = req.params.id;

  try {
    if (!userId) {
      throw new customError("unathorized request", 401);
    }

    const order = await Order.findOneAndDelete({ _id: orderId, user: userId });
    if (!order) {
      return res
        .status(404)
        .json({ message: "Order not found or not authorized to delete" });
    }

    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export const getSingleOrder = async (req, res, next) => {
  const userId = req.user._id;

  const orderId = req.params.id;

  try {
    if (!userId) {
      throw new customError("unathorized request", 401);
    }

    const order = await Order.findOne({ _id: orderId, user: userId }).populate(
      "items.productId"
    );
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({ message: "Order fetched successfully", order });
  } catch (error) {
    next(error);
  }
};

export const updateOrder = async (req, res, next) => {
  const userId = req.user._id;
  const orderId = req.params.id;
  try {
    if (!userId) {
      throw new customError("unathorized request", 401);
    }

    const order = await Order.findOne({ _id: orderId, user: userId });

    if (!order) {
      throw new customError("order not found", 404);
    }

    order.status = req.body.status.toLowerCase();
    const updatedOrder = await order.save();

    res
      .status(200)
      .json({ message: "Order updated successfully", updatedOrder });
  } catch (error) {
    next(error);
  }
};
