"use client"

import { useState, useEffect } from "react"
import { Heart, Smile, Meh, Frown, Zap, Battery, BatteryLow, Target, CheckCircle2, Calendar, Flame } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

interface DailyCheckIn {
  date: string
  mood: number
  energy: number
  goals: string[]
  completedGoals: string[]
  notes: string
  streak: number
}

export default function DailyCheckIn() {
  const [todayCheckIn, setTodayCheckIn] = useState<DailyCheckIn | null>(null)
  const [checkInHistory, setCheckInHistory] = useState<DailyCheckIn[]>([])
  const [currentStreak, setCurrentStreak] = useState(0)
  const [hasCheckedInToday, setHasCheckedInToday] = useState(false)

  const today = new Date().toISOString().split("T")[0]

  const moodOptions = [
    { value: 1, icon: Frown, label: "Low", color: "text-red-500" },
    { value: 2, icon: Meh, label: "Okay", color: "text-yellow-500" },
    { value: 3, icon: Smile, label: "Good", color: "text-green-500" },
    { value: 4, icon: Heart, label: "Great", color: "text-pink-500" },
  ]

  const energyOptions = [
    { value: 1, icon: BatteryLow, label: "Low", color: "text-red-500" },
    { value: 2, icon: Battery, label: "Medium", color: "text-yellow-500" },
    { value: 3, icon: Zap, label: "High", color: "text-green-500" },
  ]

  const dailyGoals = [
    "Drink 8 glasses of water",
    "Take a 10-minute walk",
    "Practice deep breathing",
    "Eat a healthy meal",
    "Get 7+ hours of sleep",
    "Take vitamins/supplements",
    "Practice gratitude",
    "Do gentle stretching",
  ]

  useEffect(() => {
    loadCheckInData()
  }, [])

  const loadCheckInData = () => {
    try {
      const savedHistory = localStorage.getItem("dailyCheckInHistory")
      const savedStreak = localStorage.getItem("dailyStreak")

      if (savedHistory) {
        const history = JSON.parse(savedHistory)
        setCheckInHistory(history)

        const todayEntry = history.find((entry: DailyCheckIn) => entry.date === today)
        if (todayEntry) {
          setTodayCheckIn(todayEntry)
          setHasCheckedInToday(true)
        }
      }

      if (savedStreak) {
        setCurrentStreak(Number.parseInt(savedStreak))
      }
    } catch (error) {
      console.error("Error loading check-in data:", error)
    }
  }

  const saveCheckIn = (checkIn: DailyCheckIn) => {
    try {
      const updatedHistory = [...checkInHistory.filter((entry) => entry.date !== today), checkIn].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      )

      setCheckInHistory(updatedHistory)
      localStorage.setItem("dailyCheckInHistory", JSON.stringify(updatedHistory))

      // Calculate streak
      const newStreak = calculateStreak(updatedHistory)
      setCurrentStreak(newStreak)
      localStorage.setItem("dailyStreak", newStreak.toString())
    } catch (error) {
      console.error("Error saving check-in:", error)
    }
  }

  const calculateStreak = (history: DailyCheckIn[]) => {
    let streak = 0
    const sortedHistory = history.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    for (let i = 0; i < sortedHistory.length; i++) {
      const checkDate = new Date(sortedHistory[i].date)
      const expectedDate = new Date()
      expectedDate.setDate(expectedDate.getDate() - i)

      if (checkDate.toDateString() === expectedDate.toDateString()) {
        streak++
      } else {
        break
      }
    }

    return streak
  }

  const handleMoodSelect = (mood: number) => {
    const newCheckIn = {
      ...todayCheckIn,
      date: today,
      mood,
      energy: todayCheckIn?.energy || 0,
      goals: todayCheckIn?.goals || [],
      completedGoals: todayCheckIn?.completedGoals || [],
      notes: todayCheckIn?.notes || "",
      streak: currentStreak,
    }
    setTodayCheckIn(newCheckIn)
  }

  const handleEnergySelect = (energy: number) => {
    const newCheckIn = {
      ...todayCheckIn,
      date: today,
      mood: todayCheckIn?.mood || 0,
      energy,
      goals: todayCheckIn?.goals || [],
      completedGoals: todayCheckIn?.completedGoals || [],
      notes: todayCheckIn?.notes || "",
      streak: currentStreak,
    }
    setTodayCheckIn(newCheckIn)
  }

  const toggleGoal = (goal: string) => {
    if (!todayCheckIn) return

    const isCompleted = todayCheckIn.completedGoals.includes(goal)
    const newCompletedGoals = isCompleted
      ? todayCheckIn.completedGoals.filter((g) => g !== goal)
      : [...todayCheckIn.completedGoals, goal]

    const newCheckIn = {
      ...todayCheckIn,
      completedGoals: newCompletedGoals,
    }
    setTodayCheckIn(newCheckIn)
  }

  const handleNotesChange = (notes: string) => {
    if (!todayCheckIn) return

    const newCheckIn = {
      ...todayCheckIn,
      notes,
    }
    setTodayCheckIn(newCheckIn)
  }

  const submitCheckIn = () => {
    if (!todayCheckIn || todayCheckIn.mood === 0 || todayCheckIn.energy === 0) return

    saveCheckIn(todayCheckIn)
    setHasCheckedInToday(true)
  }

  if (hasCheckedInToday) {
    return (
      <div className="space-y-6">
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2 text-green-700">
              <CheckCircle2 className="h-6 w-6" />
              Daily Check-in Complete!
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="flex items-center justify-center gap-4">
              <div className="flex items-center gap-2">
                <Flame className="h-5 w-5 text-orange-500" />
                <span className="font-semibold">{currentStreak} day streak</span>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              Great job staying consistent! Come back tomorrow to continue your wellness journey.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Streak Display */}
      <Card className="bg-gradient-to-br from-orange-50 to-pink-50 border-orange-200">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center gap-3">
            <Flame className="h-6 w-6 text-orange-500" />
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{currentStreak}</div>
              <div className="text-sm text-gray-600">day streak</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mood Check-in */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-pink-500" />
            How are you feeling today?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-3">
            {moodOptions.map((option) => (
              <Button
                key={option.value}
                variant={todayCheckIn?.mood === option.value ? "default" : "outline"}
                className={`flex flex-col items-center gap-2 h-auto py-4 ${
                  todayCheckIn?.mood === option.value ? "bg-pink-500 hover:bg-pink-600" : "hover:bg-pink-50"
                }`}
                onClick={() => handleMoodSelect(option.value)}
              >
                <option.icon
                  className={`h-6 w-6 ${todayCheckIn?.mood === option.value ? "text-white" : option.color}`}
                />
                <span className="text-xs">{option.label}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Energy Check-in */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-500" />
            What's your energy level?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3">
            {energyOptions.map((option) => (
              <Button
                key={option.value}
                variant={todayCheckIn?.energy === option.value ? "default" : "outline"}
                className={`flex flex-col items-center gap-2 h-auto py-4 ${
                  todayCheckIn?.energy === option.value ? "bg-yellow-500 hover:bg-yellow-600" : "hover:bg-yellow-50"
                }`}
                onClick={() => handleEnergySelect(option.value)}
              >
                <option.icon
                  className={`h-6 w-6 ${todayCheckIn?.energy === option.value ? "text-white" : option.color}`}
                />
                <span className="text-xs">{option.label}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Daily Goals */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-purple-500" />
            Today's Wellness Goals
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {dailyGoals.map((goal) => (
              <div
                key={goal}
                className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                  todayCheckIn?.completedGoals.includes(goal)
                    ? "bg-green-50 border-green-200"
                    : "bg-gray-50 border-gray-200 hover:bg-purple-50"
                }`}
                onClick={() => toggleGoal(goal)}
              >
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    todayCheckIn?.completedGoals.includes(goal) ? "bg-green-500 border-green-500" : "border-gray-300"
                  }`}
                >
                  {todayCheckIn?.completedGoals.includes(goal) && <CheckCircle2 className="h-3 w-3 text-white" />}
                </div>
                <span
                  className={`text-sm ${
                    todayCheckIn?.completedGoals.includes(goal) ? "text-green-700 line-through" : "text-gray-700"
                  }`}
                >
                  {goal}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Notes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-500" />
            Daily Notes (Optional)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="How was your day? Any thoughts or reflections..."
            value={todayCheckIn?.notes || ""}
            onChange={(e) => handleNotesChange(e.target.value)}
            className="min-h-[100px]"
          />
        </CardContent>
      </Card>

      {/* Submit Button */}
      <Button
        onClick={submitCheckIn}
        disabled={!todayCheckIn || todayCheckIn.mood === 0 || todayCheckIn.energy === 0}
        className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white py-3"
      >
        Complete Daily Check-in
      </Button>
    </div>
  )
}
