// webhook file
import Stripe from "stripe";
import { NextResponse } from "next/server";
import { createOrder } from "@/lib/actions/order.actions";
import { connectToDatabase } from "@/lib/database";
import User from "@/lib/database/models/user.model";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

export async function POST(request: Request) {
  const sig = request.headers.get("stripe-signature") as string;
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

  const rawBody = await request.arrayBuffer();
  const body = Buffer.from(rawBody);

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err) {
    return NextResponse.json(
      { message: "Webhook error", error: err },
      { status: 400 }
    );
  }

  const eventType = event.type;

  if (eventType === "checkout.session.completed") {
    const { id, amount_total, metadata } = event.data.object;

    await connectToDatabase();
    
    // Find the user by clerkId and get their MongoDB _id
    const user = await User.findOne({ clerkId: metadata?.buyerId });
    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    const order = {
      stripeId: id,
      eventId: metadata?.eventId || "",
      buyerId: user._id.toString(), // Use the MongoDB _id instead of Clerk ID
      totalAmount: amount_total ? (amount_total / 100).toString() : "0",
      createdAt: new Date(),
    };

    const newOrder = await createOrder(order);
    return NextResponse.json({ message: "OK", order: newOrder });
  }

  return new Response("", { status: 200 });
}