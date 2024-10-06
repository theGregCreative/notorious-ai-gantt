"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Sidebar } from "@/components/sidebar"
import { ModeToggle } from "@/components/ui/mode-toggle"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, CheckSquare, Clock, AlertCircle } from "lucide-react"

type Task = {
  id: string
  title: string
  status: "todo" | "inProgress" | "done"
  dueDate: string
  projectId: string
}

type Project = {
  id: string
  name: string
  progress: number
}

const loadProjects = (): Project[] => {
  const saved = localStorage.getItem('projects')
  return saved ? JSON.parse(saved) : []
}

const saveTasks = (tasks: Task[]) => {
  localStorage.setItem('tasks', JSON.stringify(tasks))
}

const loadTasks = (): Task[] => {
  const saved = localStorage.getItem('tasks')
  return saved ? JSON.parse(saved) : []
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [newTaskTitle, setNewTaskTitle] = useState("")
  const [newTaskProject, setNewTaskProject] = useState("")

  useEffect(() => {
    setProjects(loadProjects())
    setTasks(loadTasks())
  }, [])

  const addTask = () => {
    if (newTaskTitle.trim() !== "" && newTaskProject !== "") {
      const newTask: Task = {
        id: Date.now().toString(),
        title: newTaskTitle,
        status: "todo",
        dueDate: new Date().toISOString().split('T')[0], // Set due date to today
        projectId: newTaskProject
      }
      const updatedTasks = [...tasks, newTask]
      setTasks(updatedTasks)
      saveTasks(updatedTasks)
      setNewTaskTitle("")
      setNewTaskProject("")
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "todo":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      case "inProgress":
        return <Clock className="h-4 w-4 text-blue-500" />
      case "done":
        return <CheckSquare className="h-4 w-4 text-green-500" />
      default:
        return null
    }
  }

  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 p-6 overflow-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Tasks</h1>
          <ModeToggle />
        </div>

        <div className="mb-4 flex">
          <Input
            type="text"
            placeholder="New task title"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            className="mr-2"
          />
          <Select value={newTaskProject} onValueChange={setNewTaskProject}>
            <SelectTrigger className="w-[180px] mr-2">
              <SelectValue placeholder="Select project" />
            </SelectTrigger>
            <SelectContent>
              {projects.map(project => (
                <SelectItem key={project.id} value={project.id}>{project.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={addTask}>
            <Plus className="h-4 w-4 mr-2" /> Add Task
          </Button>
        </div>

        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {tasks.map((task) => (
            <Link href={`/tasks/${task.id}`} key={task.id}>
              <Card className="hover:bg-accent transition-colors">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{task.title}</CardTitle>
                  {getStatusIcon(task.status)}
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">Due: {task.dueDate}</p>
                  <p className="text-xs text-muted-foreground">
                    Project: {projects.find(p => p.id === task.projectId)?.name || 'Unknown'}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}