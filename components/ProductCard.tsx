"use client";

import { useState } from "react";
import { deleteProduct } from "@/app/actions";
import PriceChart from "./PriceChart";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ExternalLink,
  Trash2,
  TrendingDown,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import Link from "next/link";

// TypeScript Interfaces for the new Database Schema
export interface ProductLink {
  id: string;
  product_id: string;
  platform: string;
  url: string;
  current_price: number | string;
  currency: string;
  updated_at?: string;
}

export interface Product {
  id: string;
  user_id: string;
  name: string;
  image_url: string | null;
  product_links?: ProductLink[];
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [showChart, setShowChart] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<boolean>(false);

  // Safely get the links array from the new database structure
  const links = product.product_links || [];

  // Find the link with the lowest current price to feature prominently
  const bestLink =
    links.length > 0
      ? links.reduce((prev, curr) =>
          Number(prev.current_price) < Number(curr.current_price) ? prev : curr,
        )
      : null;

  const handleDelete = async () => {
    if (!confirm("Remove this product and all its store links from tracking?"))
      return;
    setDeleting(true);
    await deleteProduct(product.id);
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex gap-4">
          {product.image_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={product.image_url}
              alt={product.name}
              className="w-20 h-20 object-cover rounded-md border bg-white"
            />
          )}

          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2">
              {product.name}
            </h3>

            {bestLink ? (
              <div className="flex flex-col gap-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-orange-500">
                    {bestLink.currency} {bestLink.current_price}
                  </span>
                  <Badge variant="secondary" className="gap-1">
                    <TrendingDown className="w-3 h-3" />
                    Best Price
                  </Badge>
                </div>
                <span className="text-xs text-gray-500">
                  Tracking across {links.length} platform
                  {links.length > 1 ? "s" : ""}
                </span>
              </div>
            ) : (
              <span className="text-gray-500 italic text-sm">
                No active links found
              </span>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className={undefined}>
        <div className="flex flex-wrap gap-2 items-center justify-between">
          <div className="flex gap-2 flex-wrap">
            {/* Map a button for every platform being tracked */}
            {links.map((link) => (
              <Button
                key={link.id}
                variant="outline"
                size="sm"
                asChild
                className="gap-1"
              >
                <Link href={link.url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-3 h-3" />
                  {link.platform}
                </Link>
              </Button>
            ))}
          </div>

          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowChart(!showChart)}
              className="gap-1"
            >
              {showChart ? (
                <>
                  <ChevronUp className="w-4 h-4" /> Hide Chart
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4" /> Show Chart
                </>
              )}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              disabled={deleting}
              className="text-red-600 hover:text-red-700 hover:bg-red-50 gap-1 px-2"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>

      {showChart && (
        <CardFooter className="pt-0 border-t mt-4">
          <div className="w-full pt-4">
            <PriceChart productId={product.id} />
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
