"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/sidebar"
import { ModeToggle } from "@/components/ui/mode-toggle"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { addMonths, subMonths, startOfWeek, endOfWeek, startOfDay, endOfDay, eachDayOfInterval, format, isSameMonth, isSameDay, startOfMonth, endOfMonth } from "date-fns"

type CalendarView = "day" | "week" | "month" | "quarter"

export default function CalendarPage() {
  const [date, setDate] = useState<Date>(new Date())
  const [view, setView] = useState<CalendarView>("month")

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey) {
        if (event.key === "d") {
          setView("day")
        } else if (event.key === "w") {
          setView("week")
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  const navigateDate = (amount: number) => {
    if (view === "day") {
      setDate(prevDate => new Date(prevDate.setDate(prevDate.getDate() + amount)))
    } else if (view === "week") {
      setDate(prevDate => new Date(prevDate.setDate(prevDate.getDate() + amount * 7)))
    } else {
      setDate(amount > 0 ? addMonths(date, 1) : subMonths(date, 1))
    }
  }

  const renderDayView = () => {
    const events = [] // You would fetch events for this day here
    return (
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">{format(date, "MMMM d, yyyy")}</h2>
        {eachDayOfInterval({ start: startOfDay(date), end: endOfDay(date) }).map((hour, idx) => (
          <Card key={idx}>
            <CardContent className="p-2">
              {format(hour, "h:mm a")}
              {/* Render events here */}
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const renderWeekView = () => {
    const start = startOfWeek(date)
    const end = endOfWeek(date)
    const days = eachDayOfInterval({ start, end })

    return (
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Week of {format(start, "MMMM d, yyyy")}</h2>
        <div className="grid grid-cols-7 gap-2">
          {days.map((day, idx) => (
            <Card key={idx}>
              <CardContent className="p-2">
                <div className="font-semibold">{format(day, "EEE")}</div>
                <div>{format(day, "d")}</div>
                {/* Render events for each day here */}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  const renderMonthView = () => {
    return (
      <Calendar
        mode="single"
        selected={date}
        onSelect={(newDate) => newDate && setDate(newDate)}
        className="rounded-md border shadow"
      />
    )
  }

  const renderQuarterView = () => {
    const currentMonth = date.getMonth()
    const quarterStart = currentMonth - (currentMonth % 3)
    const months = [0, 1, 2].map(i => new Date(date.getFullYear(), quarterStart + i, 1))

    return (
      <div className="grid grid-cols-3 gap-4">
        {months.map((month, idx) => (
          <Card key={idx}>
            <CardContent className="p-2">
              <h3 className="text-lg font-semibold mb-2">{format(month, "MMMM yyyy")}</h3>
              <div className="grid grid-cols-7 gap-1 text-xs">
                {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(day => (
                  <div key={day} className="text-center font-semibold">{day}</div>
                ))}
                {eachDayOfInterval({
                  start: startOfMonth(month),
                  end: endOfMonth(month)
                }).map((day, dayIdx) => (
                  <div
                    key={dayIdx}
                    className={`text-center p-1 ${
                      !isSameMonth(day, month) ? "text-gray-300" :
                      isSameDay(day, new Date()) ? "bg-primary text-primary-foreground rounded-full" : ""
                    }`}
                  >
                    {format(day, "d")}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 p-6 overflow-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Calendar</h1>
          <ModeToggle />
        </div>
        <div className="mb-4 flex justify-between items-center">
          <div>
            <Button onClick={() => setView("day")} variant={view === "day" ? "default" : "outline"} className="mr-2">Day</Button>
            <Button onClick={() => setView("week")} variant={view === "week" ? "default" : "outline"} className="mr-2">Week</Button>
            <Button onClick={() => setView("month")} variant={view === "month" ? "default" : "outline"} className="mr-2">Month</Button>
            <Button onClick={() => setView("quarter")} variant={view === "quarter" ? "default" : "outline"}>Quarter</Button>
          </div>
          <div>
            <Button onClick={() => navigateDate(-1)} variant="outline" className="mr-2"><ChevronLeft className="h-4 w-4" /></Button>
            <Button onClick={() => setDate(new Date())} variant="outline" className="mr-2">Today</Button>
            <Button onClick={() => navigateDate(1)} variant="outline"><ChevronRight className="h-4 w-4" /></Button>
          </div>
        </div>
        {view === "day" && renderDayView()}
        {view === "week" && renderWeekView()}
        {view === "month" && renderMonthView()}
        {view === "quarter" && renderQuarterView()}
      </main>
    </div>
  )
}