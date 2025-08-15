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
              <h2 className="mb-6 text-3xl font-bold text-gray-900">Your Current Phase</h2>
              <div className="mx-auto flex max-w-sm items-center justify-center gap-4 rounded-2xl bg-white p-6 shadow-lg border border-gray-100">
                {cycleData.currentPhase && (
                  <>
                    <div className={`rounded-full p-3 ${cycleData.currentPhase.color}`}>
                      {cycleData.currentPhase.icon && <cycleData.currentPhase.icon className="h-6 w-6" />}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{cycleData.currentPhase.name}</h3>
                      <p className="text-sm text-gray-600">Day {cycleData.cycleDay} of 28</p>
                    </div>
                  </>
                )}
              </div>
              {cycleData.currentPhase && (
                <p className="mt-4 text-gray-600 max-w-md mx-auto">{cycleData.currentPhase.description}</p>
              )}
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
