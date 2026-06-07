import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { scrapeProduct } from "@/lib/firecrawl";
import { sendPriceDropAlert } from "@/lib/email";

export async function POST(request) {
  try {
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Use service role to bypass RLS for background jobs
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
    );

    // Fetch all active store links AND join the umbrella product info
    const { data: links, error: linksError } = await supabase.from(
      "product_links",
    ).select(`
        *,
        products (
          name,
          image_url,
          user_id
        )
      `);

    if (linksError) throw linksError;

    console.log(`Found ${links.length} store links to check`);

    const results = {
      total: links.length,
      updated: 0,
      failed: 0,
      priceChanges: 0,
      alertsSent: 0,
    };

    // Process in batches of 5 to speed up execution
    const BATCH_SIZE = 5;

    for (let i = 0; i < links.length; i += BATCH_SIZE) {
      const batch = links.slice(i, i + BATCH_SIZE);

      await Promise.all(
        batch.map(async (link) => {
          try {
            const productData = await scrapeProduct(link.url);

            if (!productData.currentPrice) {
              results.failed++;
              return;
            }

            const newPrice = parseFloat(productData.currentPrice);
            const oldPrice = parseFloat(link.current_price);

            // 1. ALWAYS add to price history to keep the chart lines flowing daily
            await supabase.from("price_history").insert({
              product_link_id: link.id,
              price: newPrice,
              currency: productData.currencyCode || link.currency,
            });

            // 2. ALWAYS update the link so 'updated_at' shows the last check time
            await supabase
              .from("product_links")
              .update({
                current_price: newPrice,
                updated_at: new Date().toISOString(),
              })
              .eq("id", link.id);

            // 3. ONLY trigger alerts and change-counters if the price actually fluctuated
            if (oldPrice !== newPrice) {
              results.priceChanges++;

              // Handle Email Alerts strictly for price DROPS
              if (newPrice < oldPrice) {
                const {
                  data: { user },
                } = await supabase.auth.admin.getUserById(
                  link.products.user_id,
                );

                if (user?.email) {
                  const emailPayload = {
                    name: link.products.name,
                    image_url: link.products.image_url,
                    url: link.url,
                    currency: link.currency,
                  };

                  const emailResult = await sendPriceDropAlert(
                    user.email,
                    emailPayload,
                    oldPrice,
                    newPrice,
                  );

                  if (emailResult.success) {
                    results.alertsSent++;
                  }
                }
              }
            }

            results.updated++;
          } catch (error) {
            console.error(`Error processing link ${link.id}:`, error);
            results.failed++;
          }
        }),
      );
    }

    return NextResponse.json({
      success: true,
      message: "Price check completed",
      results,
    });
  } catch (error) {
    console.error("Cron job error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Price check endpoint is working. Use POST to trigger.",
  });
}
