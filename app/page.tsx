"use client"

import React, { useState, useEffect } from 'react'
import { Sidebar } from "@/components/sidebar"
import { ModeToggle } from "@/components/ui/mode-toggle"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Calendar } from "@/components/ui/calendar"
import Link from "next/link"
import { FolderKanban, CheckSquare, Calendar as CalendarIcon } from "lucide-react"
import { addDays, startOfWeek, format } from "date-fns"

type Project = {
  id: string
  name: string
  progress: number
}

type Task = {
  id: string
  title: string
  status: "todo" | "inProgress" | "done"
  dueDate: Date
}

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())

  useEffect(() => {
    // Simulating API calls to fetch projects and tasks
    const fetchData = async () => {
      // In a real application, these would be API calls
      const mockProjects: Project[] = [
        { id: "1", name: "Website Redesign", progress: 65 },
        { id: "2", name: "Mobile App", progress: 30 },
        { id: "3", name: "Backend Services", progress: 80 },
      ]
      setProjects(mockProjects)

      const mockTasks: Task[] = [
        { id: "1", title: "Design UI mockups", status: "inProgress", dueDate: new Date(2023, 6, 15) },
        { id: "2", title: "Implement authentication", status: "todo", dueDate: new Date(2023, 6, 20) },
        { id: "3", title: "Write API documentation", status: "done", dueDate: new Date(2023, 6, 10) },
        { id: "4", title: "Set up CI/CD pipeline", status: "inProgress", dueDate: new Date(2023, 6, 18) },
      ]
      setTasks(mockTasks)
    }
    fetchData()
  }, [])

  const weekStart = startOfWeek(selectedDate)
  const weekDates = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))

  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 p-6 overflow-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <ModeToggle />
        </div>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Your Projects</h2>
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <Card key={project.id}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    <Link href={`/projects/${project.id}`} className="hover:underline">
                      {project.name}
                    </Link>
                  </CardTitle>
                  <FolderKanban className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <Progress value={project.progress} className="mb-2" />
                  <span className="text-sm text-muted-foreground">{project.progress}% complete</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Your Tasks</h2>
          <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
            {["todo", "inProgress", "done"].map((status) => (
              <Card key={status}>
                <CardHeader>
                  <CardTitle className="capitalize">{status.replace(/([A-Z])/g, ' $1').trim()}</CardTitle>
                </CardHeader>
                <CardContent>
                  {tasks
                    .filter((task) => task.status === status)
                    .map((task) => (
                      <div key={task.id} className="mb-2 p-2 bg-secondary rounded">
                        <p className="font-medium">{task.title}</p>
                        <p className="text-sm text-muted-foreground">Due: {format(task.dueDate, 'MMM d, yyyy')}</p>
                      </div>
                    ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Weekly Calendar</h2>
          <Card>
            <CardContent>
              <div className="grid grid-cols-7 gap-2">
                {weekDates.map((date) => (
                  <div key={date.toString()} className="text-center">
                    <p className="font-medium">{format(date, 'EEE')}</p>
                    <p className="text-sm text-muted-foreground">{format(date, 'd')}</p>
                    {tasks
                      .filter((task) => format(task.dueDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd'))
                      .map((task) => (
                        <div
                          key={task.id}
                          className={`mt-1 p-1 text-xs rounded ${
                            task.status === 'todo' ? 'bg-yellow-200 text-yellow-800' :
                            task.status === 'inProgress' ? 'bg-blue-200 text-blue-800' :
                            'bg-green-200 text-green-800'
                          }`}
                        >
                          {task.title}
                        </div>
                      ))}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  )
}