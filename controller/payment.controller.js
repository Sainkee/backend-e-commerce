import Stripe from "stripe";
import Order from "../model/order.model.js";
import customError from "../utils/error.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createPaymentIntent = async (req, res, next) => {
  const { orderId } = req.body;

   

  try {
    const order = await Order.findById(orderId);
    if (!order) {
      throw new customError("Order not found", 404);
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(Number(order.totalPrice) * 100),
      currency: "usd",
      receipt_email:"sainkee1997@gmail.com",

      metadata: { orderId: order._id.toString() },
    });

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error(error+"payment intent");
    next(error);
  }
};

export const checkout = async (req, res, next) => {
  const { orderId } = req.body;

  try {
    const order = await Order.findById(orderId).populate('items.productId');
    if (!order) {
      throw new customError("Order not found", 404);
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: order.items.map((item) => ({
        price_data: {
          currency: "usd",
          product_data: {
            name: item.productId.title,
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      })),
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/success`,
      cancel_url: `${process.env.CLIENT_URL}/cancel`,
      metadata: {
        orderId: order._id.toString(),
      },
    });

    res.status(200).json({ url: session.url });
  } catch (error) {
    console.error(error+"checkout");
    next(error);

  }
};
