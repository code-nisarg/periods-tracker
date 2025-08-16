"use client"

import { useState, useEffect } from "react"
import { Droplets, Sun, Moon, Flower2, Calendar, Brain, Lightbulb } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import CycleCalendar from "@/components/cycle-calendar"
import CycleInsights from "@/components/cycle-insights"
import DailyWellnessTips from "@/components/daily-wellness-tips"

export default function TrackingPage() {
  const [lastPeriodDate, setLastPeriodDate] = useState("")
  const [cycleData, setCycleData] = useState<any>(null)
  const [currentSymptoms, setCurrentSymptoms] = useState<any>({})
  const [symptomHistory, setSymptomHistory] = useState<any[]>([])

  useEffect(() => {
    const loadLocalData = () => {
      try {
        const savedPeriodDate = localStorage.getItem("lastPeriodDate")
        const savedSymptoms = localStorage.getItem("currentSymptoms")
        const savedHistory = localStorage.getItem("symptomHistory")

        if (savedPeriodDate) {
          setLastPeriodDate(savedPeriodDate)
          const data = calculateCycle(savedPeriodDate)
          setCycleData(data)
        }

        if (savedSymptoms) {
          setCurrentSymptoms(JSON.parse(savedSymptoms))
        }

        if (savedHistory) {
          setSymptomHistory(JSON.parse(savedHistory))
        }
      } catch (error) {
        console.error("Error loading local data:", error)
      }
    }

    loadLocalData()
  }, [])

  const calculateCycle = (startDate: string) => {
    const start = new Date(startDate)
    const today = new Date()
    const daysSinceStart = Math.floor((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))

    if (daysSinceStart < 0) {
      const cycleDay = 1
      const currentPhase = {
        name: "Menstrual",
        days: [1, 2, 3, 4, 5],
        icon: Droplets,
        color: "bg-red-100 text-red-600",
        description: "Your period days. Rest and be gentle with yourself.",
      }

      return {
        cycleDay,
        currentPhase,
        phases: [
          {
            name: "Menstrual",
            days: [1, 2, 3, 4, 5],
            icon: Droplets,
            color: "bg-red-100 text-red-600",
            description: "Your period days. Rest and be gentle with yourself.",
          },
          {
            name: "Follicular",
            days: [6, 7, 8, 9, 10, 11, 12, 13],
            icon: Flower2,
            color: "bg-green-100 text-green-600",
            description: "Energy building phase. Great time for new projects!",
          },
          {
            name: "Ovulation",
            days: [14, 15, 16],
            icon: Sun,
            color: "bg-yellow-100 text-yellow-600",
            description: "Peak fertility window. You might feel most confident!",
          },
          {
            name: "Luteal",
            days: [17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28],
            icon: Moon,
            color: "bg-purple-100 text-purple-600",
            description: "Winding down phase. Perfect time for reflection and self-care.",
          },
        ],
        nextPeriod: new Date(today.getTime() + 28 * 24 * 60 * 60 * 1000),
      }
    }

    const phases = [
      {
        name: "Menstrual",
        days: [1, 2, 3, 4, 5],
        icon: Droplets,
        color: "bg-red-100 text-red-600",
        description: "Your period days. Rest and be gentle with yourself.",
      },
      {
        name: "Follicular",
        days: [6, 7, 8, 9, 10, 11, 12, 13],
        icon: Flower2,
        color: "bg-green-100 text-green-600",
        description: "Energy building phase. Great time for new projects!",
      },
      {
        name: "Ovulation",
        days: [14, 15, 16],
        icon: Sun,
        color: "bg-yellow-100 text-yellow-600",
        description: "Peak fertility window. You might feel most confident!",
      },
      {
        name: "Luteal",
        days: [17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28],
        icon: Moon,
        color: "bg-purple-100 text-purple-600",
        description: "Winding down phase. Perfect time for reflection and self-care.",
      },
    ]

    let cycleDay = (daysSinceStart % 28) + 1
    if (cycleDay <= 0) cycleDay += 28

    let currentPhase = phases.find((phase) => phase.days.includes(cycleDay))

    if (!currentPhase) {
      currentPhase = phases[0]
    }

    const cyclesCompleted = Math.floor(daysSinceStart / 28)
    const nextPeriodDate = new Date(start.getTime() + (cyclesCompleted + 1) * 28 * 24 * 60 * 60 * 1000)

    return {
      cycleDay,
      currentPhase,
      phases,
      nextPeriod: nextPeriodDate,
    }
  }

  const handleDateSelect = (date: string) => {
    try {
      localStorage.setItem("lastPeriodDate", date)
      setLastPeriodDate(date)
      const data = calculateCycle(date)
      setCycleData(data)
    } catch (error) {
      console.error("Error saving period:", error)
    }
  }

  return (
    <div className="bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 min-h-screen">
      <section className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h1 className="mb-4 text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              Cycle Tracking & Insights
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Track your menstrual cycle, get personalized insights, and discover wellness tips tailored to your current
              phase.
            </p>
          </div>

          {cycleData && (
            <div className="mb-12 text-center">
              <h2 className="mb-6 text-3xl font-bold text-gray-900">Cycle Progress</h2>
              <div className="mx-auto max-w-4xl">
                <div className="grid md:grid-cols-3 gap-6">
                  {/* Current Phase Card */}
                  <div className="md:col-span-2 bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                    <div className="flex items-center gap-4 mb-4">
                      {cycleData.currentPhase && (
                        <>
                          <div
                            className={`rounded-full p-3 ${
                              cycleData.currentPhase.name === "Menstrual"
                                ? "bg-gradient-to-br from-rose-100 to-pink-100"
                                : cycleData.currentPhase.name === "Follicular"
                                  ? "bg-gradient-to-br from-emerald-100 to-green-100"
                                  : cycleData.currentPhase.name === "Ovulation"
                                    ? "bg-gradient-to-br from-amber-100 to-yellow-100"
                                    : "bg-gradient-to-br from-purple-100 to-violet-100"
                            }`}
                          >
                            {cycleData.currentPhase.icon && (
                              <cycleData.currentPhase.icon
                                className={`h-6 w-6 ${
                                  cycleData.currentPhase.name === "Menstrual"
                                    ? "text-rose-600"
                                    : cycleData.currentPhase.name === "Follicular"
                                      ? "text-emerald-600"
                                      : cycleData.currentPhase.name === "Ovulation"
                                        ? "text-amber-600"
                                        : "text-purple-600"
                                }`}
                              />
                            )}
                          </div>
                          <div className="flex-1 text-left">
                            <h3 className="text-xl font-bold text-gray-900">{cycleData.currentPhase.name}</h3>
                            <p className="text-sm text-gray-600">
                              Days {cycleData.currentPhase.days[0]}-
                              {cycleData.currentPhase.days[cycleData.currentPhase.days.length - 1]}
                            </p>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span>Cycle Progress</span>
                        <span>{Math.round((cycleData.cycleDay / 28) * 100)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-pink-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${(cycleData.cycleDay / 28) * 100}%` }}
                        ></div>
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm">{cycleData.currentPhase?.description}</p>
                  </div>

                  {/* Stats Card */}
                  <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl p-6 shadow-lg border border-pink-100">
                    <h4 className="font-semibold text-gray-800 mb-4">Cycle Stats</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Current Day</span>
                        <span className="font-semibold text-gray-800">{cycleData.cycleDay}/28</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Phase</span>
                        <span className="font-semibold text-gray-800">{cycleData.currentPhase?.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Next Period</span>
                        <span className="font-semibold text-gray-800">
                          {Math.ceil((cycleData.nextPeriod.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))}{" "}
                          days
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <Tabs defaultValue="calendar" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="calendar" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Calendar
              </TabsTrigger>
              <TabsTrigger value="insights" className="flex items-center gap-2" disabled={!cycleData}>
                <Brain className="h-4 w-4" />
                Insights
              </TabsTrigger>
              <TabsTrigger value="tips" className="flex items-center gap-2">
                <Lightbulb className="h-4 w-4" />
                Wellness Tips
              </TabsTrigger>
            </TabsList>

            <TabsContent value="calendar" className="space-y-6">
              <CycleCalendar lastPeriodDate={lastPeriodDate} cycleData={cycleData} onDateSelect={handleDateSelect} />
            </TabsContent>

            <TabsContent value="insights" className="space-y-6">
              <CycleInsights cycleData={cycleData} symptomHistory={symptomHistory} />
            </TabsContent>

            <TabsContent value="tips" className="space-y-6">
              <DailyWellnessTips currentPhase={cycleData?.currentPhase} currentSymptoms={currentSymptoms} />
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  )
}
