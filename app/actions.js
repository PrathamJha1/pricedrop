"use server";

import { createClient } from "@/utils/supabase/server";
import { scrapeProduct } from "@/lib/firecrawl";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// Helper function to extract platform name from URL
function getPlatformFromUrl(urlString) {
  try {
    const url = new URL(urlString);
    let hostname = url.hostname.replace("www.", "");
    const platform = hostname.split(".")[0];
    return platform.charAt(0).toUpperCase() + platform.slice(1);
  } catch (e) {
    return "Web";
  }
}

export async function addProduct(formData) {
  const url = formData.get("url");

  if (!url) {
    return { error: "URL is required" };
  }

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { error: "Not authenticated" };
    }

    // 1. Scrape product data with Firecrawl
    const productData = await scrapeProduct(url);

    if (!productData.productName || !productData.currentPrice) {
      console.log(productData, "productData");
      return { error: "Could not extract product information from this URL" };
    }

    const newPrice = parseFloat(productData.currentPrice);
    const currency = productData.currencyCode || "USD";
    const platform = getPlatformFromUrl(url);

    // 2. Check if this specific link already exists for this user
    const { data: existingLink } = await supabase
      .from("product_links")
      .select("id, current_price, product_id, products!inner(user_id)")
      .eq("url", url)
      .eq("products.user_id", user.id)
      .single();

    const isUpdate = !!existingLink;
    let productId;
    let productLinkId;

    if (isUpdate) {
      // It's an update: Just update the existing link's price and timestamp
      productId = existingLink.product_id;
      productLinkId = existingLink.id;

      const { error: updateError } = await supabase
        .from("product_links")
        .update({
          current_price: newPrice,
          updated_at: new Date().toISOString(),
        })
        .eq("id", productLinkId);

      if (updateError) throw updateError;
    } else {
      // It's a brand new tracking link.
      // Create the umbrella "product" first
      const { data: newProduct, error: prodError } = await supabase
        .from("products")
        .insert({
          user_id: user.id,
          name: productData.productName,
          image_url: productData.productImageUrl,
        })
        .select()
        .single();

      if (prodError) throw prodError;
      productId = newProduct.id;

      // Then create the specific store link
      const { data: newLink, error: linkError } = await supabase
        .from("product_links")
        .insert({
          product_id: productId,
          platform: platform,
          url: url,
          current_price: newPrice,
          currency: currency,
        })
        .select()
        .single();

      if (linkError) throw linkError;
      productLinkId = newLink.id;
    }

    // 3. Add to price history if it's a new product OR the price has changed
    const shouldAddHistory =
      !isUpdate || existingLink.current_price !== newPrice;

    if (shouldAddHistory) {
      await supabase.from("price_history").insert({
        product_link_id: productLinkId,
        price: newPrice,
        currency: currency,
      });
    }

    revalidatePath("/");
    return {
      success: true,
      product: { id: productId }, // Return ID so UI can handle routing/state if needed
      message: isUpdate
        ? "Product updated with latest price!"
        : "Product added successfully!",
    };
  } catch (error) {
    console.error("Add product error:", error);
    return { error: error.message || "Failed to add product" };
  }
}

export async function deleteProduct(productId) {
  try {
    const supabase = await createClient();
    // Because of the CASCADE delete in SQL, deleting the parent product
    // automatically wipes out all associated product_links and price_history entries.
    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", productId);

    if (error) throw error;

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    return { error: error.message };
  }
}

export async function getProducts() {
  try {
    const supabase = await createClient();

    // Fetch products AND all of their associated store links
    const { data, error } = await supabase
      .from("products")
      .select(
        `
        *,
        product_links (*)
      `,
      )
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Get products error:", error);
    return [];
  }
}

export async function getPriceHistory(productId) {
  try {
    const supabase = await createClient();

    // Fetch all price history for ALL links associated with this product
    // The inner join ensures we map the history back to the specific platform
    const { data, error } = await supabase
      .from("price_history")
      .select(
        `
        *,
        product_links!inner(product_id, platform)
      `,
      )
      .eq("product_links.product_id", productId)
      .order("checked_at", { ascending: true });

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.error("Get price history error:", error);
    return [];
  }
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/");
  redirect("/");
}
