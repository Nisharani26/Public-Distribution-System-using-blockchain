import Layout from "@/components/layout";
import { User, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const requests = [
  {
    id: "RAT345678",
    name: "Mohan Lal",
    time: "1 hour ago",
    items: [
      { name: "Wheat / गेहूं", qty: "10 kg" },
      { name: "Sugar / चीनी", qty: "2 kg" }
    ]
  },
  {
    id: "RAT234567",
    name: "Sita Devi",
    time: "2 hours ago",
    items: [
      { name: "Rice / चावल", qty: "20 kg" },
      { name: "Oil / तेल", qty: "1 L" }
    ]
  },
  {
    id: "RAT890123",
    name: "Ramesh Kumar",
    time: "3 hours ago",
    items: [
      { name: "Wheat / गेहूं", qty: "15 kg" },
      { name: "Salt / नमक", qty: "1 kg" }
    ]
  },
  {
    id: "RAT456789",
    name: "Geeta Ben",
    time: "4 hours ago",
    items: [
      { name: "Rice / चावल", qty: "10 kg" },
      { name: "Sugar / चीनी", qty: "5 kg" }
    ]
  },
  {
    id: "RAT567890",
    name: "Suresh Patel",
    time: "5 hours ago",
    items: [
      { name: "Kerosene / मिट्टी का तेल", qty: "2 L" }
    ]
  },
  {
    id: "RAT112233",
    name: "Anita Singh",
    time: "Yesterday",
    items: [
      { name: "Wheat / गेहूं", qty: "20 kg" },
      { name: "Oil / तेल", qty: "2 L" }
    ]
  },
  {
    id: "RAT445566",
    name: "Vijay Kumar",
    time: "Yesterday",
    items: [
      { name: "Rice / चावल", qty: "15 kg" }
    ]
  },
  {
    id: "RAT778899",
    name: "Sunita Devi",
    time: "Yesterday",
    items: [
      { name: "Sugar / चीनी", qty: "3 kg" },
      { name: "Salt / नमक", qty: "1 kg" }
    ]
  },
  {
    id: "RAT990011",
    name: "Rajesh Gupta",
    time: "2 days ago",
    items: [
      { name: "Wheat / गेहूं", qty: "25 kg" }
    ]
  },
  {
    id: "RAT223344",
    name: "Meena Kumari",
    time: "2 days ago",
    items: [
      { name: "Rice / चावल", qty: "10 kg" },
      { name: "Oil / तेल", qty: "1 L" }
    ]
  },
  {
    id: "RAT556677",
    name: "Kamla Devi",
    time: "2 days ago",
    items: [
      { name: "Kerosene / मिट्टी का तेल", qty: "3 L" }
    ]
  },
  {
    id: "RAT889900",
    name: "Ashok Kumar",
    time: "3 days ago",
    items: [
      { name: "Wheat / गेहूं", qty: "30 kg" }
    ]
  },
  {
    id: "RAT123123",
    name: "Pooja Sharma",
    time: "3 days ago",
    items: [
      { name: "Rice / चावल", qty: "12 kg" },
      { name: "Sugar / चीनी", qty: "2 kg" }
    ]
  },
  {
    id: "RAT456456",
    name: "Deepak Verma",
    time: "3 days ago",
    items: [
      { name: "Oil / तेल", qty: "2 L" },
      { name: "Salt / नमक", qty: "2 kg" }
    ]
  },
  {
    id: "RAT789789",
    name: "Rekha Yadav",
    time: "4 days ago",
    items: [
      { name: "Wheat / गेहूं", qty: "18 kg" }
    ]
  }
];

export default function Requests() {

  // ✅ CONFIRMATION FUNCTIONS
  const handleAccept = (id: string) => {
    const confirmAction = window.confirm(
      `Are you sure you want to ACCEPT request ${id}?`
    );
    if (confirmAction) {
      alert("Request accepted successfully ✅");
    }
  };

  const handleReject = (id: string) => {
    const confirmAction = window.confirm(
      `Are you sure you want to REJECT request ${id}?`
    );
    if (confirmAction) {
      alert("Request rejected ❌");
    }
  };

  return (
    <Layout 
      title="लंबित अनुरोध सूची" 
      subtitle="Pending Requests List"
      showBack
    >
      <div className="space-y-6">

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-center gap-2 text-blue-800 font-bold mb-2">
            <div className="border-2 border-blue-600 rounded-full w-4 h-4 flex items-center justify-center text-xs">
              i
            </div>
            <h3>निर्देश / Instructions</h3>
          </div>
          <ul className="space-y-1 ml-7 text-blue-900 text-sm list-disc">
            <li>रिक्वेस्ट स्वीकार करने से पहले OTP/PIN मांगे</li>
            <li>After accepting, ask citizen for OTP/PIN verification</li>
          </ul>
        </div>

        <div className="space-y-4">
          {requests.map((req) => (
            <div
              key={req.id}
              className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-blue-100 p-3 rounded-full">
                  <User className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">{req.name}</h3>
                  <p className="text-slate-500 text-sm">ID: {req.id}</p>
                  <p className="text-orange-500 text-sm">{req.time}</p>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-bold text-slate-700 mb-4">
                  Requested Items / मांगा गया सामान
                </h4>
                <div className="space-y-3">
                  {req.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center border-b border-dashed border-slate-200 pb-2 last:border-0"
                    >
                      <span className="text-slate-700">{item.name}</span>
                      <span className="font-medium text-slate-900">
                        {item.qty}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* ✅ BUTTONS */}
              <div className="grid grid-cols-2 gap-4">

                {/* ACCEPT */}
                <Button
                  onClick={() => handleAccept(req.id)}
                  className="
                    w-full h-12
                    bg-green-600
                    text-white
                    rounded-xl
                    font-semibold
                    text-base
                    transition-all duration-300
                    hover:bg-green-500
                    hover:scale-[1.03]
                  "
                >
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Accept / स्वीकार करें
                </Button>

                {/* REJECT */}
                <Button
                  onClick={() => handleReject(req.id)}
                  className="
                    w-full h-12
                    bg-red-600
                    text-white
                    rounded-xl
                    font-semibold
                    text-base
                    transition-all duration-300
                    hover:bg-red-500
                    hover:scale-[1.03]
                  "
                >
                  <XCircle className="w-5 h-5 mr-2" />
                  Reject / अस्वीकार करें
                </Button>

              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
