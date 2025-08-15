"use client"

import { useEffect } from "react"
import { Heart, Flower2, Sparkles, ArrowRight, TrendingUp } from "lucide-react"
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts"
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
  useEffect(() => {
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
                  <Link href="/dashboard">
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
                  <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-pink-100">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-gray-800">Cycle Analytics</h3>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <TrendingUp className="h-4 w-4 text-pink-500" />
                        Live Preview
                      </div>
                    </div>

                    {/* Interactive chart */}
                    <div className="h-64 mb-6">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={cycleData}>
                          <defs>
                            <linearGradient id="energyGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#ec4899" stopOpacity={0.3} />
                              <stop offset="95%" stopColor="#ec4899" stopOpacity={0.1} />
                            </linearGradient>
                            <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                          <XAxis
                            dataKey="day"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: "#64748b" }}
                          />
                          <YAxis
                            domain={[0, 10]}
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: "#64748b" }}
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "white",
                              border: "1px solid #f1f5f9",
                              borderRadius: "12px",
                              boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                            }}
                            labelStyle={{ color: "#374151", fontWeight: "bold" }}
                          />
                          <Area
                            type="monotone"
                            dataKey="energy"
                            stroke="#ec4899"
                            strokeWidth={2}
                            fill="url(#energyGradient)"
                            name="Energy Level"
                          />
                          <Area
                            type="monotone"
                            dataKey="mood"
                            stroke="#8b5cf6"
                            strokeWidth={2}
                            fill="url(#moodGradient)"
                            name="Mood"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Chart legend and insights */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-pink-500 rounded-full"></div>
                          <span className="text-gray-600">Energy Level</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                          <span className="text-gray-600">Mood</span>
                        </div>
                      </div>

                      {/* Phase indicators */}
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div className="flex items-center gap-2 p-2 bg-red-50 rounded-lg">
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          <span className="text-gray-700">Menstrual (1-5)</span>
                        </div>
                        <div className="flex items-center gap-2 p-2 bg-green-50 rounded-lg">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-gray-700">Follicular (6-13)</span>
                        </div>
                        <div className="flex items-center gap-2 p-2 bg-yellow-50 rounded-lg">
                          <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                          <span className="text-gray-700">Ovulation (14-16)</span>
                        </div>
                        <div className="flex items-center gap-2 p-2 bg-purple-50 rounded-lg">
                          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                          <span className="text-gray-700">Luteal (17-28)</span>
                        </div>
                      </div>

                      {/* Key insight */}
                      <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-3 rounded-lg border border-pink-100">
                        <p className="text-sm text-gray-700 font-medium">
                          Peak energy and mood typically occur during ovulation phase
                        </p>
                      </div>
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
