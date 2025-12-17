import Layout from "@/components/layout";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { CheckCircle, AlertTriangle, Plus, FileText, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

const stockItems = [
  { id: 1, name: "Rice / चावल", current: "450 kg", unit: "kg" },
  { id: 2, name: "Wheat / गेहूं", current: "320 kg", unit: "kg" },
  { id: 3, name: "Sugar / चीनी", current: "85 kg", unit: "kg" },
  { id: 4, name: "Kerosene / मिट्टी का तेल", current: "0 L", unit: "L" },
  { id: 5, name: "Oil / तेल", current: "120 L", unit: "L" },
  { id: 6, name: "Salt / नमक", current: "45 kg", unit: "kg" },
];

export default function UpdateStockManual() {
  const [_, setLocation] = useLocation();

  const handleUpdate = () => {
    // alert("Stock Updated Successfully!");
    setLocation("/dashboard");
  };

  return (
    <Layout 
      title="स्टॉक अपडेट करें" 
      subtitle="Update Stock"
      showBack
      backTo="/update-stock-mode"
    >
      <div className="space-y-6">
        
        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-center gap-2 text-blue-800 font-bold mb-2">
            <div className="border-2 border-blue-600 rounded-sm w-5 h-6 flex items-center justify-center">
              <FileText className="w-3 h-4" />
            </div>
            <h3>निर्देश / Instructions</h3>
          </div>
          <ul className="space-y-1 ml-8 text-blue-900 text-sm list-disc">
            <li>नया स्टॉक की मात्रा नीचे दर्ज करे (यह मात्रा स्टॉक में जोड़ा जाएगा)</li>
            <li>Enter new stock quantity (this will be added to current stock)</li>
          </ul>
        </div>

        {/* Update Form */}
        <Card className="p-6 border-0 shadow-sm">
          <h2 className="text-lg font-bold text-slate-700 mb-6 flex items-center gap-2">
            <Plus className="w-5 h-5 text-green-600" />
            Add New Stock / नया स्टॉक जोड़े
          </h2>

          <div className="space-y-6">
            {stockItems.map((item) => (
              <div key={item.id} className="border border-slate-200 rounded-xl p-4">
                <div className="mb-2">
                  <h3 className="text-slate-800 font-medium text-lg">{item.name}</h3>
                  <p className="text-slate-500 text-sm">Current: {item.current}</p>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center shrink-0">
                    <Plus className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="flex-1 relative">
                    <Input 
                      type="number" 
                      placeholder="Enter quantity to add" 
                      className="h-12 text-lg pr-12"
                    />
                    <span className="absolute right-4 top-3 text-slate-500 font-medium">
                      {item.unit}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Button 
            onClick={handleUpdate} 
            className="w-full bg-green-600 hover:bg-green-700 h-12 text-lg mt-8 font-medium text-white"
          >
            Update Stock / स्टॉक अपडेट करें
          </Button>
        </Card>

        {/* Note */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-center gap-2 text-blue-800 font-bold mb-2">
            <Info className="w-5 h-5" />
            <h3>नोट / Note</h3>
          </div>
          <ul className="space-y-1 ml-7 text-blue-900 text-sm list-disc">
            <li>स्टॉक अपडेट करने के बाद ब्लॉकचेन पे रिकॉर्ड किया जाएगा</li>
            <li>Stock update will be recorded on Blockchain</li>
          </ul>
        </div>
      </div>
    </Layout>
  );
}
