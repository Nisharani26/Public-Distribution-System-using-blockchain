import React, { useState, useRef, useEffect } from "react";
import { X, MessageSquare } from "lucide-react";
import { toast } from "sonner";

export default function AuthorityOTPModal({ phone, authorityId, onVerify, onClose }) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); // ✅ For browser error
  const inputRefs = useRef([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (index, value) => {
    if (value.length > 1) return;
    if (value && !/^\d$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setErrorMessage(""); // ✅ Clear error while typing
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const otpValue = otp.join("");
    if (otpValue.length !== 6) {
      setErrorMessage("Please enter complete OTP");
      return;
    }

    setLoading(true);
    setErrorMessage(""); // Clear previous error

    try {
      const res = await fetch(
        "http://localhost:5000/api/auth/authority/verify-otp",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ authorityId, otp: otpValue }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.message || "Invalid OTP"); // ✅ Show in browser
        setOtp(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
        setLoading(false);
        return;
      }

      if (data.token) {
        toast.success("OTP verified successfully!");
        onVerify(data.token);
      } else {
        setErrorMessage(data.message || "Invalid OTP"); // ✅ Show in browser
        setOtp(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
      }
    } catch (error) {
      setErrorMessage("OTP verification failed"); // ✅ Show in browser
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    }

    setLoading(false);
  };

  const handleResend = async () => {
    setTimer(60);
    setCanResend(false);
    setOtp(["", "", "", "", "", ""]);
    inputRefs.current[0]?.focus();
    setErrorMessage(""); // Clear error on resend
    try {
      const res = await fetch(
        "http://localhost:5000/api/auth/authority/send-otp",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ authorityId }),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data.message || "Failed to resend OTP");
        return;
      }
      toast.success("OTP resent successfully!");
    } catch (err) {
      setErrorMessage("Failed to resend OTP");
    }

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <MessageSquare className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">
          Verify OTP
        </h2>
        <p className="text-center text-gray-600 mb-6">
          Enter the 6-digit code sent to
          <br />
          <span className="font-medium">+91 {phone}</span>
        </p>

        <div className="flex gap-2 justify-center mb-2">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-12 h-14 text-center text-xl font-bold border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
            />
          ))}
        </div>

        {/* ✅ Display error in browser */}
        {errorMessage && (
          <p className="text-center text-red-600 mb-4 font-medium">{errorMessage}</p>
        )}

        <div className="text-center mb-6">
          {canResend ? (
            <button
              onClick={handleResend}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Resend OTP
            </button>
          ) : (
            <p className="text-gray-600">
              Resend OTP in{" "}
              <span className="font-medium text-blue-600">{timer}s</span>
            </p>
          )}
        </div>

        <button
          onClick={handleVerify}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>
      </div>
    </div>
  );
}
