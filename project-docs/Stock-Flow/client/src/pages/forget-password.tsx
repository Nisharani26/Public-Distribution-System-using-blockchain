import { useState } from "react";
import { useLocation } from "wouter";
import { Store, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

export default function ForgotPassword() {
  const [_, setLocation] = useLocation();
  const [username, setUsername] = useState("");

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (username) {
      setLocation("/verify-identity");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg border-0 relative">
        <button
          onClick={() => setLocation("/")}
          className="absolute top-6 left-6 text-slate-600 flex items-center gap-2 hover:text-slate-900"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Login
        </button>

        <CardContent className="pt-16 pb-8 px-8">
          <div className="flex flex-col items-center mb-4">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <Store className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-slate-800 text-center">
              Reset PIN
            </h1>
            <p className="text-green-600 font-medium">
              Start PIN recovery
            </p>
          </div>

          {/* ✅ DARK & CLEAR FORGOT PIN BOX */}
          <div className="flex justify-center mb-6">
            <div
              className="
                px-6 py-3
                rounded-xl-full
                bg-green-150
                text-green-950
                text-sm
                font-normal
                shadow-lg
                border border-green-200
                select-none">
              Forgot PIN? / पिन भूल गए?
            </div>
          </div>

          <p className="text-center text-slate-600 mb-8">
            Enter your username to start PIN recovery
          </p>

          <form onSubmit={handleContinue} className="space-y-6">
            <div className="space-y-2">
              <Label className="text-slate-600 text-base">
                Username / युजरनेम
              </Label>
              <div className="relative">
                <Store className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
                <Input
                  placeholder="Enter your username"
                  className="pl-10 h-12 text-lg bg-white border-slate-200 focus-visible:ring-green-600"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 text-lg bg-green-600 hover:bg-green-700 font-medium text-white"
            >
              Continue / जारी रखें
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}


