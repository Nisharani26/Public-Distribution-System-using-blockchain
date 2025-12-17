import { useState } from "react"
import { useLocation } from "wouter"
import { Store, Lock, Info, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function ResetPin() {
  const [, setLocation] = useLocation()
  const [newPin, setNewPin] = useState("")
  const [confirmPin, setConfirmPin] = useState("")
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)

  const isValid =
    newPin.length === 4 &&
    confirmPin.length === 4 &&
    newPin === confirmPin &&
    /^\d+$/.test(newPin)

  const handlePinChange =
    (setter: (val: string) => void) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value
      if (/^\d*$/.test(val) && val.length <= 4) {
        setter(val)
      }
    }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isValid) setShowSuccessDialog(true)
  }

  const handleSuccessDismiss = () => {
    setShowSuccessDialog(false)
    setLocation("/")
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg border-0">
        <CardContent className="pt-10 pb-8 px-8">
          <div className="flex flex-col items-center mb-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <Store className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-slate-800">
              Reset PIN
            </h1>
            <p className="text-green-700 font-medium">
              Create New PIN
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex gap-3">
            <Info className="w-5 h-5 text-blue-600 mt-0.5" />
            <p className="text-sm text-blue-800">
              Note: The PIN must be changed every 90 days from the
              date of signup for security purposes.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label>New PIN / नया पिन</Label>
              <div className="relative mt-2">
                <Lock className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
                <Input
                  type="password"
                  inputMode="numeric"
                  className="pl-10 h-12 font-mono tracking-widest"
                  value={newPin}
                  onChange={handlePinChange(setNewPin)}
                  maxLength={4}
                />
              </div>
            </div>

            <div>
              <Label>Confirm PIN / पिन की पुष्टि करें</Label>
              <div className="relative mt-2">
                <Lock className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
                <Input
                  type="password"
                  inputMode="numeric"
                  className="pl-10 h-12 font-mono tracking-widest"
                  value={confirmPin}
                  onChange={handlePinChange(setConfirmPin)}
                  maxLength={4}
                />
              </div>
              {newPin && confirmPin && newPin !== confirmPin && (
                <p className="text-red-500 text-sm mt-1">
                  PINs do not match
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={!isValid}
              className="w-full h-12 bg-green-600 hover:bg-green-700 text-white"
            >
              Reset PIN / पिन रीसेट करें
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* ✅ SUCCESS DIALOG */}
      <AlertDialog
        open={showSuccessDialog}
        onOpenChange={setShowSuccessDialog}
      >
        <AlertDialogContent className="max-w-sm">
          <AlertDialogHeader>
            <div className="mx-auto mb-3 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
            <AlertDialogTitle>
              PIN Changed Successfully!
            </AlertDialogTitle>
            <AlertDialogDescription>
              Your PIN has been updated securely. A confirmation
              has been sent to your registered email/mobile.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter className="mt-6">
            <AlertDialogAction
              onClick={handleSuccessDismiss}
              className="w-full"
            >
              Go to Login
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
