"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { Lightbulb } from "lucide-react"
import {
  Zap,
  Brain,
  Droplets,
  Heart,
  Thermometer,
  Moon,
  Coffee,
  Smile,
  Frown,
  Meh,
  Angry,
  Laugh,
  TrendingUp,
  Clock,
  AlertCircle,
  CheckCircle2,
  Star,
  MessageSquare,
  BarChart3,
} from "lucide-react"

interface SymptomTrackerProps {
  onSymptomsUpdate: (symptoms: any) => void
  currentSymptoms: any
}

export default function SymptomTracker({ onSymptomsUpdate, currentSymptoms }: SymptomTrackerProps) {
  const [selectedSymptoms, setSelectedSymptoms] = useState(currentSymptoms || {})
  const [activeTab, setActiveTab] = useState("track")
  const [notes, setNotes] = useState("")

  const symptomCategories = {
    physical: {
      title: "Physical Symptoms",
      icon: Zap,
      color: "bg-gradient-to-r from-pink-100 to-rose-100 text-pink-700 border border-pink-200",
      symptoms: [
        { id: "cramps", name: "Cramps", icon: Zap, description: "Abdominal or pelvic pain" },
        { id: "headache", name: "Headache", icon: Brain, description: "Head pain or tension" },
        { id: "bloating", name: "Bloating", icon: Heart, description: "Feeling of fullness" },
        { id: "breast_tenderness", name: "Breast Tenderness", icon: Heart, description: "Breast sensitivity or pain" },
        { id: "fatigue", name: "Fatigue", icon: Moon, description: "Feeling tired or low energy" },
        { id: "nausea", name: "Nausea", icon: Coffee, description: "Feeling sick to stomach" },
        { id: "back_pain", name: "Back Pain", icon: Zap, description: "Lower back discomfort" },
        { id: "acne", name: "Acne", icon: Thermometer, description: "Skin breakouts" },
        { id: "hot_flashes", name: "Hot Flashes", icon: Thermometer, description: "Sudden feeling of heat" },
        { id: "joint_pain", name: "Joint Pain", icon: Zap, description: "Aches in joints" },
      ],
    },
    flow: {
      title: "Flow & Discharge",
      icon: Droplets,
      color: "bg-gradient-to-r from-purple-100 to-violet-100 text-purple-700 border border-purple-200",
      symptoms: [
        { id: "light_flow", name: "Light Flow", icon: Droplets, description: "Minimal bleeding" },
        { id: "medium_flow", name: "Medium Flow", icon: Droplets, description: "Moderate bleeding" },
        { id: "heavy_flow", name: "Heavy Flow", icon: Droplets, description: "Heavy bleeding" },
        { id: "spotting", name: "Spotting", icon: Droplets, description: "Light bleeding between periods" },
        { id: "clots", name: "Clots", icon: Droplets, description: "Blood clots in flow" },
        { id: "discharge_clear", name: "Clear Discharge", icon: Droplets, description: "Clear vaginal discharge" },
        { id: "discharge_white", name: "White Discharge", icon: Droplets, description: "White/creamy discharge" },
        { id: "discharge_yellow", name: "Yellow Discharge", icon: Droplets, description: "Yellow-tinted discharge" },
      ],
    },
    mood: {
      title: "Mood & Mental Health",
      icon: Smile,
      color: "bg-gradient-to-r from-lavender-100 to-pink-100 text-purple-600 border border-lavender-200",
      symptoms: [
        { id: "happy", name: "Happy", icon: Smile, description: "Feeling joyful and positive" },
        { id: "sad", name: "Sad", icon: Frown, description: "Feeling down or melancholy" },
        { id: "anxious", name: "Anxious", icon: Meh, description: "Feeling worried or nervous" },
        { id: "irritable", name: "Irritable", icon: Angry, description: "Easily annoyed or frustrated" },
        { id: "energetic", name: "Energetic", icon: Laugh, description: "Feeling active and vibrant" },
        { id: "calm", name: "Calm", icon: Smile, description: "Feeling peaceful and relaxed" },
        { id: "emotional", name: "Emotional", icon: Frown, description: "Heightened emotional sensitivity" },
        { id: "confident", name: "Confident", icon: Laugh, description: "Feeling self-assured" },
        { id: "focused", name: "Focused", icon: Brain, description: "Clear mental clarity" },
        { id: "brain_fog", name: "Brain Fog", icon: Brain, description: "Difficulty concentrating" },
      ],
    },
  }

  const toggleSymptom = (categoryId: string, symptomId: string, severity = 3) => {
    const newSymptoms = { ...selectedSymptoms }
    if (!newSymptoms[categoryId]) {
      newSymptoms[categoryId] = {}
    }

    if (newSymptoms[categoryId][symptomId]) {
      delete newSymptoms[categoryId][symptomId]
    } else {
      newSymptoms[categoryId][symptomId] = {
        severity,
        timestamp: new Date().toISOString(),
        notes: "",
      }
    }

    setSelectedSymptoms(newSymptoms)
    onSymptomsUpdate(newSymptoms)
  }

  const updateSeverity = (categoryId: string, symptomId: string, severity: number) => {
    const newSymptoms = { ...selectedSymptoms }
    if (newSymptoms[categoryId]?.[symptomId]) {
      newSymptoms[categoryId][symptomId].severity = severity
      setSelectedSymptoms(newSymptoms)
      onSymptomsUpdate(newSymptoms)
    }
  }

  const isSelected = (categoryId: string, symptomId: string) => {
    return !!selectedSymptoms[categoryId]?.[symptomId]
  }

  const getSeverity = (categoryId: string, symptomId: string) => {
    return selectedSymptoms[categoryId]?.[symptomId]?.severity || 3
  }

  const getSeverityColor = (severity: number) => {
    if (severity <= 2) return "bg-green-100 text-green-700 border-green-200"
    if (severity <= 4) return "bg-yellow-100 text-yellow-700 border-yellow-200"
    return "bg-red-100 text-red-700 border-red-200"
  }

  const getSeverityLabel = (severity: number) => {
    if (severity <= 2) return "Mild"
    if (severity <= 4) return "Moderate"
    return "Severe"
  }

  const getTotalSymptoms = () => {
    return Object.values(selectedSymptoms).reduce((total, category: any) => {
      return total + Object.keys(category || {}).length
    }, 0)
  }

  const getAverageSeverity = () => {
    let totalSeverity = 0
    let count = 0
    Object.values(selectedSymptoms).forEach((category: any) => {
      Object.values(category || {}).forEach((symptom: any) => {
        if (symptom && typeof symptom.severity === "number") {
          totalSeverity += symptom.severity
          count++
        }
      })
    })
    return count > 0 ? (totalSeverity / count).toFixed(1) : "0.0"
  }

  const getAverageSeverityNumber = () => {
    let totalSeverity = 0
    let count = 0
    Object.values(selectedSymptoms).forEach((category: any) => {
      Object.values(category || {}).forEach((symptom: any) => {
        if (symptom && typeof symptom.severity === "number") {
          totalSeverity += symptom.severity
          count++
        }
      })
    })
    return count > 0 ? totalSeverity / count : 0
  }

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="text-center space-y-4">
        <h3 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
          How are you feeling today?
        </h3>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Track your symptoms with detailed severity levels to understand your cycle patterns and improve your wellness
          journey
        </p>

        {/* Quick Stats */}
        <div className="flex justify-center gap-6 mt-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-pink-600">{getTotalSymptoms()}</div>
            <div className="text-sm text-gray-500">Symptoms Today</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{getAverageSeverity()}</div>
            <div className="text-sm text-gray-500">Avg Severity</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-rose-600">
              {getTotalSymptoms() > 0 ? getSeverityLabel(getAverageSeverityNumber()) : "None"}
            </div>
            <div className="text-sm text-gray-500">Overall Level</div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex justify-center">
        <div className="bg-white rounded-xl p-1 shadow-lg border">
          <Button
            variant={activeTab === "track" ? "default" : "ghost"}
            onClick={() => setActiveTab("track")}
            className={`px-6 py-2 rounded-lg transition-all ${
              activeTab === "track"
                ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-md"
                : "text-gray-600 hover:text-pink-600"
            }`}
          >
            <Zap className="h-4 w-4 mr-2" />
            Track Symptoms
          </Button>
          <Button
            variant={activeTab === "insights" ? "default" : "ghost"}
            onClick={() => setActiveTab("insights")}
            className={`px-6 py-2 rounded-lg transition-all ${
              activeTab === "insights"
                ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-md"
                : "text-gray-600 hover:text-pink-600"
            }`}
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            Insights
          </Button>
          <Button
            variant={activeTab === "tips" ? "default" : "ghost"}
            onClick={() => setActiveTab("tips")}
            className={`px-6 py-2 rounded-lg transition-all ${
              activeTab === "tips"
                ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-md"
                : "text-gray-600 hover:text-pink-600"
            }`}
          >
            <Lightbulb className="h-4 w-4 mr-2" />
            Tips
          </Button>
        </div>
      </div>

      {activeTab === "track" && (
        <>
          {/* Symptom Categories */}
          {Object.entries(symptomCategories).map(([categoryId, category]) => (
            <Card
              key={categoryId}
              className="bg-white/95 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <CardHeader className="pb-6">
                <CardTitle
                  className={`flex items-center gap-3 p-4 rounded-xl ${category.color} font-semibold text-lg shadow-sm`}
                >
                  <category.icon className="h-6 w-6" />
                  {category.title}
                  <Badge variant="secondary" className="ml-auto bg-white/50">
                    {Object.keys(selectedSymptoms[categoryId] || {}).length} selected
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {category.symptoms.map((symptom) => (
                    <div key={symptom.id} className="space-y-3 p-2">
                      <Button
                        variant={isSelected(categoryId, symptom.id) ? "default" : "outline"}
                        onClick={() => toggleSymptom(categoryId, symptom.id)}
                        className={`w-full h-auto p-4 flex flex-col items-start gap-2 transition-all duration-200 ${
                          isSelected(categoryId, symptom.id)
                            ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg scale-105"
                            : "hover:bg-pink-50 hover:border-pink-300 hover:shadow-md"
                        }`}
                      >
                        <div className="flex items-center gap-2 w-full">
                          <symptom.icon className="h-5 w-5" />
                          <span className="font-medium">{symptom.name}</span>
                          {isSelected(categoryId, symptom.id) && <CheckCircle2 className="h-4 w-4 ml-auto" />}
                        </div>
                        <p className="text-xs opacity-80 text-left">{symptom.description}</p>
                      </Button>

                      {/* Severity Slider */}
                      {isSelected(categoryId, symptom.id) && (
                        <div className="space-y-2 p-3 bg-gray-50 rounded-lg mt-3 mb-4">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-700">Severity</span>
                            <Badge className={`text-xs ${getSeverityColor(getSeverity(categoryId, symptom.id))}`}>
                              {getSeverityLabel(getSeverity(categoryId, symptom.id))} (
                              {getSeverity(categoryId, symptom.id)}/5)
                            </Badge>
                          </div>
                          <Slider
                            value={[getSeverity(categoryId, symptom.id)]}
                            onValueChange={(value) => updateSeverity(categoryId, symptom.id, value[0])}
                            max={5}
                            min={1}
                            step={1}
                            className="w-full"
                          />
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>Mild</span>
                            <span>Moderate</span>
                            <span>Severe</span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Notes Section */}
          <Card className="bg-gradient-to-r from-pink-50 to-purple-50 border-pink-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-pink-700">
                <MessageSquare className="h-5 w-5" />
                Daily Notes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Add any additional notes about how you're feeling today, what might have triggered symptoms, or anything else you'd like to remember..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="min-h-[100px] border-pink-200 focus:border-pink-400"
              />
            </CardContent>
          </Card>
        </>
      )}

      {activeTab === "insights" && (
        <Card className="bg-gradient-to-br from-pink-50 to-purple-50 border-pink-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-pink-700">
              <TrendingUp className="h-5 w-5" />
              Symptom Insights & Patterns
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {getTotalSymptoms() > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                    <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-red-600">
                      {Object.values(selectedSymptoms).reduce((count, category: any) => {
                        return count + Object.values(category || {}).filter((s: any) => s.severity >= 4).length
                      }, 0)}
                    </div>
                    <div className="text-sm text-gray-600">High Severity</div>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                    <Clock className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-blue-600">{new Date().toLocaleDateString()}</div>
                    <div className="text-sm text-gray-600">Today's Date</div>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                    <Star className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-yellow-600">
                      {getTotalSymptoms() <= 3 ? "Good" : getTotalSymptoms() <= 6 ? "Fair" : "Challenging"}
                    </div>
                    <div className="text-sm text-gray-500">Day Rating</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-800">Today's Summary</h4>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(selectedSymptoms).map(([categoryId, symptoms]: [string, any]) =>
                      Object.entries(symptoms || {}).map(([symptomId, data]: [string, any]) => {
                        const category = symptomCategories[categoryId as keyof typeof symptomCategories]
                        const symptom = category.symptoms.find((s) => s.id === symptomId)
                        return symptom ? (
                          <Badge
                            key={`${categoryId}-${symptomId}`}
                            className={`${getSeverityColor(data.severity)} px-3 py-1`}
                          >
                            {symptom.name} ({data.severity}/5)
                          </Badge>
                        ) : null
                      }),
                    )}
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h4 className="font-semibold text-gray-800 mb-2">Wellness Tips</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    {getAverageSeverity() > 3 && (
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        Consider gentle exercise like yoga or walking to help manage symptoms
                      </li>
                    )}
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      Stay hydrated and maintain a balanced diet rich in nutrients
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      Track patterns over time to identify triggers and effective remedies
                    </li>
                  </ul>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <Smile className="h-16 w-16 text-pink-400 mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-gray-700 mb-2">No symptoms tracked today</h4>
                <p className="text-gray-500">Start tracking your symptoms to see insights and patterns here</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {activeTab === "tips" && (
        <Card className="bg-gradient-to-br from-pink-50 to-purple-50 border-pink-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-pink-700">
              <Lightbulb className="h-5 w-5" />
              Personalized Tips for Your Symptoms
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {getTotalSymptoms() > 0 ? (
              <div className="space-y-4">
                {/* Tips based on physical symptoms */}
                {selectedSymptoms.physical && Object.keys(selectedSymptoms.physical).length > 0 && (
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <h4 className="font-semibold text-pink-700 mb-3 flex items-center gap-2">
                      <Zap className="h-4 w-4" />
                      Physical Symptom Relief
                    </h4>
                    <div className="space-y-2 text-sm text-gray-600">
                      {selectedSymptoms.physical.cramps && (
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>Apply heat to your lower abdomen or back, try gentle stretching or yoga poses</span>
                        </div>
                      )}
                      {selectedSymptoms.physical.headache && (
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>Stay hydrated, rest in a dark room, and consider gentle neck stretches</span>
                        </div>
                      )}
                      {selectedSymptoms.physical.bloating && (
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>Avoid salty foods, drink peppermint tea, and try gentle abdominal massage</span>
                        </div>
                      )}
                      {selectedSymptoms.physical.fatigue && (
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>Prioritize sleep, eat iron-rich foods, and take short walks for energy</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Tips based on mood symptoms */}
                {selectedSymptoms.mood && Object.keys(selectedSymptoms.mood).length > 0 && (
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <h4 className="font-semibold text-purple-700 mb-3 flex items-center gap-2">
                      <Smile className="h-4 w-4" />
                      Mood & Mental Wellness
                    </h4>
                    <div className="space-y-2 text-sm text-gray-600">
                      {selectedSymptoms.mood.anxious && (
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>Practice deep breathing exercises, try meditation, or listen to calming music</span>
                        </div>
                      )}
                      {selectedSymptoms.mood.irritable && (
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>
                            Take breaks when needed, practice patience with yourself, and communicate your needs
                          </span>
                        </div>
                      )}
                      {selectedSymptoms.mood.sad && (
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>
                            Reach out to friends, engage in activities you enjoy, and practice self-compassion
                          </span>
                        </div>
                      )}
                      {selectedSymptoms.mood.brain_fog && (
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>Break tasks into smaller steps, stay organized with lists, and take mental breaks</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* General wellness tips */}
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h4 className="font-semibold text-rose-700 mb-3 flex items-center gap-2">
                    <Heart className="h-4 w-4" />
                    General Wellness
                  </h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Maintain a balanced diet rich in fruits, vegetables, and whole grains</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Stay hydrated by drinking plenty of water throughout the day</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Get adequate sleep (7-9 hours) to support your body's natural healing</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Lightbulb className="h-16 w-16 text-pink-400 mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-gray-700 mb-2">No symptoms to provide tips for</h4>
                <p className="text-gray-500">Track your symptoms first to get personalized wellness tips and advice</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
