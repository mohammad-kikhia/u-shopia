import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

type CheckoutLine = {
  title?: string;
  image?: string;
  price?: number;
  count?: number;
};

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  return new Stripe(key);
}

export async function POST(req: NextRequest) {
  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json(
      { message: "Stripe is not configured (set STRIPE_SECRET_KEY)." },
      { status: 503 },
    );
  }

  let body: { products?: { value?: CheckoutLine[] }; locale?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: "Invalid JSON body" }, { status: 400 });
  }

  const locale = body.locale === "ar" ? "ar" : "en";

  const lines = body.products?.value;
  if (!Array.isArray(lines) || lines.length < 1) {
    return NextResponse.json({ message: "Missing products" }, { status: 400 });
  }

  const origin = req.headers.get("origin") ?? req.nextUrl.origin;

  try {
    const line_items = lines.map((product) => {
      const title = product.title ?? "Item";
      const unitAmount = Math.round(Number(product.price ?? 0) * 100);
      const quantity = Math.max(1, Math.floor(Number(product.count ?? 1)));
      const images =
        typeof product.image === "string" && product.image.startsWith("http")
          ? [product.image]
          : [];

      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: title,
            ...(images.length ? { images } : {}),
          },
          unit_amount: unitAmount > 0 ? unitAmount : 100,
        },
        quantity,
      };
    });

    const session = await stripe.checkout.sessions.create({
      line_items,
      mode: "payment",
      success_url: `${origin}/${locale}?success=true`,
      cancel_url: `${origin}/${locale}?canceled=true`,
    });

    return NextResponse.json({ stripeSession: session });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Checkout failed";
    const status =
      typeof err === "object" && err !== null && "statusCode" in err
        ? Number((err as { statusCode?: number }).statusCode) || 500
        : 500;
    return NextResponse.json({ message }, { status });
  }
}
