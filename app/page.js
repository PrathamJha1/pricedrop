import { createClient } from "@/utils/supabase/server";
import { getProducts } from "./actions";
import AddProductForm from "@/components/AddProductForm";
import ProductCard from "@/components/ProductCard";
import {
  TrendingDown,
  Shield,
  Bell,
  Rabbit,
  AlertCircle,
  Mail,
  PlayCircle,
  Rocket,
  Target,
  Puzzle,
  BarChart3,
  Layers,
} from "lucide-react";
import AuthButton from "@/components/AuthButton";
import Image from "next/image";

export default async function Home() {
  // ✅ GOOD (Next.js 16 asynchronous way)
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const products = user ? await getProducts() : [];

  const FEATURES = [
    {
      icon: Rabbit,
      title: "Lightning Fast",
      description:
        "Price Drop extracts prices in seconds, handling JavaScript and dynamic content",
    },
    {
      icon: Shield,
      title: "Always Reliable",
      description:
        "Works across all major e-commerce sites with built-in anti-bot protection",
    },
    {
      icon: Bell,
      title: "Smart Alerts",
      description: "Get notified instantly when prices drop below your target",
    },
  ];

  return (
    <main className="min-h-screen bg-linear-to-br from-orange-50 via-white to-orange-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Image
              src="/price-drop-logo.png"
              alt="Deal Drop Logo"
              width={600}
              height={200}
              className="h-10 w-auto"
            />
          </div>

          <AuthButton user={user} />
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          {/* HR / Interviewer Notice Banner */}
          <div className="bg-orange-100 border-l-4 border-orange-500 p-4 mb-12 text-left rounded-r-md mx-auto max-w-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start">
              <div className="shrink-0 mt-0.5">
                <AlertCircle className="h-5 w-5 text-orange-600" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-orange-800">
                  Notice for Interviewers & HR
                </h3>
                <div className="mt-1 text-sm text-orange-700">
                  <p>
                    If the scraping functionality fails, it is due to
                    insufficient free credits on the Firecrawl API. Please refer
                    to the demo video below.
                  </p>
                </div>
              </div>
            </div>

            {/* Enhanced Mailto Button */}
            <a
              href="mailto:prathamjha5683@gmail.com?subject=Support%20Query"
              className="shrink-0 inline-flex items-center gap-2 px-4 py-2 bg-orange-600 text-white text-sm font-medium rounded-md hover:bg-orange-700 transition-colors shadow-sm"
            >
              <Mail className="w-4 h-4" />
              Contact Admin
            </a>
          </div>

          <h2 className="text-5xl font-bold text-gray-900 mb-4 tracking-tight">
            Never Miss a Price Drop
          </h2>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Track prices from any e-commerce site. Get instant alerts when
            prices drop. Save money effortlessly.
          </p>

          <AddProductForm user={user} />

          {/* Features */}
          {products.length === 0 && (
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-16">
              {FEATURES.map(({ icon: Icon, title, description }) => (
                <div
                  key={title}
                  className="bg-white p-6 rounded-xl border border-gray-200"
                >
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                    <Icon className="w-6 h-6 text-orange-500" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
                  <p className="text-sm text-gray-600">{description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Demo Video Section for HR */}
      <section className="max-w-4xl mx-auto px-4 pb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center flex flex-col items-center justify-center">
          <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mb-4">
            <PlayCircle className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            Project Demo Walkthrough
          </h3>
          <p className="text-gray-600 mb-8 max-w-lg mx-auto">
            See exactly how the tracking, web scraping, and smart email alerts
            work in real-time in this brief video demonstration.
          </p>
          <a
            href="https://drive.google.com/file/d/1JyQFMYkiw6PSeB1q2kSmcwicgrGc1Ul4/view?usp=drive_link"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white text-base font-medium rounded-lg hover:bg-gray-800 transition-colors shadow-sm"
          >
            <PlayCircle className="w-5 h-5" />
            Watch Demo Video
          </a>
        </div>
      </section>

      {/* Future Scope Section */}
      <section className="max-w-4xl mx-auto px-4 pb-12">
        <div className="bg-white rounded-xl shadow-sm border border-orange-200 p-8 relative overflow-hidden">
          {/* Subtle background icon decoration */}
          <div className="absolute -top-4 -right-4 p-8 opacity-5 pointer-events-none">
            <Rocket className="w-48 h-48 text-orange-900" />
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Rocket className="w-5 h-5 text-orange-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">
                Future Scope & Roadmap
              </h3>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              {/* Feature 1 */}
              <div className="bg-orange-50/50 p-5 rounded-lg border border-orange-100">
                <div className="flex items-center gap-2 mb-2">
                  <Layers className="w-5 h-5 text-orange-600" />
                  <h4 className="font-semibold text-gray-900">
                    Multi-Platform Comparison
                  </h4>
                </div>
                <p className="text-sm text-gray-600">
                  Expanding the scraping engine to support simultaneous
                  cross-platform comparison. Instantly aggregate and identify
                  the absolute best deal across Amazon, BestBuy, Walmart, etc.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-orange-50/50 p-5 rounded-lg border border-orange-100">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-5 h-5 text-orange-600" />
                  <h4 className="font-semibold text-gray-900">
                    Custom Target Alerts
                  </h4>
                </div>
                <p className="text-sm text-gray-600">
                  LLD schema updates to introduce a{" "}
                  <code className="bg-orange-100 px-1 py-0.5 rounded text-orange-800">
                    target_price
                  </code>{" "}
                  threshold. Users can specify custom logic (e.g., "Only alert
                  me if it drops below ₹400") to reduce email noise.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-orange-50/50 p-5 rounded-lg border border-orange-100">
                <div className="flex items-center gap-2 mb-2">
                  <Puzzle className="w-5 h-5 text-orange-600" />
                  <h4 className="font-semibold text-gray-900">
                    Browser Extension
                  </h4>
                </div>
                <p className="text-sm text-gray-600">
                  A React-based Chrome Extension that injects a "Track Price"
                  button directly into e-commerce product pages, eliminating
                  friction and enabling 1-click tracking.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="bg-orange-50/50 p-5 rounded-lg border border-orange-100">
                <div className="flex items-center gap-2 mb-2">
                  <BarChart3 className="w-5 h-5 text-orange-600" />
                  <h4 className="font-semibold text-gray-900">
                    Detailed Analytics
                  </h4>
                </div>
                <p className="text-sm text-gray-600">
                  Expanding the Recharts dashboard to provide rich user metrics,
                  including KPIs like "Total Money Saved," "Biggest Historical
                  Price Drop," and "Average Time to Drop."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      {user && products.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 pb-20">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900">
              Your Tracked Products
            </h3>
            <span className="text-sm text-gray-500">
              {products.length} {products.length === 1 ? "product" : "products"}
            </span>
          </div>

          <div className="grid gap-6 md:grid-cols-2 items-start">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* Empty State */}
      {user && products.length === 0 && (
        <section className="max-w-2xl mx-auto px-4 pb-20 text-center">
          <div className="bg-white rounded-xl border-2 border-dashed border-gray-300 p-12">
            <TrendingDown className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No products yet
            </h3>
            <p className="text-gray-600">
              Add your first product above to start tracking prices!
            </p>
          </div>
        </section>
      )}
    </main>
  );
}
