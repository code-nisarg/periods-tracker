"use client"

import { useState, useEffect } from "react"
import {
  TrendingUp,
  BarChart3,
  PieChart,
  Calendar,
  Heart,
  Brain,
  AlertCircle,
  CheckCircle,
  Target,
  Zap,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Cell,
} from "recharts"

interface PersonalizedInsightsProps {
  cycleData?: any
  symptomHistory?: any[]
}

interface InsightData {
  moodTrends: any[]
  energyTrends: any[]
  symptomPatterns: any[]
  cycleConsistency: number
  wellnessScore: number
  recommendations: string[]
  achievements: any[]
  patterns: {
    bestDays: string[]
    challengingDays: string[]
    optimalPhase: string
  }
}

export default function PersonalizedInsights({ cycleData, symptomHistory = [] }: PersonalizedInsightsProps) {
  const [insights, setInsights] = useState<InsightData | null>(null)
  const [checkInHistory, setCheckInHistory] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAndAnalyzeData()
  }, [cycleData, symptomHistory])

  const loadAndAnalyzeData = async () => {
    try {
      setLoading(true)

      // Load all user data
      const checkIns = JSON.parse(localStorage.getItem("dailyCheckInHistory") || "[]")
      const achievements = JSON.parse(localStorage.getItem("userAchievements") || "[]")
      const currentStreak = Number.parseInt(localStorage.getItem("dailyStreak") || "0")

      setCheckInHistory(checkIns)

      // Analyze data and generate insights
      const analysisResults = analyzeUserData(checkIns, symptomHistory, achievements, currentStreak)
      setInsights(analysisResults)
    } catch (error) {
      console.error("Error analyzing data:", error)
    } finally {
      setLoading(false)
    }
  }

  const analyzeUserData = (checkIns: any[], symptoms: any[], achievements: any[], streak: number): InsightData => {
    // Analyze mood trends over time
    const moodTrends = checkIns.slice(-14).map((entry, index) => ({
      day: `Day ${index + 1}`,
      mood: entry.mood || 0,
      energy: entry.energy || 0,
      date: entry.date,
    }))

    // Analyze energy patterns
    const energyTrends = checkIns.slice(-7).map((entry, index) => ({
      day: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][index % 7],
      energy: entry.energy || 0,
      goals: entry.completedGoals?.length || 0,
    }))

    // Analyze symptom patterns
    const symptomCounts: { [key: string]: number } = {}
    symptoms.forEach((entry) => {
      Object.keys(entry.symptoms || {}).forEach((symptom) => {
        if (entry.symptoms[symptom]) {
          symptomCounts[symptom] = (symptomCounts[symptom] || 0) + 1
        }
      })
    })

    const symptomPatterns = Object.entries(symptomCounts)
      .map(([symptom, count]) => ({
        symptom: symptom.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase()),
        count,
        percentage: Math.round((count / symptoms.length) * 100),
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)

    // Calculate wellness score
    const avgMood = checkIns.reduce((sum, entry) => sum + (entry.mood || 0), 0) / Math.max(checkIns.length, 1)
    const avgEnergy = checkIns.reduce((sum, entry) => sum + (entry.energy || 0), 0) / Math.max(checkIns.length, 1)
    const goalCompletionRate =
      checkIns.reduce((sum, entry) => sum + (entry.completedGoals?.length || 0), 0) / Math.max(checkIns.length * 8, 1)
    const wellnessScore = Math.round(((avgMood + avgEnergy) / 8 + goalCompletionRate + streak / 30) * 25)

    // Generate personalized recommendations
    const recommendations = generateRecommendations(avgMood, avgEnergy, symptomPatterns, streak, cycleData)

    // Analyze patterns
    const patterns = analyzePatterns(checkIns, cycleData)

    return {
      moodTrends,
      energyTrends,
      symptomPatterns,
      cycleConsistency: Math.min(streak * 3.33, 100), // Convert streak to percentage
      wellnessScore: Math.min(wellnessScore, 100),
      recommendations,
      achievements: achievements.filter((a) => a.isUnlocked),
      patterns,
    }
  }

  const generateRecommendations = (
    avgMood: number,
    avgEnergy: number,
    symptoms: any[],
    streak: number,
    cycle: any,
  ): string[] => {
    const recs: string[] = []

    if (avgMood < 2.5) {
      recs.push(
        "Consider incorporating more mood-boosting activities like gentle exercise or meditation into your routine.",
      )
    }

    if (avgEnergy < 2) {
      recs.push("Focus on improving sleep quality and consider iron-rich foods to boost energy levels.")
    }

    if (symptoms.some((s) => s.symptom.toLowerCase().includes("cramp"))) {
      recs.push("Try heat therapy and magnesium supplements to help manage cramping symptoms.")
    }

    if (streak < 7) {
      recs.push("Building a consistent tracking habit will help you identify patterns and improve predictions.")
    }

    if (cycle?.currentPhase?.name === "Luteal") {
      recs.push("During your luteal phase, prioritize self-care and consider reducing high-intensity activities.")
    }

    if (cycle?.currentPhase?.name === "Follicular") {
      recs.push("Take advantage of your rising energy during the follicular phase to tackle challenging tasks.")
    }

    return recs.slice(0, 3) // Limit to top 3 recommendations
  }

  const analyzePatterns = (checkIns: any[], cycle: any) => {
    const dayAnalysis = checkIns.map((entry) => ({
      ...entry,
      totalScore: (entry.mood || 0) + (entry.energy || 0) + (entry.completedGoals?.length || 0),
    }))

    const sortedDays = dayAnalysis.sort((a, b) => b.totalScore - a.totalScore)

    return {
      bestDays: sortedDays.slice(0, 3).map((day) => new Date(day.date).toLocaleDateString()),
      challengingDays: sortedDays.slice(-3).map((day) => new Date(day.date).toLocaleDateString()),
      optimalPhase: cycle?.currentPhase?.name || "Unknown",
    }
  }

  const COLORS = ["#8B5CF6", "#EC4899", "#10B981", "#F59E0B", "#EF4444"]

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
              <span className="ml-2 text-gray-600">Analyzing your data...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!insights) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="pt-6 text-center">
            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">Not Enough Data Yet</h3>
            <p className="text-gray-500">
              Keep tracking your daily check-ins and symptoms to unlock personalized insights!
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Wellness Score Overview */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-gradient-to-br from-purple-50 to-pink-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Wellness Score</p>
                <p className="text-3xl font-bold text-purple-600">{insights.wellnessScore}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Heart className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <Progress value={insights.wellnessScore} className="mt-3" />
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-emerald-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tracking Consistency</p>
                <p className="text-3xl font-bold text-green-600">{Math.round(insights.cycleConsistency)}%</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <Target className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <Progress value={insights.cycleConsistency} className="mt-3" />
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-cyan-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Achievements</p>
                <p className="text-3xl font-bold text-blue-600">{insights.achievements.length}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <CheckCircle className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Mood & Energy Trends */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-purple-500" />
              Mood & Energy Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={insights.moodTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis domain={[0, 4]} />
                <Tooltip />
                <Line type="monotone" dataKey="mood" stroke="#8B5CF6" strokeWidth={2} name="Mood" />
                <Line type="monotone" dataKey="energy" stroke="#EC4899" strokeWidth={2} name="Energy" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-green-500" />
              Weekly Energy & Goals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={insights.energyTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="energy" fill="#10B981" name="Energy Level" />
                <Bar dataKey="goals" fill="#F59E0B" name="Goals Completed" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Symptom Patterns */}
      {insights.symptomPatterns.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5 text-orange-500" />
              Most Common Symptoms
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-3">
                {insights.symptomPatterns.map((pattern, index) => (
                  <div key={pattern.symptom} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <span className="text-sm font-medium">{pattern.symptom}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">{pattern.count} times</span>
                      <Badge variant="outline">{pattern.percentage}%</Badge>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-center">
                <ResponsiveContainer width="100%" height={150}>
                  <RechartsPieChart>
                    <Tooltip />
                    <RechartsPieChart
                      data={insights.symptomPatterns}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={60}
                      dataKey="count"
                    >
                      {insights.symptomPatterns.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </RechartsPieChart>
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Personalized Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-indigo-500" />
            Personalized Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {insights.recommendations.map((rec, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-indigo-50 rounded-lg">
                <Zap className="h-5 w-5 text-indigo-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-gray-700">{rec}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Pattern Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-teal-500" />
            Your Patterns
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <h4 className="font-semibold text-green-700 mb-2">Best Days</h4>
              <div className="space-y-1">
                {insights.patterns.bestDays.map((day, index) => (
                  <p key={index} className="text-sm text-green-600">
                    {day}
                  </p>
                ))}
              </div>
            </div>

            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <h4 className="font-semibold text-yellow-700 mb-2">Optimal Phase</h4>
              <p className="text-lg font-bold text-yellow-600">{insights.patterns.optimalPhase}</p>
              <p className="text-xs text-yellow-600 mt-1">When you feel your best</p>
            </div>

            <div className="text-center p-4 bg-red-50 rounded-lg">
              <h4 className="font-semibold text-red-700 mb-2">Challenging Days</h4>
              <div className="space-y-1">
                {insights.patterns.challengingDays.map((day, index) => (
                  <p key={index} className="text-sm text-red-600">
                    {day}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
