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
    <main className="min-h-screen flex flex-col bg-linear-to-br from-orange-50 via-white to-orange-50">
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
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
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
            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mt-20">
              {FEATURES.map(({ icon: Icon, title, description }) => (
                <div
                  key={title}
                  className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center mb-6 mx-auto">
                    <Icon className="w-7 h-7 text-orange-500" />
                  </div>
                  <h3 className="font-semibold text-lg text-gray-900 mb-3">
                    {title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">{description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Demo Video Section for HR */}
      <section className="max-w-4xl mx-auto px-4 pb-16 w-full">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-10 text-center flex flex-col items-center justify-center">
          <div className="w-16 h-16 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center mb-6">
            <PlayCircle className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Project Demo Walkthrough
          </h3>
          <p className="text-gray-600 mb-8 max-w-lg mx-auto text-lg">
            See exactly how the tracking, web scraping, and smart email alerts
            work in real-time in this brief video demonstration.
          </p>
          <a
            href="https://drive.google.com/file/d/1JyQFMYkiw6PSeB1q2kSmcwicgrGc1Ul4/view?usp=drive_link"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 text-white text-base font-medium rounded-xl hover:bg-gray-800 transition-colors shadow-sm hover:shadow-md hover:-translate-y-0.5"
          >
            <PlayCircle className="w-5 h-5" />
            Watch Demo Video
          </a>
        </div>
      </section>

      {/* Products Grid (Fixed Layout & Alignment) */}
      {user && products.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 pb-20 flex-grow w-full">
          <div className="flex items-center justify-between mb-8 border-b border-gray-200 pb-4">
            <h3 className="text-3xl font-bold text-gray-900">
              Your Tracked Products
            </h3>
            <span className="text-sm font-semibold text-orange-700 bg-orange-100 px-4 py-1.5 rounded-full shadow-sm">
              {products.length} {products.length === 1 ? "Product" : "Products"}
            </span>
          </div>

          {/* Changed to lg:grid-cols-3 and items-start to prevent weird stretching */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 items-start">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* Empty State */}
      {user && products.length === 0 && (
        <section className="max-w-3xl mx-auto px-4 pb-20 text-center flex-grow w-full">
          <div className="bg-white rounded-2xl border-2 border-dashed border-gray-300 p-16">
            <TrendingDown className="w-16 h-16 text-gray-400 mx-auto mb-6" />
            <h3 className="text-2xl font-semibold text-gray-900 mb-3">
              No products yet
            </h3>
            <p className="text-gray-500 text-lg">
              Add your first product above to start tracking prices!
            </p>
          </div>
        </section>
      )}

      {/* Future Scope Section */}
      <section className="max-w-7xl mx-auto px-4 pb-24 w-full">
        <div className="bg-white rounded-2xl shadow-sm border border-orange-200 p-10 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 p-8 opacity-5 pointer-events-none">
            <Rocket className="w-64 h-64 text-orange-900" />
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <Rocket className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900">
                Future Scope & Roadmap
              </h3>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-orange-50/50 p-6 rounded-xl border border-orange-100 transition-colors hover:bg-orange-50">
                <div className="flex items-center gap-3 mb-4">
                  <Layers className="w-6 h-6 text-orange-600" />
                  <h4 className="font-semibold text-gray-900">
                    Multi-Platform
                  </h4>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Expanding the scraping engine to support simultaneous
                  cross-platform comparison. Instantly aggregate and identify
                  the absolute best deal across Amazon, BestBuy, Walmart, etc.
                </p>
              </div>

              <div className="bg-orange-50/50 p-6 rounded-xl border border-orange-100 transition-colors hover:bg-orange-50">
                <div className="flex items-center gap-3 mb-4">
                  <Target className="w-6 h-6 text-orange-600" />
                  <h4 className="font-semibold text-gray-900">Custom Alerts</h4>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  LLD schema updates to introduce a{" "}
                  <code className="bg-orange-100 px-1.5 py-0.5 rounded text-orange-800 font-mono text-xs">
                    target_price
                  </code>{" "}
                  threshold. Users can specify custom logic (e.g., "Only alert
                  me if it drops below ₹400").
                </p>
              </div>

              <div className="bg-orange-50/50 p-6 rounded-xl border border-orange-100 transition-colors hover:bg-orange-50">
                <div className="flex items-center gap-3 mb-4">
                  <Puzzle className="w-6 h-6 text-orange-600" />
                  <h4 className="font-semibold text-gray-900">
                    Browser Extension
                  </h4>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  A React-based Chrome Extension that injects a "Track Price"
                  button directly into e-commerce product pages, eliminating
                  friction and enabling 1-click tracking.
                </p>
              </div>

              <div className="bg-orange-50/50 p-6 rounded-xl border border-orange-100 transition-colors hover:bg-orange-50">
                <div className="flex items-center gap-3 mb-4">
                  <BarChart3 className="w-6 h-6 text-orange-600" />
                  <h4 className="font-semibold text-gray-900">
                    Detailed Analytics
                  </h4>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Expanding the dashboard to provide rich user metrics,
                  including KPIs like "Total Money Saved," "Biggest Historical
                  Price Drop," and "Average Time to Drop."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer / HR & Interviewer Notice */}
      <footer className="mt-auto bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="bg-orange-50 border border-orange-200 rounded-2xl p-8 flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="bg-orange-100 p-4 rounded-full shrink-0">
              <AlertCircle className="w-8 h-8 text-orange-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Notice for Interviewers & HR
              </h3>
              <p className="text-gray-700 leading-relaxed">
                If the live web scraping functionality fails, it is likely due
                to insufficient free credits on the Firecrawl API. Please refer
                to the Demo Video above to see the application in action. For
                any issues or queries, please email{" "}
                <a
                  href="mailto:prathamjha5683@gmail.com"
                  className="font-bold text-orange-700 hover:underline"
                >
                  prathamjha5683@gmail.com
                </a>{" "}
                with the subject{" "}
                <span className="font-bold text-orange-700">
                  "Support Query"
                </span>
                .
              </p>
            </div>
          </div>

          <div className="text-center text-gray-500 text-sm mt-12 font-medium">
            <p>
              © {new Date().getFullYear()} Price Drop Tracker. Built by Pratham.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
