"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Sidebar } from "@/components/sidebar"
import { ModeToggle } from "@/components/ui/mode-toggle"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus } from "lucide-react"

type Project = {
  id: string
  name: string
  progress: number
}

// This would typically be a database or API call in a real application
const saveProjects = (projects: Project[]) => {
  localStorage.setItem('projects', JSON.stringify(projects))
}

const loadProjects = (): Project[] => {
  const saved = localStorage.getItem('projects')
  return saved ? JSON.parse(saved) : []
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [newProjectName, setNewProjectName] = useState("")

  useEffect(() => {
    setProjects(loadProjects())
  }, [])

  const addProject = () => {
    if (newProjectName.trim() !== "") {
      const newProject: Project = {
        id: Date.now().toString(),
        name: newProjectName,
        progress: 0
      }
      const updatedProjects = [...projects, newProject]
      setProjects(updatedProjects)
      saveProjects(updatedProjects)
      setNewProjectName("")
    }
  }

  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 p-6 overflow-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Projects</h1>
          <ModeToggle />
        </div>

        <div className="mb-4 flex">
          <Input
            type="text"
            placeholder="New project name"
            value={newProjectName}
            onChange={(e) => setNewProjectName(e.target.value)}
            className="mr-2"
          />
          <Button onClick={addProject}>
            <Plus className="w-4 h-4 mr-2" />
            Add Project
          </Button>
        </div>

        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Card key={project.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-lg font-medium">
                  <Link href={`/projects/${project.id}`} className="hover:underline">
                    {project.name}
                  </Link>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Progress value={project.progress} className="mb-2" />
                <span className="text-sm text-muted-foreground">{project.progress}% complete</span>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}