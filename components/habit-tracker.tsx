"use client"

import { useState, useEffect } from "react"
import {
  Plus,
  Target,
  Flame,
  CheckCircle2,
  Circle,
  Trash2,
  Droplets,
  Dumbbell,
  Moon,
  Apple,
  Brain,
  Heart,
  Calendar,
  TrendingUp,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Habit {
  id: string
  name: string
  category: "health" | "wellness" | "self-care" | "nutrition" | "exercise" | "sleep" | "mindfulness"
  icon: any
  color: string
  streak: number
  completedDates: string[]
  createdDate: string
  target: number // days per week
  description?: string
}

interface HabitCompletion {
  habitId: string
  date: string
  completed: boolean
}

export default function HabitTracker() {
  const [habits, setHabits] = useState<Habit[]>([])
  const [completions, setCompletions] = useState<HabitCompletion[]>([])
  const [isAddingHabit, setIsAddingHabit] = useState(false)
  const [newHabitName, setNewHabitName] = useState("")
  const [newHabitCategory, setNewHabitCategory] = useState<string>("")
  const [newHabitTarget, setNewHabitTarget] = useState(7)

  const today = new Date().toISOString().split("T")[0]

  const habitCategories = [
    { value: "health", label: "Health", icon: Heart, color: "text-red-500" },
    { value: "wellness", label: "Wellness", icon: Target, color: "text-purple-500" },
    { value: "self-care", label: "Self Care", icon: Heart, color: "text-pink-500" },
    { value: "nutrition", label: "Nutrition", icon: Apple, color: "text-green-500" },
    { value: "exercise", label: "Exercise", icon: Dumbbell, color: "text-blue-500" },
    { value: "sleep", label: "Sleep", icon: Moon, color: "text-indigo-500" },
    { value: "mindfulness", label: "Mindfulness", icon: Brain, color: "text-teal-500" },
  ]

  const predefinedHabits = [
    { name: "Drink 8 glasses of water", category: "health", icon: Droplets, color: "text-blue-500" },
    { name: "Take daily vitamins", category: "health", icon: Heart, color: "text-red-500" },
    { name: "10 minutes of exercise", category: "exercise", icon: Dumbbell, color: "text-blue-600" },
    { name: "8 hours of sleep", category: "sleep", icon: Moon, color: "text-indigo-500" },
    { name: "5 minutes of meditation", category: "mindfulness", icon: Brain, color: "text-teal-500" },
    { name: "Eat a healthy breakfast", category: "nutrition", icon: Apple, color: "text-green-500" },
    { name: "Practice gratitude", category: "wellness", icon: Heart, color: "text-pink-500" },
    { name: "Skincare routine", category: "self-care", icon: Heart, color: "text-purple-500" },
  ]

  useEffect(() => {
    loadHabits()
    loadCompletions()
  }, [])

  const loadHabits = () => {
    try {
      const savedHabits = localStorage.getItem("userHabits")
      if (savedHabits) {
        const parsed = JSON.parse(savedHabits)
        setHabits(parsed)
      }
    } catch (error) {
      console.error("Error loading habits:", error)
    }
  }

  const loadCompletions = () => {
    try {
      const savedCompletions = localStorage.getItem("habitCompletions")
      if (savedCompletions) {
        const parsed = JSON.parse(savedCompletions)
        setCompletions(parsed)
      }
    } catch (error) {
      console.error("Error loading completions:", error)
    }
  }

  const saveHabits = (newHabits: Habit[]) => {
    try {
      localStorage.setItem("userHabits", JSON.stringify(newHabits))
      setHabits(newHabits)
    } catch (error) {
      console.error("Error saving habits:", error)
    }
  }

  const saveCompletions = (newCompletions: HabitCompletion[]) => {
    try {
      localStorage.setItem("habitCompletions", JSON.stringify(newCompletions))
      setCompletions(newCompletions)
    } catch (error) {
      console.error("Error saving completions:", error)
    }
  }

  const addCustomHabit = () => {
    if (!newHabitName.trim() || !newHabitCategory) return

    const categoryInfo = habitCategories.find((cat) => cat.value === newHabitCategory)
    if (!categoryInfo) return

    const newHabit: Habit = {
      id: Date.now().toString(),
      name: newHabitName.trim(),
      category: newHabitCategory as any,
      icon: categoryInfo.icon,
      color: categoryInfo.color,
      streak: 0,
      completedDates: [],
      createdDate: today,
      target: newHabitTarget,
    }

    const updatedHabits = [...habits, newHabit]
    saveHabits(updatedHabits)

    setNewHabitName("")
    setNewHabitCategory("")
    setNewHabitTarget(7)
    setIsAddingHabit(false)
  }

  const addPredefinedHabit = (predefined: any) => {
    const newHabit: Habit = {
      id: Date.now().toString(),
      name: predefined.name,
      category: predefined.category,
      icon: predefined.icon,
      color: predefined.color,
      streak: 0,
      completedDates: [],
      createdDate: today,
      target: 7,
    }

    const updatedHabits = [...habits, newHabit]
    saveHabits(updatedHabits)
  }

  const toggleHabitCompletion = (habitId: string) => {
    const existingCompletion = completions.find((c) => c.habitId === habitId && c.date === today)

    let newCompletions: HabitCompletion[]
    if (existingCompletion) {
      // Remove completion
      newCompletions = completions.filter((c) => !(c.habitId === habitId && c.date === today))
    } else {
      // Add completion
      newCompletions = [...completions, { habitId, date: today, completed: true }]
    }

    saveCompletions(newCompletions)
    updateHabitStreaks(newCompletions)
  }

  const updateHabitStreaks = (currentCompletions: HabitCompletion[]) => {
    const updatedHabits = habits.map((habit) => {
      const habitCompletions = currentCompletions
        .filter((c) => c.habitId === habit.id)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

      // Calculate current streak
      let streak = 0
      const today = new Date()

      for (let i = 0; i < 30; i++) {
        const checkDate = new Date(today)
        checkDate.setDate(checkDate.getDate() - i)
        const dateStr = checkDate.toISOString().split("T")[0]

        const hasCompletion = habitCompletions.some((c) => c.date === dateStr)
        if (hasCompletion) {
          streak++
        } else if (i > 0) {
          // Allow for today to not break streak if it's still today
          break
        }
      }

      const completedDates = habitCompletions.map((c) => c.date)

      return {
        ...habit,
        streak,
        completedDates,
      }
    })

    saveHabits(updatedHabits)
  }

  const deleteHabit = (habitId: string) => {
    const updatedHabits = habits.filter((h) => h.id !== habitId)
    const updatedCompletions = completions.filter((c) => c.habitId !== habitId)

    saveHabits(updatedHabits)
    saveCompletions(updatedCompletions)
  }

  const isHabitCompletedToday = (habitId: string) => {
    return completions.some((c) => c.habitId === habitId && c.date === today)
  }

  const getWeeklyProgress = (habit: Habit) => {
    const weekStart = new Date()
    weekStart.setDate(weekStart.getDate() - weekStart.getDay()) // Start of week

    let completedThisWeek = 0
    for (let i = 0; i < 7; i++) {
      const checkDate = new Date(weekStart)
      checkDate.setDate(checkDate.getDate() + i)
      const dateStr = checkDate.toISOString().split("T")[0]

      if (completions.some((c) => c.habitId === habit.id && c.date === dateStr)) {
        completedThisWeek++
      }
    }

    return Math.min((completedThisWeek / habit.target) * 100, 100)
  }

  const getTotalHabitsCompleted = () => {
    return completions.filter((c) => c.date === today).length
  }

  const getAverageCompletion = () => {
    if (habits.length === 0) return 0
    const completedToday = getTotalHabitsCompleted()
    return Math.round((completedToday / habits.length) * 100)
  }

  const getLongestStreak = () => {
    return habits.reduce((max, habit) => Math.max(max, habit.streak), 0)
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Today's Progress</p>
                <p className="text-2xl font-bold text-green-600">
                  {getTotalHabitsCompleted()}/{habits.length}
                </p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-cyan-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completion Rate</p>
                <p className="text-2xl font-bold text-blue-600">{getAverageCompletion()}%</p>
              </div>
              <Target className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Longest Streak</p>
                <p className="text-2xl font-bold text-orange-600">{getLongestStreak()}</p>
              </div>
              <Flame className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-pink-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Habits</p>
                <p className="text-2xl font-bold text-purple-600">{habits.length}</p>
              </div>
              <Calendar className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Habit Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-purple-500" />
              My Habits
            </CardTitle>
            <Dialog open={isAddingHabit} onOpenChange={setIsAddingHabit}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add Habit
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Habit</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Habit Name</label>
                    <Input
                      value={newHabitName}
                      onChange={(e) => setNewHabitName(e.target.value)}
                      placeholder="e.g., Drink more water"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Category</label>
                    <Select value={newHabitCategory} onValueChange={setNewHabitCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {habitCategories.map((cat) => (
                          <SelectItem key={cat.value} value={cat.value}>
                            {cat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Target (days per week)</label>
                    <Select
                      value={newHabitTarget.toString()}
                      onValueChange={(v) => setNewHabitTarget(Number.parseInt(v))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                          <SelectItem key={num} value={num.toString()}>
                            {num} {num === 1 ? "day" : "days"} per week
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={addCustomHabit} className="w-full">
                    Add Habit
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {habits.length === 0 ? (
            <div className="text-center py-8">
              <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No habits yet</h3>
              <p className="text-gray-500 mb-4">Start building healthy habits to track your progress</p>
              <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-4">
                {predefinedHabits.map((habit, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => addPredefinedHabit(habit)}
                    className="flex items-center gap-2 text-left justify-start"
                  >
                    <habit.icon className={`h-4 w-4 ${habit.color}`} />
                    <span className="text-xs">{habit.name}</span>
                  </Button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {habits.map((habit) => {
                const isCompleted = isHabitCompletedToday(habit.id)
                const weeklyProgress = getWeeklyProgress(habit)

                return (
                  <div
                    key={habit.id}
                    className={`p-4 rounded-lg border transition-all duration-200 ${
                      isCompleted ? "bg-green-50 border-green-200" : "bg-white border-gray-200 hover:border-purple-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleHabitCompletion(habit.id)}
                          className={`p-2 rounded-full ${
                            isCompleted
                              ? "bg-green-500 hover:bg-green-600 text-white"
                              : "bg-gray-100 hover:bg-purple-100"
                          }`}
                        >
                          {isCompleted ? <CheckCircle2 className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
                        </Button>

                        <div className="flex items-center gap-2">
                          <habit.icon className={`h-5 w-5 ${habit.color}`} />
                          <div>
                            <h4 className={`font-medium ${isCompleted ? "text-green-700" : "text-gray-800"}`}>
                              {habit.name}
                            </h4>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-xs">
                                {habit.category}
                              </Badge>
                              {habit.streak > 0 && (
                                <div className="flex items-center gap-1">
                                  <Flame className="h-3 w-3 text-orange-500" />
                                  <span className="text-xs text-orange-600">{habit.streak} day streak</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="text-right min-w-[80px]">
                          <div className="text-xs text-gray-500">This week</div>
                          <div className="flex items-center gap-1">
                            <Progress value={weeklyProgress} className="w-12 h-1" />
                            <span className="text-xs font-medium">{Math.round(weeklyProgress)}%</span>
                          </div>
                        </div>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteHabit(habit.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Weekly Overview */}
      {habits.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-500" />
              Weekly Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-7">
              {Array.from({ length: 7 }, (_, i) => {
                const date = new Date()
                date.setDate(date.getDate() - (6 - i))
                const dateStr = date.toISOString().split("T")[0]
                const dayName = date.toLocaleDateString("en-US", { weekday: "short" })

                const dayCompletions = completions.filter((c) => c.date === dateStr)
                const completionRate = habits.length > 0 ? (dayCompletions.length / habits.length) * 100 : 0

                return (
                  <div key={i} className="text-center">
                    <div className="text-xs font-medium text-gray-600 mb-2">{dayName}</div>
                    <div
                      className={`w-8 h-8 rounded-full mx-auto flex items-center justify-center text-xs font-bold ${
                        completionRate === 100
                          ? "bg-green-500 text-white"
                          : completionRate >= 50
                            ? "bg-yellow-500 text-white"
                            : completionRate > 0
                              ? "bg-orange-500 text-white"
                              : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {Math.round(completionRate)}%
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {dayCompletions.length}/{habits.length}
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
