"use client"

import { useState, useEffect } from "react"
import {
  Lightbulb,
  RefreshCw,
  BookOpen,
  Apple,
  Dumbbell,
  Brain,
  Heart,
  Leaf,
  ChevronRight,
  Star,
  Zap,
  Smile,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface WellnessTip {
  id: string
  title: string
  content: string
  category: "nutrition" | "exercise" | "mental-health" | "self-care" | "education" | "general" | "symptom-relief"
  phase?: "Menstrual" | "Follicular" | "Ovulation" | "Luteal"
  symptom?: string
  icon: any
  color: string
  actionable: boolean
  source?: string
}

interface DailyWellnessTipsProps {
  currentPhase?: {
    name: string
  }
  currentSymptoms?: any
}

export default function DailyWellnessTips({ currentPhase, currentSymptoms }: DailyWellnessTipsProps) {
  const [todaysTips, setTodaysTips] = useState<WellnessTip[]>([])
  const [tipOfTheDay, setTipOfTheDay] = useState<WellnessTip | null>(null)
  const [viewedTips, setViewedTips] = useState<string[]>([])
  const [favoriteCategories, setFavoriteCategories] = useState<string[]>([])

  const wellnessTipsDatabase: WellnessTip[] = [
    // Symptom-Specific Tips
    {
      id: "cramps_relief",
      title: "Natural Cramp Relief",
      content:
        "Apply heat to your lower abdomen, try gentle yoga poses like child's pose, or drink chamomile tea to help relax uterine muscles.",
      category: "symptom-relief",
      symptom: "cramps",
      icon: Zap,
      color: "text-red-500",
      actionable: true,
    },
    {
      id: "headache_relief",
      title: "Headache Management",
      content:
        "Stay hydrated, rest in a dark quiet room, apply a cold compress to your forehead, and try gentle neck stretches.",
      category: "symptom-relief",
      symptom: "headache",
      icon: Brain,
      color: "text-purple-500",
      actionable: true,
    },
    {
      id: "bloating_relief",
      title: "Reduce Bloating",
      content:
        "Avoid salty foods, drink peppermint or ginger tea, try gentle abdominal massage, and eat smaller, more frequent meals.",
      category: "symptom-relief",
      symptom: "bloating",
      icon: Heart,
      color: "text-blue-500",
      actionable: true,
    },
    {
      id: "fatigue_energy",
      title: "Combat Fatigue",
      content:
        "Prioritize sleep, eat iron-rich foods like spinach and lentils, take short walks for natural energy, and avoid caffeine crashes.",
      category: "symptom-relief",
      symptom: "fatigue",
      icon: Heart,
      color: "text-green-500",
      actionable: true,
    },
    {
      id: "mood_support",
      title: "Mood Balance",
      content:
        "Practice deep breathing, engage in activities you enjoy, reach out to supportive friends, and be patient with yourself.",
      category: "symptom-relief",
      symptom: "mood",
      icon: Smile,
      color: "text-pink-500",
      actionable: true,
    },
    {
      id: "nausea_relief",
      title: "Ease Nausea",
      content:
        "Try ginger tea or ginger candies, eat small frequent meals, avoid strong smells, and get fresh air when possible.",
      category: "symptom-relief",
      symptom: "nausea",
      icon: Apple,
      color: "text-yellow-500",
      actionable: true,
    },

    // Menstrual Phase Tips
    {
      id: "menstrual_iron",
      title: "Boost Your Iron Intake",
      content:
        "During menstruation, focus on iron-rich foods like spinach, lentils, and lean meats to replenish what you lose. Pair with vitamin C for better absorption.",
      category: "nutrition",
      phase: "Menstrual",
      icon: Apple,
      color: "text-red-500",
      actionable: true,
    },
    {
      id: "menstrual_rest",
      title: "Honor Your Need for Rest",
      content:
        "Your body is working hard during menstruation. It's perfectly normal to feel more tired. Listen to your body and allow yourself extra rest and gentle movement.",
      category: "self-care",
      phase: "Menstrual",
      icon: Heart,
      color: "text-pink-500",
      actionable: true,
    },
    {
      id: "menstrual_heat",
      title: "Use Heat for Cramp Relief",
      content:
        "Apply a heating pad or take a warm bath to help relax uterine muscles and reduce cramping. Heat therapy is one of the most effective natural pain relievers.",
      category: "self-care",
      phase: "Menstrual",
      icon: Heart,
      color: "text-orange-500",
      actionable: true,
    },

    // Follicular Phase Tips
    {
      id: "follicular_energy",
      title: "Harness Your Rising Energy",
      content:
        "As estrogen rises, you'll feel more energetic and social. This is a great time to start new projects, plan activities, and tackle challenging tasks.",
      category: "mental-health",
      phase: "Follicular",
      icon: Brain,
      color: "text-green-500",
      actionable: true,
    },
    {
      id: "follicular_exercise",
      title: "Try High-Intensity Workouts",
      content:
        "Your energy levels are climbing! This is an ideal time for cardio, strength training, or trying that new fitness class you've been considering.",
      category: "exercise",
      phase: "Follicular",
      icon: Dumbbell,
      color: "text-emerald-500",
      actionable: true,
    },
    {
      id: "follicular_planning",
      title: "Plan and Set Goals",
      content:
        "Your brain is sharp and optimistic during this phase. Use this mental clarity to set goals, make important decisions, and plan for the month ahead.",
      category: "mental-health",
      phase: "Follicular",
      icon: Brain,
      color: "text-blue-500",
      actionable: true,
    },

    // Ovulation Phase Tips
    {
      id: "ovulation_confidence",
      title: "Embrace Your Peak Confidence",
      content:
        "Ovulation brings peak estrogen levels, making you feel most confident and social. Schedule important meetings, dates, or social events during this time.",
      category: "mental-health",
      phase: "Ovulation",
      icon: Star,
      color: "text-yellow-500",
      actionable: true,
    },
    {
      id: "ovulation_communication",
      title: "Have Important Conversations",
      content:
        "Your communication skills are at their peak. This is the perfect time for difficult conversations, presentations, or expressing your needs clearly.",
      category: "mental-health",
      phase: "Ovulation",
      icon: Brain,
      color: "text-amber-500",
      actionable: true,
    },
    {
      id: "ovulation_hydration",
      title: "Stay Extra Hydrated",
      content:
        "Increased body temperature during ovulation means you need more water. Aim for an extra glass or two to support your body's natural processes.",
      category: "nutrition",
      phase: "Ovulation",
      icon: Apple,
      color: "text-blue-400",
      actionable: true,
    },

    // Luteal Phase Tips
    {
      id: "luteal_selfcare",
      title: "Prioritize Self-Care",
      content:
        "As progesterone rises, you may feel more introspective. This is perfect for self-care activities like journaling, meditation, or gentle yoga.",
      category: "self-care",
      phase: "Luteal",
      icon: Heart,
      color: "text-purple-500",
      actionable: true,
    },
    {
      id: "luteal_magnesium",
      title: "Increase Magnesium Intake",
      content:
        "Magnesium can help with PMS symptoms like mood swings and bloating. Try dark chocolate, nuts, seeds, or leafy greens.",
      category: "nutrition",
      phase: "Luteal",
      icon: Apple,
      color: "text-indigo-500",
      actionable: true,
    },
    {
      id: "luteal_boundaries",
      title: "Set Healthy Boundaries",
      content:
        "You might feel more sensitive during this phase. It's okay to say no to social events and prioritize your emotional well-being.",
      category: "mental-health",
      phase: "Luteal",
      icon: Brain,
      color: "text-violet-500",
      actionable: true,
    },

    // General Tips
    {
      id: "general_tracking",
      title: "Track Your Patterns",
      content:
        "Keep a record of your symptoms, moods, and energy levels. Over time, you'll notice patterns that help you better understand your unique cycle.",
      category: "education",
      icon: BookOpen,
      color: "text-gray-600",
      actionable: true,
    },
    {
      id: "general_sleep",
      title: "Prioritize Quality Sleep",
      content:
        "Aim for 7-9 hours of sleep each night. Your menstrual cycle affects sleep quality, and good sleep supports hormonal balance.",
      category: "self-care",
      icon: Heart,
      color: "text-indigo-600",
      actionable: true,
    },
    {
      id: "general_stress",
      title: "Manage Stress Levels",
      content:
        "Chronic stress can disrupt your menstrual cycle. Practice stress-reduction techniques like deep breathing, meditation, or gentle exercise.",
      category: "mental-health",
      icon: Brain,
      color: "text-teal-500",
      actionable: true,
    },
    {
      id: "general_nutrition",
      title: "Eat Regular, Balanced Meals",
      content:
        "Skipping meals can affect your hormones. Aim for balanced meals with protein, healthy fats, and complex carbohydrates throughout the day.",
      category: "nutrition",
      icon: Apple,
      color: "text-green-600",
      actionable: true,
    },
  ]

  useEffect(() => {
    generateDailyTips()
    loadViewedTips()
  }, [currentPhase, currentSymptoms])

  const generateDailyTips = () => {
    const today = new Date()
    const dayOfYear = Math.floor(
      (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24),
    )

    // Get symptom-specific tips based on current symptoms
    const symptomSpecificTips: WellnessTip[] = []
    if (currentSymptoms) {
      Object.entries(currentSymptoms).forEach(([categoryId, symptoms]: [string, any]) => {
        Object.keys(symptoms || {}).forEach((symptomId) => {
          const matchingTips = wellnessTipsDatabase.filter(
            (tip) =>
              tip.symptom === symptomId ||
              (symptomId.includes("mood") && tip.symptom === "mood") ||
              (symptomId.includes("discharge") && tip.category === "self-care"),
          )
          symptomSpecificTips.push(...matchingTips)
        })
      })
    }

    // Get phase-specific tips
    const phaseSpecificTips = currentPhase ? wellnessTipsDatabase.filter((tip) => tip.phase === currentPhase.name) : []

    // Get general tips
    const generalTips = wellnessTipsDatabase.filter((tip) => !tip.phase && !tip.symptom)

    // Prioritize symptom-specific tips, then phase-specific, then general
    const allAvailableTips = [...symptomSpecificTips, ...phaseSpecificTips, ...generalTips]

    // Remove duplicates
    const uniqueTips = allAvailableTips.filter((tip, index, self) => index === self.findIndex((t) => t.id === tip.id))

    const shuffledTips = uniqueTips.sort(() => {
      return Math.sin(dayOfYear * 9999) - 0.5 // Deterministic shuffle based on day
    })

    // Select 4-6 tips for today, prioritizing symptom-specific ones
    const selectedTips = shuffledTips.slice(0, 6)
    setTodaysTips(selectedTips)

    // Set tip of the day (prioritize symptom-specific, then phase-specific, then general)
    const tipOfDay = symptomSpecificTips[0] || phaseSpecificTips[0] || generalTips[0]
    setTipOfTheDay(tipOfDay)
  }

  const loadViewedTips = () => {
    try {
      const viewed = JSON.parse(localStorage.getItem("viewedWellnessTips") || "[]")
      setViewedTips(viewed)
    } catch (error) {
      console.error("Error loading viewed tips:", error)
    }
  }

  const markTipAsViewed = (tipId: string) => {
    try {
      const newViewedTips = [...viewedTips, tipId]
      setViewedTips(newViewedTips)
      localStorage.setItem("viewedWellnessTips", JSON.stringify(newViewedTips))
    } catch (error) {
      console.error("Error saving viewed tip:", error)
    }
  }

  const refreshTips = () => {
    // Generate new random tips
    const shuffledTips = [...wellnessTipsDatabase].sort(() => Math.random() - 0.5)
    const newTips = shuffledTips.slice(0, 6)
    setTodaysTips(newTips)
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "nutrition":
        return Apple
      case "exercise":
        return Dumbbell
      case "mental-health":
        return Brain
      case "self-care":
        return Heart
      case "education":
        return BookOpen
      case "symptom-relief":
        return Zap
      default:
        return Leaf
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "nutrition":
        return "bg-green-100 text-green-700 border-green-300"
      case "exercise":
        return "bg-blue-100 text-blue-700 border-blue-300"
      case "mental-health":
        return "bg-purple-100 text-purple-700 border-purple-300"
      case "self-care":
        return "bg-pink-100 text-pink-700 border-pink-300"
      case "education":
        return "bg-yellow-100 text-yellow-700 border-yellow-300"
      case "symptom-relief":
        return "bg-red-100 text-red-700 border-red-300"
      default:
        return "bg-gray-100 text-gray-700 border-gray-300"
    }
  }

  const getTotalSymptoms = () => {
    if (!currentSymptoms) return 0
    return Object.values(currentSymptoms).reduce((total, category: any) => {
      return total + Object.keys(category || {}).length
    }, 0)
  }

  return (
    <div className="space-y-6">
      {getTotalSymptoms() > 0 && (
        <Card className="bg-gradient-to-r from-red-50 to-pink-50 border-red-200">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-sm text-red-700">
              <Zap className="h-4 w-4" />
              <span>Showing personalized tips based on your {getTotalSymptoms()} tracked symptoms today</span>
            </div>
          </CardContent>
        </Card>
      )}

      {tipOfTheDay && (
        <Card className="bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="p-2 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full">
                <Lightbulb className="h-5 w-5 text-purple-600" />
              </div>
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Tip of the Day
              </span>
              {currentPhase && (
                <Badge className="bg-purple-100 text-purple-700 border-purple-300">{currentPhase.name} Phase</Badge>
              )}
              {tipOfTheDay.symptom && <Badge className="bg-red-100 text-red-700 border-red-300">Symptom Relief</Badge>}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">{tipOfTheDay.title}</h3>
              <p className="text-gray-600 leading-relaxed">{tipOfTheDay.content}</p>
              <div className="flex items-center justify-between">
                <Badge className={getCategoryColor(tipOfTheDay.category)}>
                  {tipOfTheDay.category.replace("-", " ")}
                </Badge>
                {!viewedTips.includes(tipOfTheDay.id) && (
                  <Button
                    size="sm"
                    onClick={() => markTipAsViewed(tipOfTheDay.id)}
                    className="bg-purple-500 hover:bg-purple-600"
                  >
                    Mark as Read
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-blue-500" />
              Today's Wellness Tips
              {getTotalSymptoms() > 0 && (
                <Badge variant="outline" className="text-xs">
                  Personalized
                </Badge>
              )}
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={refreshTips}
              className="flex items-center gap-2 bg-transparent"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {todaysTips.map((tip) => {
              const CategoryIcon = getCategoryIcon(tip.category)
              const isViewed = viewedTips.includes(tip.id)

              return (
                <div
                  key={tip.id}
                  className={`p-4 rounded-lg border transition-all duration-200 hover:shadow-md ${
                    isViewed ? "bg-gray-50 border-gray-200" : "bg-white border-gray-300 hover:border-purple-300"
                  } ${tip.symptom ? "ring-1 ring-red-200" : ""}`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`p-2 rounded-full ${isViewed ? "bg-gray-100" : tip.symptom ? "bg-red-50" : "bg-purple-50"}`}
                    >
                      <CategoryIcon className={`h-4 w-4 ${isViewed ? "text-gray-400" : tip.color}`} />
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <h4 className={`font-medium text-sm ${isViewed ? "text-gray-500" : "text-gray-800"}`}>
                          {tip.title}
                        </h4>
                        {tip.phase && (
                          <Badge variant="outline" className="text-xs">
                            {tip.phase}
                          </Badge>
                        )}
                        {tip.symptom && (
                          <Badge className="text-xs bg-red-100 text-red-700 border-red-300">Relief</Badge>
                        )}
                      </div>
                      <p className={`text-xs leading-relaxed ${isViewed ? "text-gray-400" : "text-gray-600"}`}>
                        {tip.content}
                      </p>
                      <div className="flex items-center justify-between">
                        <Badge className={`text-xs ${getCategoryColor(tip.category)}`}>
                          {tip.category.replace("-", " ")}
                        </Badge>
                        {!isViewed && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => markTipAsViewed(tip.id)}
                            className="text-xs h-6 px-2 text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                          >
                            <ChevronRight className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-green-50 to-emerald-50">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-green-600">{viewedTips.length}</div>
              <div className="text-sm text-gray-600">Tips Read This Month</div>
            </div>
            <div className="text-right">
              <div className="text-lg font-semibold text-emerald-600">
                {Math.round((viewedTips.length / wellnessTipsDatabase.length) * 100)}%
              </div>
              <div className="text-xs text-gray-500">Knowledge Progress</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
