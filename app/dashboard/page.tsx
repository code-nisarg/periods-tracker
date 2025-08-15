"use client"

import { useState, useEffect } from "react"
import { Droplets, Sun, Moon, Flower2, Sparkles, Activity, Heart } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import SymptomTracker from "@/components/symptom-tracker"

export default function Dashboard() {
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

  const handleSymptomsUpdate = (symptoms: any) => {
    try {
      localStorage.setItem("currentSymptoms", JSON.stringify(symptoms))
      setCurrentSymptoms(symptoms)

      const today = new Date().toISOString().split("T")[0]
      const newHistoryEntry = { date: today, symptoms }

      const updatedHistory = [...symptomHistory.filter((entry) => entry.date !== today), newHistoryEntry]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 30)

      setSymptomHistory(updatedHistory)
      localStorage.setItem("symptomHistory", JSON.stringify(updatedHistory))
    } catch (error) {
      console.error("Error saving symptoms:", error)
    }
  }

  return (
    <div className="bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 min-h-screen border-0">
      <section className="px-4 py-8 sm:px-6 lg:px-8 border-0">
        <div className="mx-auto max-w-6xl border-0">
          <div className="mb-12 text-center">
            <h1 className="mb-4 text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              Health Dashboard
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Track your symptoms and explore your menstrual cycle phases for better health awareness.
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

          <Tabs defaultValue="symptoms" className="w-full border-0 outline-0 ring-0">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
              <TabsTrigger value="symptoms" className="flex items-center gap-2" disabled={!cycleData}>
                <Activity className="h-4 w-4" />
                Symptoms
              </TabsTrigger>
              <TabsTrigger value="phases" className="flex items-center gap-2" disabled={!cycleData}>
                <Sparkles className="h-4 w-4" />
                Phases
              </TabsTrigger>
            </TabsList>

            <TabsContent value="symptoms" className="space-y-6">
              <SymptomTracker onSymptomsUpdate={handleSymptomsUpdate} currentSymptoms={currentSymptoms} />
            </TabsContent>

            <TabsContent value="phases" className="space-y-8 border-0 outline-0 ring-0">
              <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-4 auto-rows-fr border-0 outline-0 ring-0 shadow-none">
                {cycleData?.phases.map((phase: any, index: number) => (
                  <Card
                    key={phase.name}
                    className={`transition-all duration-300 hover:scale-105 !border-0 !outline-0 !ring-0 shadow-lg hover:shadow-xl min-h-[280px] flex flex-col focus:outline-none focus:ring-0 focus:border-0 active:outline-none active:ring-0 active:border-0 ${
                      phase.name === cycleData.currentPhase?.name
                        ? "bg-gradient-to-br from-pink-50 to-purple-50"
                        : "bg-white hover:bg-gradient-to-br hover:from-pink-25 hover:to-purple-25"
                    }`}
                    style={{
                      border: "none",
                      outline: "none",
                      boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
                    }}
                    tabIndex={-1}
                    onFocus={(e) => e.preventDefault()}
                    onBlur={(e) => e.preventDefault()}
                  >
                    <CardHeader className="text-center pb-4 flex-shrink-0 border-0 outline-0 ring-0">
                      <div
                        className={`mx-auto mb-4 rounded-full p-4 ${
                          phase.name === "Menstrual"
                            ? "bg-gradient-to-br from-rose-100 to-pink-100"
                            : phase.name === "Follicular"
                              ? "bg-gradient-to-br from-emerald-100 to-green-100"
                              : phase.name === "Ovulation"
                                ? "bg-gradient-to-br from-amber-100 to-yellow-100"
                                : "bg-gradient-to-br from-purple-100 to-violet-100"
                        }`}
                      >
                        {phase.icon && (
                          <phase.icon
                            className={`h-7 w-7 ${
                              phase.name === "Menstrual"
                                ? "text-rose-600"
                                : phase.name === "Follicular"
                                  ? "text-emerald-600"
                                  : phase.name === "Ovulation"
                                    ? "text-amber-600"
                                    : "text-purple-600"
                            }`}
                          />
                        )}
                      </div>
                      <CardTitle className="text-xl font-bold text-gray-800 mb-2">{phase.name}</CardTitle>
                      <CardDescription className="text-sm font-medium text-gray-500">
                        Days {phase.days[0]}-{phase.days[phase.days.length - 1]}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-2 flex-grow flex items-center border-0 outline-0 ring-0">
                      <p className="text-sm text-gray-600 leading-relaxed text-center w-full">{phase.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {cycleData && (
                <div className="mt-20 flex justify-center border-0 outline-0 ring-0">
                  <Card
                    className="w-full max-w-lg bg-gradient-to-br from-pink-50 via-purple-50 to-rose-50 !border-0 !outline-0 !ring-0 shadow-xl"
                    style={{ border: "none", outline: "none" }}
                  >
                    <CardHeader className="text-center pb-4">
                      <CardTitle className="flex items-center justify-center gap-3 text-2xl font-bold">
                        <div className="p-2 bg-gradient-to-br from-pink-100 to-purple-100 rounded-full">
                          <Sparkles className="h-6 w-6 text-purple-600" />
                        </div>
                        <span className="bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                          Next Period Prediction
                        </span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-center space-y-4">
                      <div className="p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-pink-100">
                        <p className="text-2xl font-bold text-gray-800 mb-2">
                          {cycleData.nextPeriod.toLocaleDateString("en-US", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          Based on a 28-day cycle. Remember, every body is unique and cycles can vary!
                        </p>
                      </div>

                      <div className="flex items-center gap-2 justify-center text-xs text-purple-600 bg-purple-50 px-4 py-2 rounded-full">
                        <Heart className="h-3 w-3" />
                        <span>Track consistently for more accurate predictions</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  )
}
