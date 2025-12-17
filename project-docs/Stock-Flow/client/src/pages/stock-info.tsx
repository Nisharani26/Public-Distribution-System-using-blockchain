import Layout from "@/components/layout";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { CheckCircle, AlertTriangle, XCircle, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const stockItems = [
  { name: "Rice / चावल", qty: "450 kg", status: "Available", statusText: "Available / उपलब्ध" },
  { name: "Wheat / गेहूं", qty: "320 kg", status: "Available", statusText: "Available / उपलब्ध" },
  { name: "Sugar / चीनी", qty: "85 kg", status: "Low", statusText: "Low Stock / कम स्टॉक" },
  { name: "Kerosene / मिट्टी का तेल", qty: "0 L", status: "Out", statusText: "Out of Stock / स्टॉक खत्म" },
  { name: "Oil / तेल", qty: "120 L", status: "Available", statusText: "Available / उपलब्ध" },
  { name: "Salt / नमक", qty: "45 kg", status: "Low", statusText: "Low Stock / कम स्टॉक" },
];

const floatingCard =
  "rounded-xl border transition-all duration-300 \
   shadow-[0_8px_25px_rgba(0,0,0,0.08)] \
   hover:shadow-[0_14px_40px_rgba(0,0,0,0.14)] \
   hover:-translate-y-0.5";

export default function StockInfo() {
  return (
    <Layout title="स्टॉक जानकारी" subtitle="Stock Information" showBack>
      <div className="space-y-6">

        {/* Status Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className={`${floatingCard} bg-green-50 border-green-200 p-4 flex items-center gap-4`}>
            <div className="bg-green-500 rounded-lg p-2 text-white">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-green-700 font-medium">Available</p>
              <p className="text-slate-600 text-sm">3 Items</p>
            </div>
          </div>

          <div className={`${floatingCard} bg-orange-50 border-orange-200 p-4 flex items-center gap-4`}>
            <div className="bg-orange-500 rounded-lg p-2 text-white">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-orange-700 font-medium">Low Stock</p>
              <p className="text-slate-600 text-sm">2 Items</p>
            </div>
          </div>

          <div className={`${floatingCard} bg-red-50 border-red-200 p-4 flex items-center gap-4`}>
            <div className="bg-red-500 rounded-lg p-2 text-white">
              <XCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-red-700 font-medium">Out of Stock</p>
              <p className="text-slate-600 text-sm">1 Item</p>
            </div>
          </div>
        </div>

        {/* Stock Table */}
        <div className={`${floatingCard} bg-white border-slate-200 overflow-hidden`}>
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <div className="flex items-center gap-2 text-green-700 font-medium">
              <CheckCircle className="w-5 h-5" />
              <span>Current Stock / वर्तमान स्टॉक</span>
            </div>
            <Link href="/update-stock-mode">
              <Button className="bg-green-600 hover:bg-green-700 text-white">
                Update Stock / स्टॉक अपडेट करें
              </Button>
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="text-left py-4 px-6 font-bold text-slate-700">Item / सामान</th>
                  <th className="text-center py-4 px-6 font-bold text-slate-700">Quantity / मात्रा</th>
                  <th className="text-right py-4 px-6 font-bold text-slate-700">Status / स्थिति</th>
                </tr>
              </thead>
              <tbody>
                {stockItems.map((item, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50"
                  >
                    <td className="py-4 px-6 text-slate-700 font-medium">
                      {item.name}
                    </td>
                    <td
                      className={cn(
                        "py-4 px-6 text-center font-bold",
                        item.status === "Available" && "text-blue-600",
                        item.status === "Low" && "text-orange-600",
                        item.status === "Out" && "text-red-600"
                      )}
                    >
                      {item.qty}
                    </td>
                    <td className="py-4 px-6 flex justify-end">
                      <span
                        className={cn(
                          "px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 w-fit",
                          item.status === "Available" && "bg-green-100 text-green-700",
                          item.status === "Low" && "bg-orange-100 text-orange-700",
                          item.status === "Out" && "bg-red-100 text-red-700"
                        )}
                      >
                        {item.status === "Available" && <Check className="w-3 h-3" />}
                        {item.status === "Low" && <AlertTriangle className="w-3 h-3" />}
                        {item.status === "Out" && <XCircle className="w-3 h-3" />}
                        {item.statusText}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Alert */}
        <div className={`${floatingCard} bg-orange-50 border-orange-200 p-4 flex gap-3 items-start`}>
          <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5" />
          <div>
            <p className="font-semibold text-orange-800">
              Low Stock Alert / कम स्टॉक चेतावनी
            </p>
            <p className="text-sm text-slate-700">
              कुछ आइटम कम या खत्म हो गए हैं। कृपया जल्द ही स्टॉक अपडेट करें।
            </p>
            <p className="text-sm text-slate-600">
              Some items are running low or out of stock. Please update stock soon.
            </p>
          </div>
        </div>

      </div>
    </Layout>
  );
}
