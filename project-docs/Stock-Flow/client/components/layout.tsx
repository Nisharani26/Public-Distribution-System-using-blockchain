import { ReactNode } from "react"
import { useLocation } from "wouter"
import { ArrowLeft, LogOut } from "lucide-react"

interface LayoutProps {
  title: string
  subtitle?: string
  showBack?: boolean
  showLogout?: boolean
  children: ReactNode
}

export default function Layout({
  title,
  subtitle,
  showBack = false,
  showLogout = false,
  children,
}: LayoutProps) {
  const [, setLocation] = useLocation()

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ===== HEADER ===== */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-4">

          {/* Back Button (NO underline on hover) */}
          {showBack && (
            <button
              onClick={() => window.history.back()}
              className="flex items-center gap-2 text-green-700 font-medium mb-2 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          )}

          <div className="flex items-center justify-between">
            <div>
              {/* Hindi Title – NORMAL */}
              <h1 className="text-xl md:text-2xl font-normal text-green-800">
                {title}
              </h1>

              {/* English Subtitle */}
              {subtitle && (
                <p className="text-sm md:text-base text-slate-500">
                  {subtitle}
                </p>
              )}
            </div>

            {/* Logout Button */}
            {showLogout && (
              <button
                onClick={() => setLocation("/")}
                className="flex items-center gap-2 px-4 py-2 rounded-full
                           bg-red-50 text-red-600 hover:bg-red-100
                           transition font-medium"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            )}
          </div>
        </div>
      </header>

      {/* ===== PAGE CONTENT ===== */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  )
}


