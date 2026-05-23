const database = require("../database/db");
const Stripe = require("stripe");

const stripe = Stripe("PASTE_YOUR_STRIPE_SECRET_KEY");

async function generatePaymentIntent(orderId, totalPrice) {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalPrice * 100,
      currency: "usd",
    });

    await database.query(
      "INSERT INTO payments (order_id, payment_type, payment_status, payment_intent_id) VALUES (?, ?, ?, ?)",
      [orderId, "Online", "Pending", paymentIntent.client_secret],
    );

    return { success: true, clientSecret: paymentIntent.client_secret };
  } catch (error) {
    console.error("Payment Error:", error.message || error);
    return { success: false, message: "Payment Failed." };
  }
}

module.exports = { generatePaymentIntent };
