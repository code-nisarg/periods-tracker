"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Droplets, Flower2, Sun, Moon, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface CycleCalendarProps {
  lastPeriodDate: string
  cycleData: any
  onDateSelect: (date: string) => void
}

export default function CycleCalendar({ lastPeriodDate, cycleData, onDateSelect }: CycleCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [pendingDate, setPendingDate] = useState<string | null>(null)

  const phases = [
    {
      name: "Menstrual",
      days: [1, 2, 3, 4, 5],
      icon: Droplets,
      color: "bg-rose-100 border-rose-200 text-rose-700",
      bgColor: "bg-rose-50",
    },
    {
      name: "Follicular",
      days: [6, 7, 8, 9, 10, 11, 12, 13],
      icon: Flower2,
      color: "bg-emerald-100 border-emerald-200 text-emerald-700",
      bgColor: "bg-emerald-50",
    },
    {
      name: "Ovulation",
      days: [14, 15, 16],
      icon: Sun,
      color: "bg-amber-100 border-amber-200 text-amber-700",
      bgColor: "bg-amber-50",
    },
    {
      name: "Luteal",
      days: [17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28],
      icon: Moon,
      color: "bg-purple-100 border-purple-200 text-purple-700",
      bgColor: "bg-purple-50",
    },
  ]

  const getPhaseForDay = (cycleDay: number) => {
    return phases.find((phase) => phase.days.includes(cycleDay))
  }

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const getCycleDayForDate = (date: Date) => {
    if (!lastPeriodDate) return null
    const periodStart = new Date(lastPeriodDate)
    const daysDiff = Math.floor((date.getTime() - periodStart.getTime()) / (1000 * 60 * 60 * 24))
    return (((daysDiff % 28) + 28) % 28) + 1
  }

  const isDateInCurrentCycle = (date: Date) => {
    if (!lastPeriodDate) return false
    const periodStart = new Date(lastPeriodDate)
    const daysDiff = Math.floor((date.getTime() - periodStart.getTime()) / (1000 * 60 * 60 * 24))
    return daysDiff >= 0
  }

  const handleDateClick = (date: Date) => {
    const dateString = date.toISOString().split("T")[0]
    setPendingDate(dateString)
  }

  const handleSaveDate = () => {
    if (pendingDate) {
      onDateSelect(pendingDate)
      setPendingDate(null)
    }
  }

  const handleCancelSelection = () => {
    setPendingDate(null)
  }

  const navigateMonth = (direction: "prev" | "next") => {
    const newMonth = new Date(currentMonth)
    if (direction === "prev") {
      newMonth.setMonth(newMonth.getMonth() - 1)
    } else {
      newMonth.setMonth(newMonth.getMonth() + 1)
    }
    setCurrentMonth(newMonth)
  }

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth)
    const firstDay = getFirstDayOfMonth(currentMonth)
    const days = []

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-12 w-12" />)
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
      const dateString = date.toISOString().split("T")[0]
      const isInCycle = isDateInCurrentCycle(date)
      const cycleDay = isInCycle ? getCycleDayForDate(date) : null
      const phase = cycleDay ? getPhaseForDay(cycleDay) : null
      const isToday = date.toDateString() === new Date().toDateString()
      const isPeriodStart = lastPeriodDate && dateString === lastPeriodDate
      const isPendingSelection = pendingDate === dateString

      days.push(
        <button
          key={day}
          onClick={() => handleDateClick(date)}
          className={`
            relative h-12 w-12 rounded-lg border-2 transition-all duration-200 hover:scale-105 hover:shadow-md cursor-pointer
            ${isToday ? "ring-2 ring-pink-400 ring-offset-2" : ""}
            ${isPeriodStart ? "ring-2 ring-red-500 ring-offset-2" : ""} 
            ${isPendingSelection ? "ring-2 ring-blue-500 ring-offset-2 bg-blue-100 border-blue-300" : ""}
            ${phase && !isPendingSelection ? phase.color : !isPendingSelection ? "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100" : ""}
            ${!lastPeriodDate && !isPendingSelection ? "hover:bg-pink-50 hover:border-pink-200" : ""}
            ${!isInCycle && lastPeriodDate && !isPendingSelection ? "opacity-50" : ""}
          `}
        >
          <div className="flex h-full w-full items-center justify-center">
            <span className="text-sm font-medium">{day}</span>
          </div>
          {phase && !isPendingSelection && (
            <div className="absolute -bottom-1 -right-1 rounded-full bg-white p-1 shadow-sm">
              <phase.icon className="h-3 w-3" />
            </div>
          )}
          {cycleDay === 1 && !isPendingSelection && (
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 rounded-full bg-red-500 px-2 py-0.5 text-xs text-white">
              Start
            </div>
          )}
          {isPendingSelection && (
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 rounded-full bg-blue-500 px-2 py-0.5 text-xs text-white">
              Selected
            </div>
          )}
        </button>,
      )
    }

    return days
  }

  return (
    <Card className="mx-auto max-w-4xl bg-white/90 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-bold text-gray-900">
            {lastPeriodDate ? "Cycle Calendar" : "Click a date to start tracking"}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => navigateMonth("prev")} className="h-8 w-8 p-0">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="min-w-[140px] text-center font-semibold">
              {currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
            </span>
            <Button variant="outline" size="sm" onClick={() => navigateMonth("next")} className="h-8 w-8 p-0">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {!lastPeriodDate && !pendingDate && (
          <div className="mb-6 rounded-lg bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-200 p-4 text-center">
            <p className="text-pink-700 font-medium">Click on the date when your last period started</p>
            <p className="text-pink-600 text-sm mt-1">You'll be able to confirm before saving</p>
          </div>
        )}

        {lastPeriodDate && (
          <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {phases.map((phase) => (
              <div key={phase.name} className="flex items-center gap-2">
                <div className={`rounded-lg border-2 p-2 ${phase.color}`}>
                  <phase.icon className="h-4 w-4" />
                </div>
                <span className="text-sm font-medium text-gray-700">{phase.name}</span>
              </div>
            ))}
          </div>
        )}

        <div className="space-y-4">
          <div className="grid grid-cols-7 gap-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="text-center text-sm font-semibold text-gray-600">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">{renderCalendarDays()}</div>
        </div>

        {pendingDate && (
          <div className="mt-6 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 p-6 shadow-lg">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-3 w-3 rounded-full bg-blue-500 animate-pulse"></div>
                  <p className="text-blue-800 font-semibold text-lg">
                    {new Date(pendingDate).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <p className="text-blue-600 text-sm ml-6">
                  {lastPeriodDate
                    ? "This will update your period start date and recalculate your cycle"
                    : "This will be set as your period start date to begin tracking"}
                </p>
              </div>
              <div className="flex gap-3 sm:flex-shrink-0">
                <Button
                  onClick={handleSaveDate}
                  size="lg"
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5"
                >
                  <Check className="h-4 w-4 mr-2" />
                  Save Date
                </Button>
                <Button
                  onClick={handleCancelSelection}
                  variant="outline"
                  size="lg"
                  className="border-2 border-red-300 text-red-600 hover:bg-red-50 bg-white shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5"
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 rounded-xl bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-200 p-4">
          <div className="flex items-center gap-4 text-sm text-pink-700 flex-wrap justify-center sm:justify-start">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-pink-400 ring-2 ring-pink-400 ring-offset-2"></div>
              <span className="font-medium">Today</span>
            </div>
            {lastPeriodDate && (
              <div className="flex items-center gap-2">
                <div className="rounded bg-red-500 px-2 py-1 text-xs text-white font-medium">Start</div>
                <span className="font-medium">Period start</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <div className="rounded bg-blue-500 px-2 py-1 text-xs text-white font-medium">Selected</div>
              <span className="font-medium">Pending selection</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
