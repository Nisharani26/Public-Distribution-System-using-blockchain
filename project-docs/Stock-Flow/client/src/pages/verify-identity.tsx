import { useState } from "react";
import { useLocation } from "wouter";
import { Store, ArrowLeft, Mail, Phone, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function VerifyIdentity() {
  const [_, setLocation] = useLocation();
  const [method, setMethod] = useState<"email" | "phone">("email");
  const [contact, setContact] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");

  /* ---------------- VALIDATORS ---------------- */
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[6-9]\d{9}$/; // Indian mobile format

  /* ---------------- HANDLERS ---------------- */

  const handleSendCode = (e: React.FormEvent) => {
    e.preventDefault();

    if (!contact) {
      toast.error("Please enter your contact details");
      return;
    }

    if (method === "email" && !emailRegex.test(contact)) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (method === "phone" && !phoneRegex.test(contact)) {
      toast.error("Please enter a valid 10-digit mobile number");
      return;
    }

    setOtpSent(true);
    toast.success(
      `Verification code sent to your ${method === "email" ? "email" : "mobile"}`
    );
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();

    if (otp.length !== 6) {
      toast.error("OTP must be 6 digits");
      return;
    }

    toast.success("Identity Verified!");
    setLocation("/reset-pin");
  };

  /* ---------------- INPUT CONTROL ---------------- */

  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (method === "phone") {
      if (/^\d*$/.test(value) && value.length <= 10) {
        setContact(value);
      }
    } else {
      setContact(value);
    }
  };

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value) && value.length <= 6) {
      setOtp(value);
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
          <div className="flex flex-col items-center mb-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <Store className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-slate-800">
              Verify Identity
            </h1>
            <p className="text-green-600 font-medium">
              Verify your identity
            </p>
          </div>

          {!otpSent ? (
            <>
              <p className="text-center text-slate-600 mb-6">
                Verify your identity to reset PIN
              </p>

              <form onSubmit={handleSendCode} className="space-y-6">
                {/* METHOD SELECT */}
                <div className="space-y-3">
                  <Label className="text-slate-600 text-base">
                    Verification Method
                  </Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div
                      className={cn(
                        "border rounded-lg p-4 flex flex-col items-center gap-2 cursor-pointer transition-colors",
                        method === "email"
                          ? "bg-green-50 border-green-500 text-green-700"
                          : "border-slate-200 hover:bg-slate-50"
                      )}
                      onClick={() => {
                        setMethod("email");
                        setContact("");
                      }}
                    >
                      <Mail className="w-6 h-6" />
                      <span>Email</span>
                    </div>

                    <div
                      className={cn(
                        "border rounded-lg p-4 flex flex-col items-center gap-2 cursor-pointer transition-colors",
                        method === "phone"
                          ? "bg-green-50 border-green-500 text-green-700"
                          : "border-slate-200 hover:bg-slate-50"
                      )}
                      onClick={() => {
                        setMethod("phone");
                        setContact("");
                      }}
                    >
                      <Phone className="w-6 h-6" />
                      <span>Phone</span>
                    </div>
                  </div>
                </div>

                {/* CONTACT INPUT */}
                <div className="space-y-2">
                  <Label className="text-slate-600 text-base">
                    {method === "email" ? "Email Address" : "Mobile Number"}
                  </Label>
                  <div className="relative">
                    {method === "email" ? (
                      <Mail className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
                    ) : (
                      <Phone className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
                    )}
                    <Input
                      placeholder={
                        method === "email"
                          ? "Enter your email"
                          : "Enter 10-digit mobile number"
                      }
                      inputMode={method === "phone" ? "numeric" : "email"}
                      className="pl-10 h-12 text-lg"
                      value={contact}
                      onChange={handleContactChange}
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 text-lg bg-green-600 hover:bg-green-700 text-white"
                >
                  Send Verification Code / कोड भेजें
                </Button>
              </form>
            </>
          ) : (
            <>
              <p className="text-center text-slate-600 mb-6">
                Enter the OTP sent to your {method}
              </p>

              <form onSubmit={handleVerifyOtp} className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-slate-600 text-base">
                    Enter OTP / ओटीपी दर्ज करें
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
                    <Input
                      placeholder="Enter 6-digit OTP"
                      className="pl-10 h-12 text-lg tracking-widest"
                      value={otp}
                      onChange={handleOtpChange}
                      maxLength={6}
                      inputMode="numeric"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 text-lg bg-green-600 hover:bg-green-700 text-white"
                >
                  Verify OTP / सत्यापित करें
                </Button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setOtpSent(false);
                      setOtp("");
                    }}
                    className="text-sm text-slate-500 hover:text-green-600 underline"
                  >
                    Wrong number/email? Change it
                  </button>
                </div>
              </form>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
