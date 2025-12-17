import Layout from "@/components/layout"
import { Link } from "wouter"
import {
  ClipboardList,
  AlertTriangle,
  Package,
  Store,
  FileText,
  Box,
} from "lucide-react"
import { Card } from "@/components/ui/card"

export default function Dashboard() {
  return (
    <Layout
      title="दुकानदार पोर्टल"
      subtitle="Shopkeeper Portal"
      showLogout
      variant="dashboard"   //  DASHBOARD COLOR VARIANT
    >
      <div className="space-y-6">

        {/* ===== Shop Info Card ===== */}
        <div
          className="flex items-center gap-4 p-6 rounded-xl border border-slate-200 bg-white
                     shadow-[0_8px_25px_rgba(0,0,0,0.08)]
                     hover:shadow-[0_14px_40px_rgba(0,0,0,0.14)]
                     hover:-translate-y-0.5 transition-all duration-300"
        >
          <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center">
            <Store className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-green-900">
              Sarkari Ration Shop #45
            </h2>
            <p className="text-slate-500 text-sm">
              Sector 12, District North
            </p>
          </div>
        </div>

        {/* ===== Stats Cards ===== */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-blue-500 text-white border-0 h-32 shadow-[0_8px_25px_rgba(0,0,0,0.15)]">
            <div className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <ClipboardList className="w-5 h-5" />
                <span className="font-medium">आज की रिक्वेस्ट</span>
              </div>
              <p className="text-xs opacity-90">Today's Requests</p>
              <p className="text-3xl font-bold mt-2">
                12 <span className="text-lg font-normal opacity-90">Pending</span>
              </p>
            </div>
          </Card>

          <Card className="bg-orange-500 text-white border-0 h-32 shadow-[0_8px_25px_rgba(0,0,0,0.15)]">
            <div className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-5 h-5" />
                <span className="font-medium">कम स्टॉक</span>
              </div>
              <p className="text-xs opacity-90">Low Stock</p>
              <p className="text-3xl font-bold mt-2">
                3 <span className="text-lg font-normal opacity-90">Items</span>
              </p>
            </div>
          </Card>

          <Card className="bg-green-500 text-white border-0 h-32 shadow-[0_8px_25px_rgba(0,0,0,0.15)]">
            <div className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <Package className="w-5 h-5" />
                <span className="font-medium">आज वितरण</span>
              </div>
              <p className="text-xs opacity-90">Today Delivered</p>
              <p className="text-3xl font-bold mt-2">
                28 <span className="text-lg font-normal opacity-90">Orders</span>
              </p>
            </div>
          </Card>
        </div>

        {/* ===== Quick Actions ===== */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* View Requests */}
          <Link href="/requests">
            <div
              className="h-[120px] p-6 rounded-2xl bg-white border border-slate-200
                         shadow-[0_6px_18px_rgba(0,0,0,0.08)]
                         hover:shadow-[0_12px_30px_rgba(0,0,0,0.14)]
                         hover:-translate-y-0.5 transition-all cursor-pointer
                         flex items-center gap-4"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
                <ClipboardList className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-normal text-blue-900 text-lg">
                  अनुरोध देखें
                </h3>
                <p className="text-slate-500 text-sm">View Requests</p>
                <span className="mt-1 inline-block text-xs font-medium text-red-600 bg-red-100 px-2 py-0.5 rounded-full">
                  12 New
                </span>
              </div>
            </div>
          </Link>

          {/* Stock Info */}
          <Link href="/stock">
            <div
              className="h-[120px] p-6 rounded-2xl bg-white border border-slate-200
                         shadow-[0_6px_18px_rgba(0,0,0,0.08)]
                         hover:shadow-[0_12px_30px_rgba(0,0,0,0.14)]
                         hover:-translate-y-0.5 transition-all cursor-pointer
                         flex items-center gap-4"
            >
              <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center shrink-0">
                <Box className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-normal text-green-900 text-lg">
                  स्टॉक जानकारी देखें
                </h3>
                <p className="text-slate-500 text-sm">Stock Information</p>
              </div>
            </div>
          </Link>

          {/* Update Stock */}
          <Link href="/update-stock-mode">
            <div
              className="h-[120px] p-6 rounded-2xl bg-white border border-slate-200
                         shadow-[0_6px_18px_rgba(0,0,0,0.08)]
                         hover:shadow-[0_12px_30px_rgba(0,0,0,0.14)]
                         hover:-translate-y-0.5 transition-all cursor-pointer
                         flex items-center gap-4"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-normal text-blue-900 text-lg">
                  स्टॉक अपडेट करें
                </h3>
                <p className="text-slate-500 text-sm">Update Stock</p>
              </div>
            </div>
          </Link>

          {/* Reports */}
          <Link href="/reports">
            <div
              className="h-[120px] p-6 rounded-2xl bg-white border border-slate-200
                         shadow-[0_6px_18px_rgba(0,0,0,0.08)]
                         hover:shadow-[0_12px_30px_rgba(0,0,0,0.14)]
                         hover:-translate-y-0.5 transition-all cursor-pointer
                         flex items-center gap-4"
            >
              <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center shrink-0">
                <FileText className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-normal text-green-900 text-lg">
                  रिपोर्ट्स डाउनलोड करें
                </h3>
                <p className="text-slate-500 text-sm">Download Reports</p>
              </div>
            </div>
          </Link>

        </div>

        {/* ===== Low Stock Alert ===== */}
        <div
          className="bg-orange-50 border border-orange-200 rounded-xl p-6
                     shadow-[0_8px_25px_rgba(0,0,0,0.08)]"
        >
          <div className="flex items-center gap-2 text-orange-800 font-bold mb-3">
            <AlertTriangle className="w-5 h-5" />
            <h3>Low Stock Alert / कम स्टॉक चेतावनी</h3>
          </div>
          <ul className="ml-7 space-y-1 text-orange-900 font-medium">
            <li>• Rice / चावल: 85 kg left</li>
            <li>• Sugar / चीनी: 45 kg left</li>
            <li>• Oil / तेल: 30 L left</li>
          </ul>
        </div>

      </div>
    </Layout>
  )
}
