import Layout from "@/components/layout";
import { Link } from "wouter";
import { Package, Cog, Server } from "lucide-react";

export default function UpdateStockMode() {
  return (
    <Layout 
      title="स्टॉक अपडेट मोड" 
      subtitle="Select Update Mode"
      showBack
      backTo="/dashboard"
    >
      <div className="space-y-8 py-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-slate-800">स्टॉक अपडेट करने का तरीका चुनें</h2>
          <p className="text-slate-600 mt-2">Select how you want to update your stock</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Manual Mode */}
          <Link href="/update-stock-manual">
            <div className="bg-white p-8 rounded-2xl border-2 border-slate-200 hover:border-blue-500 hover:shadow-lg transition-all cursor-pointer group h-full flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Package className="w-12 h-12 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Manual Update</h3>
              <p className="text-slate-600 mb-4 font-medium">मैनुअल अपडेट</p>
              <p className="text-slate-500 text-sm">
                Manually enter quantities for each item in your inventory. Best for regular adjustments.
              </p>
              <div className="mt-auto pt-6 text-blue-600 font-medium group-hover:translate-x-1 transition-transform flex items-center gap-2">
                Select Manual Mode &rarr;
              </div>
            </div>
          </Link>

          {/* Automatic Mode */}
          <Link href="/update-stock-automatic">
            <div className="bg-white p-8 rounded-2xl border-2 border-slate-200 hover:border-green-500 hover:shadow-lg transition-all cursor-pointer group h-full flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Server className="w-12 h-12 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Automatic Update</h3>
              <p className="text-slate-600 mb-4 font-medium">ऑटोमैटिक अपडेट</p>
              <p className="text-slate-500 text-sm">
                Sync with central server or scan digital invoices to update stock automatically.
              </p>
              <div className="mt-auto pt-6 text-green-600 font-medium group-hover:translate-x-1 transition-transform flex items-center gap-2">
                Select Automatic Mode &rarr;
              </div>
            </div>
          </Link>
        </div>
      </div>
    </Layout>
  );
}
