"use client"

import { useEffect, useState } from "react"
import { Heart, Flower2, Sparkles, ArrowRight, Calendar, Clock } from "lucide-react"
import Link from "next/link"

// Sample cycle data for demonstration
const cycleData = [
  { day: 1, phase: "Menstrual", energy: 2, mood: 2, symptoms: 4 },
  { day: 3, phase: "Menstrual", energy: 3, mood: 3, symptoms: 3 },
  { day: 6, phase: "Follicular", energy: 5, mood: 6, symptoms: 1 },
  { day: 9, phase: "Follicular", energy: 7, mood: 7, symptoms: 1 },
  { day: 12, phase: "Follicular", energy: 8, mood: 8, symptoms: 0 },
  { day: 14, phase: "Ovulation", energy: 9, mood: 9, symptoms: 1 },
  { day: 16, phase: "Ovulation", energy: 8, mood: 8, symptoms: 2 },
  { day: 18, phase: "Luteal", energy: 6, mood: 6, symptoms: 2 },
  { day: 21, phase: "Luteal", energy: 4, mood: 4, symptoms: 3 },
  { day: 24, phase: "Luteal", energy: 3, mood: 3, symptoms: 4 },
  { day: 27, phase: "Luteal", energy: 2, mood: 2, symptoms: 5 },
  { day: 28, phase: "Pre-Menstrual", energy: 2, mood: 2, symptoms: 5 },
]

export default function HomePage() {
  const [lastPeriodDate, setLastPeriodDate] = useState<string | null>(null)
  const [daysUntilNext, setDaysUntilNext] = useState<number>(0)
  const [currentPhase, setCurrentPhase] = useState<string>("Unknown")

  useEffect(() => {
    const storedDate = localStorage.getItem("lastPeriodDate")
    if (storedDate) {
      setLastPeriodDate(storedDate)
      const lastDate = new Date(storedDate)
      const today = new Date()
      const daysSinceLast = Math.floor((today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24))
      const cycleLength = 28 // Average cycle length
      const daysUntil = cycleLength - daysSinceLast

      setDaysUntilNext(daysUntil > 0 ? daysUntil : 0)

      // Determine current phase
      if (daysSinceLast <= 5) {
        setCurrentPhase("Menstrual")
      } else if (daysSinceLast <= 13) {
        setCurrentPhase("Follicular")
      } else if (daysSinceLast <= 16) {
        setCurrentPhase("Ovulation")
      } else {
        setCurrentPhase("Luteal")
      }
    }

    const initLenis = async () => {
      const Lenis = (await import("@studio-freight/lenis")).default
      const lenis = new Lenis({
        duration: 1.6,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 2,
        normalizeWheel: true,
      })

      document.documentElement.classList.add("lenis")

      function raf(time: number) {
        lenis.raf(time)
        requestAnimationFrame(raf)
      }
      requestAnimationFrame(raf)

      return () => {
        lenis.destroy()
        document.documentElement.classList.remove("lenis")
      }
    }

    const cleanup = initLenis()

    return () => {
      cleanup.then((cleanupFn) => cleanupFn?.())
    }
  }, [])

  return (
    <div className="bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32 min-h-screen flex items-center">
        {/* Background elements */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-pink-100/40 via-purple-100/30 to-rose-100/40" />
          <div className="absolute top-20 left-20 w-32 h-32 bg-pink-200/20 rounded-full blur-2xl animate-pulse" />
          <div className="absolute bottom-32 right-32 w-40 h-40 bg-purple-200/25 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-rose-200/15 rounded-full blur-xl animate-pulse delay-500" />

          {/* Floating decorative shapes */}
          <div className="absolute top-32 right-1/4 animate-float">
            <Heart className="h-8 w-8 text-pink-300/60" />
          </div>
          <div className="absolute bottom-1/3 left-1/3 animate-float delay-1000">
            <Flower2 className="h-6 w-6 text-purple-300/60" />
          </div>
          <div className="absolute top-1/3 right-1/3 animate-float delay-500">
            <Sparkles className="h-7 w-7 text-rose-300/60" />
          </div>

          {/* Wave pattern at bottom */}
          <div className="absolute bottom-0 left-0 right-0 opacity-20">
            <svg viewBox="0 0 1200 120" className="w-full h-24 text-pink-300">
              <path d="M0,60 C300,120 900,0 1200,60 L1200,120 L0,120 Z" fill="currentColor" />
            </svg>
          </div>
        </div>

        <div className="relative w-full px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Left content */}
              <div className="text-center lg:text-left space-y-8">
                <div className="space-y-6">
                  <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-50 to-purple-50 backdrop-blur-sm rounded-full shadow-sm border border-pink-200/50">
                    <Heart className="h-4 w-4 text-pink-500" />
                    <span className="text-sm font-medium bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                      Your wellness journey starts here
                    </span>
                  </div>

                  <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-gray-900 leading-tight">
                    Your Cycle,{" "}
                    <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-rose-500 bg-clip-text text-transparent">
                      Your Power
                    </span>
                  </h1>

                  <p className="text-xl lg:text-2xl text-gray-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                    Track your menstrual cycle with love, understanding, and scientific precision. Embrace every phase
                    of your beautiful, natural rhythm.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Link href="/tracking">
                    <button className="px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold rounded-full shadow-lg hover:shadow-2xl transform hover:-translate-y-1 hover:scale-105 transition-all duration-300 flex items-center gap-2">
                      Start Tracking Today
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </Link>
                  <button className="px-8 py-4 bg-white/80 backdrop-blur-sm text-gray-700 font-semibold rounded-full shadow-lg hover:shadow-2xl border border-pink-100 hover:bg-white transform hover:-translate-y-1 hover:scale-105 transition-all duration-300 hover:border-pink-200">
                    Learn More
                  </button>
                </div>

                {/* Stats or features */}
                <div className="grid grid-cols-3 gap-8 pt-8 border-t border-pink-100/50">
                  <div className="text-center lg:text-left">
                    <div className="text-2xl font-bold text-gray-900">28</div>
                    <div className="text-sm text-gray-600">Average cycle days</div>
                  </div>
                  <div className="text-center lg:text-left">
                    <div className="text-2xl font-bold text-gray-900">4</div>
                    <div className="text-sm text-gray-600">Cycle phases</div>
                  </div>
                  <div className="text-center lg:text-left">
                    <div className="text-2xl font-bold text-gray-900">∞</div>
                    <div className="text-sm text-gray-600">Your uniqueness</div>
                  </div>
                </div>
              </div>

              {/* Enhanced right side with interactive chart */}
              <div className="relative lg:h-[600px] flex items-center justify-center">
                <div className="relative w-full max-w-lg">
                  {/* Interactive cycle tracking chart */}
                  <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 lg:p-8 shadow-2xl border border-pink-100">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg lg:text-xl font-bold text-gray-800">Your Cycle Status</h3>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Calendar className="h-4 w-4 text-pink-500" />
                        <span className="hidden sm:inline">Live Tracking</span>
                      </div>
                    </div>

                    {lastPeriodDate ? (
                      <div className="space-y-6">
                        {/* Period countdown */}
                        <div className="text-center p-6 bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl border border-pink-100">
                          <div className="flex items-center justify-center gap-2 mb-2">
                            <Clock className="h-5 w-5 text-pink-500" />
                            <span className="text-sm font-medium text-gray-600">Next Period In</span>
                          </div>
                          <div className="text-4xl lg:text-5xl font-bold text-gray-900 mb-1">{daysUntilNext}</div>
                          <div className="text-sm text-gray-600">{daysUntilNext === 1 ? "day" : "days"}</div>
                        </div>

                        {/* Current phase */}
                        <div className="text-center p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
                          <div className="text-sm font-medium text-gray-600 mb-1">Current Phase</div>
                          <div className="text-2xl font-bold text-gray-900 mb-2">{currentPhase}</div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-pink-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                              style={{
                                width:
                                  currentPhase === "Menstrual"
                                    ? "25%"
                                    : currentPhase === "Follicular"
                                      ? "50%"
                                      : currentPhase === "Ovulation"
                                        ? "75%"
                                        : "100%",
                              }}
                            ></div>
                          </div>
                        </div>

                        {/* Quick actions */}
                        <div className="grid grid-cols-2 gap-3">
                          <Link href="/dashboard" className="block">
                            <button className="w-full p-3 bg-pink-500 text-white font-medium rounded-xl hover:bg-pink-600 transition-colors duration-200 text-sm">
                              Log Symptoms
                            </button>
                          </Link>
                          <Link href="/tracking" className="block">
                            <button className="w-full p-3 bg-purple-500 text-white font-medium rounded-xl hover:bg-purple-600 transition-colors duration-200 text-sm">
                              View Calendar
                            </button>
                          </Link>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <h4 className="text-lg font-semibold text-gray-700 mb-2">Start Your Journey</h4>
                        <p className="text-gray-600 mb-6 text-sm">
                          Track your first period to get personalized insights and predictions.
                        </p>
                        <Link href="/tracking">
                          <button className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-medium rounded-xl hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200">
                            Get Started
                          </button>
                        </Link>
                      </div>
                    )}

                    {/* Health tip */}
                    <div className="mt-6 bg-gradient-to-r from-pink-50 to-purple-50 p-4 rounded-xl border border-pink-100">
                      <p className="text-xs sm:text-sm text-gray-700 font-medium text-center">
                        💡 Stay hydrated and listen to your body during each phase
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
