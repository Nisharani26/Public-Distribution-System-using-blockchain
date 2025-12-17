import { useState } from "react";
import { useLocation } from "wouter";
import {
  Store,
  Lock,
  CheckCircle2,
  KeyRound,
  Info,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export default function Login() {
  const [_, setLocation] = useLocation();
  const { toast } = useToast();

  const [username, setUsername] = useState("");
  const [pin, setPin] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (isLocked) {
      toast({
        title: "Account Locked",
        description: "Please reset your PIN to unlock your account.",
        variant: "destructive",
      });
      return;
    }

    if (!username || !pin) {
      toast({
        title: "Missing Details",
        description: "Please enter both username and PIN.",
        variant: "destructive",
      });
      return;
    }

    if (pin.length !== 4 || isNaN(Number(pin))) {
      toast({
        title: "Invalid PIN",
        description: "PIN must be exactly 4 digits.",
        variant: "destructive",
      });
      return;
    }

    const validUsers = [
      { user: "demo", pin: "1234" },
      { user: "shaktiration", pin: "1234" },
      { user: "suryaration", pin: "4321" },
      { user: "Banarasration", pin: "9765" },
    ];

    const isValidUser = validUsers.some(
      (u) => u.user === username && u.pin === pin
    );

    if (isValidUser) {
      // ✅ SUCCESS + ACKNOWLEDGMENT TOAST
      toast({
        title: "Login Successful / लॉगिन सफल",
        description:
          "Welcome, you have successfully logged in.",
        duration: 6000,
      });

      setTimeout(() => {
        setLocation("/dashboard");
      }, 2000);
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);

      if (newAttempts >= 5) {
        setIsLocked(true);
        toast({
          title: "Account Locked",
          description: "Maximum attempts exceeded.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Invalid Credentials",
          description: `${5 - newAttempts} attempts remaining.`,
          variant: "destructive",
        });
      }

      setPin("");
    }
  };

  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value) && value.length <= 4) {
      setPin(value);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg border-0">
        <CardContent className="pt-10 pb-8 px-8">
          {/* Header */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <Store className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-2xl font-normal text-green-800 text-center">
              दुकानदार लॉगिन
            </h1>
            <p className="text-green-700 font-normal">
              Shopkeeper Login
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Username */}
            <div className="space-y-2">
              <Label className="text-slate-600 text-base">
                Username / युजरनेम
              </Label>
              <div className="relative">
                <Store className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
                <Input
                  placeholder="Enter Username"
                  className="pl-10 h-12 text-lg"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={isLocked}
                />
              </div>
            </div>

            {/* PIN */}
            <div className="space-y-2">
              <Label className="text-slate-600 text-base">
                4-अंकीय पिन / 4-Digit PIN
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
                <Input
                  type="password"
                  inputMode="numeric"
                  placeholder="Enter PIN"
                  className="pl-10 h-12 text-lg font-mono tracking-widest"
                  value={pin}
                  onChange={handlePinChange}
                  maxLength={4}
                  disabled={isLocked}
                />
              </div>
            </div>

            {/* STATIC ACKNOWLEDGMENT */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 flex gap-2 text-sm text-slate-700">
              <Info className="w-4 h-4 text-slate-500 mt-0.5" />
              <p>DISCLAMER: 
                By logging in, the shopkeeper confirms that all actions
                performed in this system will be truthful, authorized,
                and in accordance with government guidelines.
                <br />
                <span className="text-slate-600">
                  लॉगिन करके दुकानदार यह स्वीकार करता है कि सभी कार्य
                  सरकारी नियमों के अनुसार किए जाएंगे।
                </span>
              </p>
            </div>

            {/* Login Button */}
            <Button
              type="submit"
              className="w-full h-12 text-lg bg-green-600 hover:bg-green-700 font-normal text-white"
              disabled={isLocked}
            >
              {isLocked
                ? "Account Locked / खाता बंद है"
                : "लॉगिन करें / Login"}
            </Button>

            {/* Forgot PIN */}
            <button
              type="button"
              onClick={() => setLocation("/forgot-password")}
              className="
                w-full flex items-center justify-center gap-2
                rounded-lg border border-green-200
                bg-green-50 px-4 py-3
                text-green-700 font-medium
                transition-all
                hover:bg-green-100 hover:border-green-300 hover:text-green-800
                focus:outline-none focus:ring-2 focus:ring-green-500
              "
            >
              <KeyRound className="w-4 h-4" />
              Forgot PIN? / पिन भूल गए?
            </button>
          </form>

          {/* Demo Users */}
          {!isLocked && (
            <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex gap-3">
              <CheckCircle2 className="w-5 h-5 text-yellow-600 mt-0.5" />
              <p className="text-sm text-yellow-800">
                Allowed demo users: shaktiration (1234), suryaration (4321),
                Banarasration (9765)
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
