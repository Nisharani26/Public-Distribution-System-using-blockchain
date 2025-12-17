import Layout from "@/components/layout";
import { FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

const floatingCard =
  "rounded-xl border transition-all duration-300 \
   shadow-[0_8px_25px_rgba(0,0,0,0.08)] \
   hover:shadow-[0_14px_40px_rgba(0,0,0,0.14)] \
   hover:-translate-y-0.5";

export default function Reports() {
  return (
    <Layout title="रिपोर्ट प्राप्त करें" subtitle="Download Reports" showBack>
      <div className="space-y-6">

        {/* Header Card */}
        <div className={`${floatingCard} bg-white p-6 border-slate-200`}>
          <div className="flex items-start gap-3 mb-6">
            <div className="mt-1">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">
                रिपोर्ट डाउनलोड करें / Download Reports
              </h2>
              <p className="text-slate-600">
                दैनिक, साप्ताहिक या मासिक वितरण रिपोर्ट डाउनलोड करें
              </p>
              <p className="text-slate-500 text-sm mt-1">
                Download daily, weekly or monthly distribution reports
              </p>
            </div>
          </div>

          <div className="space-y-4">

            {/* Daily */}
            <div className={`${floatingCard} bg-green-50 border-green-200 p-4 flex justify-between items-center`}>
              <div className="flex gap-4 items-center">
                <div className="bg-white p-2 rounded-lg border border-green-200">
                  <FileText className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">Daily Report</h3>
                  <p className="text-slate-600 text-sm">Today</p>
                  <p className="text-slate-500 text-sm">28 records / रिकार्ड</p>
                </div>
              </div>
              <Button className="bg-green-600 hover:bg-green-700 text-white">
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>

            {/* Weekly */}
            <div className={`${floatingCard} bg-blue-50 border-blue-200 p-4 flex justify-between items-center`}>
              <div className="flex gap-4 items-center">
                <div className="bg-white p-2 rounded-lg border border-blue-200">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">Weekly Report</h3>
                  <p className="text-slate-600 text-sm">This Week</p>
                  <p className="text-slate-500 text-sm">156 records / रिकार्ड</p>
                </div>
              </div>
              <Button className="bg-green-600 hover:bg-green-700 text-white">
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>

            {/* Monthly */}
            <div className={`${floatingCard} bg-purple-50 border-purple-200 p-4 flex justify-between items-center`}>
              <div className="flex gap-4 items-center">
                <div className="bg-white p-2 rounded-lg border border-purple-200">
                  <FileText className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">Monthly Report</h3>
                  <p className="text-slate-600 text-sm">December 2024</p>
                  <p className="text-slate-500 text-sm">542 records / रिकार्ड</p>
                </div>
              </div>
              <Button className="bg-green-600 hover:bg-green-700 text-white">
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className={`${floatingCard} bg-white p-6 border-slate-200`}>
          <h2 className="text-lg font-bold text-slate-800 mb-4">
            Today's Summary / आज का सारांश
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className={`${floatingCard} bg-blue-50 border-blue-200 p-4`}>
              <p className="text-slate-500 text-sm mb-1">Total Deliveries</p>
              <p className="text-blue-600 text-xl font-bold">28 Orders</p>
            </div>
            <div className={`${floatingCard} bg-green-50 border-green-200 p-4`}>
              <p className="text-slate-500 text-sm mb-1">Total Quantity</p>
              <p className="text-green-600 text-xl font-bold">450 kg</p>
            </div>
            <div className={`${floatingCard} bg-orange-50 border-orange-200 p-4`}>
              <p className="text-slate-500 text-sm mb-1">Pending Requests</p>
              <p className="text-orange-600 text-xl font-bold">12 Orders</p>
            </div>
            <div className={`${floatingCard} bg-red-50 border-red-200 p-4`}>
              <p className="text-slate-500 text-sm mb-1">Low Stock Items</p>
              <p className="text-red-600 text-xl font-bold">3 Items</p>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className={`${floatingCard} bg-blue-50 border-blue-200 p-6`}>
          <div className="flex items-center gap-2 text-blue-800 font-bold mb-2">
            <div className="border-2 border-blue-600 rounded-full w-4 h-4 flex items-center justify-center text-xs">
              i
            </div>
            <h3>नोट / Note</h3>
          </div>
          <ul className="space-y-1 ml-7 text-blue-900 text-sm list-disc">
            <li>रिपोर्ट PDF फॉर्मेट में डाउनलोड होगी</li>
            <li>Reports will be downloaded in PDF format</li>
            <li>पूरी विवरणी के लिए मासिक रिपोर्ट डाउनलोड करें</li>
            <li>Download monthly report for detailed information</li>
          </ul>
        </div>

      </div>
    </Layout>
  );
}
