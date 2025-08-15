"use client"

import { useState, useEffect } from "react"
import { Trophy, Star, Flame, Heart, Target, Calendar, Award, Crown, Sparkles, Medal } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

interface Achievement {
  id: string
  title: string
  description: string
  icon: any
  category: "streak" | "tracking" | "wellness" | "milestone"
  requirement: number
  currentProgress: number
  isUnlocked: boolean
  unlockedDate?: string
  color: string
  rarity: "common" | "rare" | "epic" | "legendary"
}

interface UserStats {
  totalCheckIns: number
  currentStreak: number
  longestStreak: number
  totalGoalsCompleted: number
  daysTracked: number
  periodsTracked: number
  symptomsLogged: number
}

export default function Achievements() {
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [userStats, setUserStats] = useState<UserStats>({
    totalCheckIns: 0,
    currentStreak: 0,
    longestStreak: 0,
    totalGoalsCompleted: 0,
    daysTracked: 0,
    periodsTracked: 0,
    symptomsLogged: 0,
  })
  const [newlyUnlocked, setNewlyUnlocked] = useState<Achievement[]>([])

  const achievementDefinitions: Omit<Achievement, "currentProgress" | "isUnlocked" | "unlockedDate">[] = [
    // Streak Achievements
    {
      id: "first_checkin",
      title: "Getting Started",
      description: "Complete your first daily check-in",
      icon: Heart,
      category: "streak",
      requirement: 1,
      color: "text-pink-500",
      rarity: "common",
    },
    {
      id: "week_warrior",
      title: "Week Warrior",
      description: "Maintain a 7-day check-in streak",
      icon: Flame,
      category: "streak",
      requirement: 7,
      color: "text-orange-500",
      rarity: "common",
    },
    {
      id: "month_master",
      title: "Month Master",
      description: "Maintain a 30-day check-in streak",
      icon: Trophy,
      category: "streak",
      requirement: 30,
      color: "text-yellow-500",
      rarity: "rare",
    },
    {
      id: "streak_legend",
      title: "Streak Legend",
      description: "Maintain a 100-day check-in streak",
      icon: Crown,
      category: "streak",
      requirement: 100,
      color: "text-purple-500",
      rarity: "legendary",
    },

    // Tracking Achievements
    {
      id: "period_tracker",
      title: "Period Tracker",
      description: "Track your first period",
      icon: Calendar,
      category: "tracking",
      requirement: 1,
      color: "text-red-500",
      rarity: "common",
    },
    {
      id: "cycle_expert",
      title: "Cycle Expert",
      description: "Track 5 complete cycles",
      icon: Star,
      category: "tracking",
      requirement: 5,
      color: "text-blue-500",
      rarity: "rare",
    },
    {
      id: "symptom_logger",
      title: "Symptom Logger",
      description: "Log symptoms for 10 days",
      icon: Target,
      category: "tracking",
      requirement: 10,
      color: "text-green-500",
      rarity: "common",
    },

    // Wellness Achievements
    {
      id: "goal_getter",
      title: "Goal Getter",
      description: "Complete 25 wellness goals",
      icon: Award,
      category: "wellness",
      requirement: 25,
      color: "text-emerald-500",
      rarity: "rare",
    },
    {
      id: "wellness_warrior",
      title: "Wellness Warrior",
      description: "Complete 100 wellness goals",
      icon: Medal,
      category: "wellness",
      requirement: 100,
      color: "text-indigo-500",
      rarity: "epic",
    },

    // Milestone Achievements
    {
      id: "dedicated_tracker",
      title: "Dedicated Tracker",
      description: "Use the app for 50 total days",
      icon: Sparkles,
      category: "milestone",
      requirement: 50,
      color: "text-violet-500",
      rarity: "epic",
    },
  ]

  useEffect(() => {
    loadUserStats()
    updateAchievements()
  }, [])

  const loadUserStats = () => {
    try {
      // Load from various localStorage sources
      const checkInHistory = JSON.parse(localStorage.getItem("dailyCheckInHistory") || "[]")
      const currentStreak = Number.parseInt(localStorage.getItem("dailyStreak") || "0")
      const symptomHistory = JSON.parse(localStorage.getItem("symptomHistory") || "[]")
      const lastPeriodDate = localStorage.getItem("lastPeriodDate")

      // Calculate total goals completed
      const totalGoalsCompleted = checkInHistory.reduce((total: number, entry: any) => {
        return total + (entry.completedGoals?.length || 0)
      }, 0)

      // Calculate periods tracked (simplified - could be more sophisticated)
      const periodsTracked = lastPeriodDate ? 1 : 0

      const stats: UserStats = {
        totalCheckIns: checkInHistory.length,
        currentStreak,
        longestStreak: currentStreak, // Simplified - could track historical max
        totalGoalsCompleted,
        daysTracked: checkInHistory.length,
        periodsTracked,
        symptomsLogged: symptomHistory.length,
      }

      setUserStats(stats)
    } catch (error) {
      console.error("Error loading user stats:", error)
    }
  }

  const updateAchievements = () => {
    try {
      const savedAchievements = JSON.parse(localStorage.getItem("userAchievements") || "[]")

      const updatedAchievements = achievementDefinitions.map((def) => {
        const saved = savedAchievements.find((a: Achievement) => a.id === def.id)

        let currentProgress = 0
        switch (def.category) {
          case "streak":
            currentProgress = userStats.currentStreak
            break
          case "tracking":
            if (def.id === "period_tracker") currentProgress = userStats.periodsTracked
            else if (def.id === "cycle_expert") currentProgress = userStats.periodsTracked
            else if (def.id === "symptom_logger") currentProgress = userStats.symptomsLogged
            break
          case "wellness":
            currentProgress = userStats.totalGoalsCompleted
            break
          case "milestone":
            currentProgress = userStats.daysTracked
            break
        }

        const isUnlocked = currentProgress >= def.requirement
        const wasUnlocked = saved?.isUnlocked || false

        // Check for newly unlocked achievements
        if (isUnlocked && !wasUnlocked) {
          const newAchievement = {
            ...def,
            currentProgress,
            isUnlocked: true,
            unlockedDate: new Date().toISOString(),
          }
          setNewlyUnlocked((prev) => [...prev, newAchievement])
        }

        return {
          ...def,
          currentProgress,
          isUnlocked,
          unlockedDate: saved?.unlockedDate || (isUnlocked ? new Date().toISOString() : undefined),
        }
      })

      setAchievements(updatedAchievements)
      localStorage.setItem("userAchievements", JSON.stringify(updatedAchievements))
    } catch (error) {
      console.error("Error updating achievements:", error)
    }
  }

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common":
        return "bg-gray-100 text-gray-700 border-gray-300"
      case "rare":
        return "bg-blue-100 text-blue-700 border-blue-300"
      case "epic":
        return "bg-purple-100 text-purple-700 border-purple-300"
      case "legendary":
        return "bg-yellow-100 text-yellow-700 border-yellow-300"
      default:
        return "bg-gray-100 text-gray-700 border-gray-300"
    }
  }

  const unlockedAchievements = achievements.filter((a) => a.isUnlocked)
  const lockedAchievements = achievements.filter((a) => !a.isUnlocked)

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <Card className="bg-gradient-to-br from-purple-50 to-pink-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            Your Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{userStats.currentStreak}</div>
              <div className="text-xs text-gray-600">Current Streak</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-pink-600">{userStats.totalCheckIns}</div>
              <div className="text-xs text-gray-600">Total Check-ins</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{userStats.totalGoalsCompleted}</div>
              <div className="text-xs text-gray-600">Goals Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{unlockedAchievements.length}</div>
              <div className="text-xs text-gray-600">Achievements</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Unlocked Achievements */}
      {unlockedAchievements.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-yellow-500" />
              Unlocked Achievements ({unlockedAchievements.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {unlockedAchievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200"
                >
                  <div className="p-2 bg-white rounded-full shadow-sm">
                    <achievement.icon className={`h-5 w-5 ${achievement.color}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-sm text-gray-800">{achievement.title}</h4>
                      <Badge className={`text-xs ${getRarityColor(achievement.rarity)}`}>{achievement.rarity}</Badge>
                    </div>
                    <p className="text-xs text-gray-600">{achievement.description}</p>
                    {achievement.unlockedDate && (
                      <p className="text-xs text-green-600 mt-1">
                        Unlocked {new Date(achievement.unlockedDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Locked Achievements */}
      {lockedAchievements.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-gray-500" />
              In Progress ({lockedAchievements.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {lockedAchievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200 opacity-75"
                >
                  <div className="p-2 bg-white rounded-full shadow-sm">
                    <achievement.icon className="h-5 w-5 text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-sm text-gray-600">{achievement.title}</h4>
                      <Badge className={`text-xs ${getRarityColor(achievement.rarity)}`}>{achievement.rarity}</Badge>
                    </div>
                    <p className="text-xs text-gray-500 mb-2">{achievement.description}</p>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500">Progress</span>
                        <span className="text-gray-600">
                          {Math.min(achievement.currentProgress, achievement.requirement)}/{achievement.requirement}
                        </span>
                      </div>
                      <Progress value={(achievement.currentProgress / achievement.requirement) * 100} className="h-1" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Achievement Categories */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {["streak", "tracking", "wellness", "milestone"].map((category) => {
          const categoryAchievements = achievements.filter((a) => a.category === category)
          const unlockedCount = categoryAchievements.filter((a) => a.isUnlocked).length

          return (
            <Card key={category} className="text-center">
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-purple-600 mb-1">
                  {unlockedCount}/{categoryAchievements.length}
                </div>
                <div className="text-sm text-gray-600 capitalize">{category}</div>
                <Progress value={(unlockedCount / categoryAchievements.length) * 100} className="mt-2 h-2" />
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
