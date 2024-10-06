"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Sidebar } from "@/components/sidebar"
import { ModeToggle } from "@/components/ui/mode-toggle"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Plus, Paperclip } from "lucide-react"

type Project = {
  id: string
  name: string
  description: string
  tasks: Array<{
    id: string
    title: string
    status: "todo" | "inProgress" | "done"
    assignedTo: string
  }>
  documents: Array<{
    id: string
    name: string
    url: string
    taskId?: string
  }>
}

export default function ProjectDetailPage() {
  const params = useParams()
  const [project, setProject] = useState<Project | null>(null)
  const [newTaskTitle, setNewTaskTitle] = useState("")

  useEffect(() => {
    // Fetch project data (mock data for now)
    const mockProject: Project = {
      id: params.id as string,
      name: "Project Alpha",
      description: "This is a sample project description.",
      tasks: [
        { id: "1", title: "Design UI", status: "done", assignedTo: "Alice" },
        { id: "2", title: "Implement backend", status: "inProgress", assignedTo: "Bob" },
        { id: "3", title: "Write tests", status: "todo", assignedTo: "Charlie" },
      ],
      documents: [
        { id: "doc1", name: "Project Proposal.pdf", url: "#" },
        { id: "doc2", name: "UI Mockups.fig", url: "#", taskId: "1" },
        { id: "doc3", name: "API Specs.md", url: "#", taskId: "2" },
      ]
    }
    setProject(mockProject)
  }, [params.id])

  const addTask = () => {
    if (newTaskTitle.trim() !== "" && project) {
      const newTask = {
        id: Date.now().toString(),
        title: newTaskTitle,
        status: "todo" as const,
        assignedTo: "Unassigned"
      }
      setProject({
        ...project,
        tasks: [...project.tasks, newTask]
      })
      setNewTaskTitle("")
    }
  }

  if (!project) {
    return <div>Loading...</div>
  }

  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 p-6 overflow-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">{project.name}</h1>
          <ModeToggle />
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Project Details</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{project.description}</p>
          </CardContent>
        </Card>

        <Tabs defaultValue="tasks" className="mb-6">
          <TabsList>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
          </TabsList>
          <TabsContent value="tasks">
            <div className="mb-4 flex">
              <Input
                type="text"
                placeholder="New task title"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                className="mr-2"
              />
              <Button onClick={addTask}>
                <Plus className="w-4 h-4 mr-2" />
                Add Task
              </Button>
            </div>
            <div className="space-y-4">
              {project.tasks.map((task) => (
                <Link href={`/tasks/${task.id}`} key={task.id}>
                  <Card className="hover:bg-accent transition-colors">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">{task.title}</CardTitle>
                      <div className={`px-2 py-1 rounded text-xs ${
                        task.status === 'todo' ? 'bg-yellow-200 text-yellow-800' :
                        task.status === 'inProgress' ? 'bg-blue-200 text-blue-800' :
                        'bg-green-200 text-green-800'
                      }`}>
                        {task.status}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">Assigned to: {task.assignedTo}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="documents">
            <div className="space-y-4">
              {project.documents.map((doc) => (
                <Card key={doc.id}>
                  <CardContent className="flex items-center justify-between p-4">
                    <div className="flex items-center">
                      <Paperclip className="w-4 h-4 mr-2" />
                      <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-sm font-medium">
                        {doc.name}
                      </a>
                    </div>
                    {doc.taskId && (
                      <Link href={`/tasks/${doc.taskId}`} className="text-xs text-muted-foreground hover:underline">
                        View associated task
                      </Link>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="team">Team management coming soon...</TabsContent>
        </Tabs>
      </main>
    </div>
  )
}