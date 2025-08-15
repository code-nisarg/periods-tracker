"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  TrendingUp,
  Calendar,
  Heart,
  Brain,
  Target,
  Sparkles,
  Activity,
  Moon,
  Shield,
  Apple,
  Dumbbell,
} from "lucide-react"

interface CycleInsightsProps {
  cycleData: any
  symptomHistory: any[]
}

export default function CycleInsights({ cycleData, symptomHistory }: CycleInsightsProps) {
  const calculateAdvancedInsights = () => {
    const insights = []
    const currentPhase = cycleData?.currentPhase?.name

    // Phase-specific insights with more detail
    if (currentPhase === "Ovulation") {
      insights.push({
        type: "fertility",
        icon: Target,
        title: "Peak Fertility Window",
        description: "You're in your most fertile phase. Cervical mucus is clear and stretchy.",
        tips: ["Track basal body temperature", "Stay hydrated", "Consider prenatal vitamins"],
        color: "text-orange-600 bg-gradient-to-br from-orange-50 via-pink-50 to-rose-50",
        priority: "high",
      })
    }

    if (currentPhase === "Luteal") {
      insights.push({
        type: "mood",
        icon: Brain,
        title: "PMS Awareness Phase",
        description: "Progesterone levels are rising. You might experience mood changes and cravings.",
        tips: ["Practice deep breathing", "Limit caffeine", "Increase magnesium intake"],
        color: "text-purple-600 bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50",
        priority: "medium",
      })
    }

    if (currentPhase === "Follicular") {
      insights.push({
        type: "energy",
        icon: TrendingUp,
        title: "Energy Rising Phase",
        description: "Estrogen is increasing, boosting your energy and mood naturally.",
        tips: ["Try new workouts", "Plan important meetings", "Start creative projects"],
        color: "text-rose-600 bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50",
        priority: "high",
      })
    }

    if (currentPhase === "Menstrual") {
      insights.push({
        type: "rest",
        icon: Moon,
        title: "Rest & Renewal Phase",
        description: "Your body is shedding the uterine lining. Focus on gentle self-care.",
        tips: ["Use heating pads", "Gentle yoga or stretching", "Iron-rich foods"],
        color: "text-red-600 bg-gradient-to-br from-red-50 via-pink-50 to-rose-50",
        priority: "high",
      })
    }

    return insights
  }

  const calculateSymptomTrends = () => {
    if (!symptomHistory.length) return null

    const recentSymptoms = symptomHistory.slice(-7) // Last 7 days
    const commonSymptoms = {}

    recentSymptoms.forEach((day) => {
      Object.keys(day.symptoms || {}).forEach((symptom) => {
        if (day.symptoms[symptom]) {
          commonSymptoms[symptom] = (commonSymptoms[symptom] || 0) + 1
        }
      })
    })

    return Object.entries(commonSymptoms)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([symptom, count]) => ({ symptom, frequency: (count / 7) * 100 }))
  }

  const getWellnessScore = () => {
    if (!cycleData) return 0

    // Calculate based on cycle regularity and phase
    let score = 70 // Base score

    if (cycleData.cycleDay <= 28 && cycleData.cycleDay >= 21) score += 20
    if (cycleData.currentPhase?.name === "Follicular") score += 10

    return Math.min(score, 100)
  }

  const insights = calculateAdvancedInsights()
  const symptomTrends = calculateSymptomTrends()
  const cycleProgress = cycleData ? (cycleData.cycleDay / 28) * 100 : 0
  const wellnessScore = getWellnessScore()
  const nextPhase = cycleData?.nextPhase || "Follicular"
  const daysToNextPhase = cycleData ? Math.max(0, cycleData.nextPhaseDay - cycleData.cycleDay) : 0

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <h3 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
          Your Cycle Insights
        </h3>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Personalized insights powered by your tracking data to help you understand your body better
        </p>
      </div>

      {/* Wellness Dashboard */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Cycle Progress */}
        <Card className="bg-gradient-to-br from-pink-50 via-white to-purple-50 border-pink-200">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-pink-600">
              <Calendar className="h-5 w-5" />
              Cycle Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-pink-600">Day {cycleData?.cycleDay || 0}</div>
              <div className="text-sm text-gray-500">of 28-day cycle</div>
            </div>
            <Progress value={cycleProgress} className="h-3 bg-pink-100" />
            <div className="text-center">
              <p className="text-sm font-medium text-gray-700">
                {cycleData?.currentPhase?.name || "Track to see progress"}
              </p>
              {daysToNextPhase > 0 && (
                <p className="text-xs text-gray-500 mt-1">
                  {daysToNextPhase} days until {nextPhase}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Wellness Score */}
        <Card className="bg-gradient-to-br from-purple-50 via-white to-pink-50 border-purple-200">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-purple-600">
              <Activity className="h-5 w-5" />
              Wellness Score
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">{wellnessScore}</div>
              <div className="text-sm text-gray-500">out of 100</div>
            </div>
            <Progress value={wellnessScore} className="h-3 bg-purple-100" />
            <div className="text-center">
              <p className="text-sm font-medium text-gray-700">
                {wellnessScore >= 80 ? "Excellent" : wellnessScore >= 60 ? "Good" : "Needs attention"}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Symptom Trends */}
        <Card className="bg-gradient-to-br from-rose-50 via-white to-pink-50 border-rose-200">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-rose-600">
              <TrendingUp className="h-5 w-5" />
              Recent Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            {symptomTrends && symptomTrends.length > 0 ? (
              <div className="space-y-3">
                {symptomTrends.map(({ symptom, frequency }, index) => (
                  <div key={index} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="capitalize font-medium">{symptom}</span>
                      <span className="text-rose-600">{Math.round(frequency)}%</span>
                    </div>
                    <Progress value={frequency} className="h-2 bg-rose-100" />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">Track symptoms to see trends</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Phase-Specific Insights */}
      <div className="grid gap-6 md:grid-cols-2">
        {insights.map((insight, index) => (
          <Card key={index} className="hover:shadow-lg transition-all duration-300 border-0 shadow-md overflow-hidden">
            <div className={`${insight.color} p-4 border-b`}>
              <CardTitle className="flex items-center gap-3 text-lg">
                <div className="p-2 bg-white/20 rounded-full">
                  <insight.icon className="h-5 w-5" />
                </div>
                {insight.title}
                {insight.priority === "high" && (
                  <span className="px-2 py-1 bg-white/30 rounded-full text-xs font-medium">Priority</span>
                )}
              </CardTitle>
            </div>
            <CardContent className="p-4 space-y-4">
              <p className="text-gray-700">{insight.description}</p>
              <div className="space-y-2">
                <h4 className="font-medium text-gray-800 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-pink-500" />
                  Recommended Actions
                </h4>
                <ul className="space-y-1">
                  {insight.tips.map((tip, tipIndex) => (
                    <li key={tipIndex} className="text-sm text-gray-600 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-pink-400 rounded-full"></div>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Comprehensive Health Tips */}
      <Card className="bg-gradient-to-br from-white via-pink-50/30 to-purple-50/30 border-pink-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-pink-600 text-xl">
            <Heart className="h-6 w-6" />
            Personalized Health Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* Nutrition */}
            <div className="space-y-3 p-4 bg-white/60 rounded-lg border border-green-100">
              <div className="flex items-center gap-2 text-green-600">
                <Apple className="h-5 w-5" />
                <h4 className="font-medium">Nutrition</h4>
              </div>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• Iron-rich foods (spinach, lentils)</li>
                <li>• Omega-3 fatty acids</li>
                <li>• Complex carbohydrates</li>
                <li>• Stay hydrated (8+ glasses)</li>
              </ul>
            </div>

            {/* Exercise */}
            <div className="space-y-3 p-4 bg-white/60 rounded-lg border border-blue-100">
              <div className="flex items-center gap-2 text-blue-600">
                <Dumbbell className="h-5 w-5" />
                <h4 className="font-medium">Exercise</h4>
              </div>
              <ul className="space-y-1 text-sm text-gray-600">
                {cycleData?.currentPhase?.name === "Menstrual" ? (
                  <>
                    <li>• Gentle yoga or stretching</li>
                    <li>• Light walking</li>
                    <li>• Avoid intense workouts</li>
                  </>
                ) : cycleData?.currentPhase?.name === "Follicular" ? (
                  <>
                    <li>• High-intensity workouts</li>
                    <li>• Strength training</li>
                    <li>• Try new activities</li>
                  </>
                ) : (
                  <>
                    <li>• Moderate cardio</li>
                    <li>• Pilates or yoga</li>
                    <li>• Listen to your body</li>
                  </>
                )}
              </ul>
            </div>

            {/* Sleep */}
            <div className="space-y-3 p-4 bg-white/60 rounded-lg border border-purple-100">
              <div className="flex items-center gap-2 text-purple-600">
                <Moon className="h-5 w-5" />
                <h4 className="font-medium">Sleep</h4>
              </div>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• 7-9 hours nightly</li>
                <li>• Consistent sleep schedule</li>
                <li>• Cool, dark environment</li>
                <li>• Limit screens before bed</li>
              </ul>
            </div>

            {/* Stress Management */}
            <div className="space-y-3 p-4 bg-white/60 rounded-lg border border-pink-100">
              <div className="flex items-center gap-2 text-pink-600">
                <Shield className="h-5 w-5" />
                <h4 className="font-medium">Stress Relief</h4>
              </div>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• Deep breathing exercises</li>
                <li>• Meditation (10+ minutes)</li>
                <li>• Journaling</li>
                <li>• Connect with loved ones</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
