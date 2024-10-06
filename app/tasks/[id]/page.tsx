"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Sidebar } from "@/components/sidebar"
import { ModeToggle } from "@/components/ui/mode-toggle"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Paperclip, X, File } from "lucide-react"

type Task = {
  id: string
  title: string
  description: string
  status: "todo" | "inProgress" | "done"
  dueDate: string
  projectId: string
  documents: Array<{ id: string; name: string; url: string }>
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

const loadTasks = (): Task[] => {
  const saved = localStorage.getItem('tasks')
  return saved ? JSON.parse(saved) : []
}

const saveTasks = (tasks: Task[]) => {
  localStorage.setItem('tasks', JSON.stringify(tasks))
}

export default function TaskDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [task, setTask] = useState<Task | null>(null)
  const [projects, setProjects] = useState<Project[]>([])

  useEffect(() => {
    const tasks = loadTasks()
    const foundTask = tasks.find(t => t.id === params.id)
    if (foundTask) {
      setTask({
        ...foundTask,
        description: foundTask.description || "",
        documents: foundTask.documents || []
      })
    }
    setProjects(loadProjects())
  }, [params.id])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (task) {
      setTask({ ...task, [e.target.name]: e.target.value })
    }
  }

  const handleStatusChange = (value: string) => {
    if (task) {
      setTask({ ...task, status: value as "todo" | "inProgress" | "done" })
    }
  }

  const handleProjectChange = (value: string) => {
    if (task) {
      setTask({ ...task, projectId: value })
    }
  }

  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && task) {
      const file = e.target.files[0]
      const newDoc = {
        id: `doc-${Date.now()}`,
        name: file.name,
        url: URL.createObjectURL(file)
      }
      setTask({ ...task, documents: [...task.documents, newDoc] })
    }
  }

  const handleRemoveDocument = (docId: string) => {
    if (task) {
      setTask({ ...task, documents: task.documents.filter(doc => doc.id !== docId) })
    }
  }

  const handleSave = async () => {
    if (task) {
      const tasks = loadTasks()
      const updatedTasks = tasks.map(t => t.id === task.id ? task : t)
      saveTasks(updatedTasks)
      router.push('/tasks')
    }
  }

  if (!task) {
    return <div>Loading...</div>
  }

  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 p-6 overflow-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Task Details</h1>
          <ModeToggle />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Edit Task</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <Input
                  name="title"
                  value={task.title}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <Textarea
                  name="description"
                  value={task.description}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <Select value={task.status} onValueChange={handleStatusChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todo">To Do</SelectItem>
                    <SelectItem value="inProgress">In Progress</SelectItem>
                    <SelectItem value="done">Done</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Project</label>
                <Select value={task.projectId} onValueChange={handleProjectChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select project" />
                  </SelectTrigger>
                  <SelectContent>
                    {projects.map(project => (
                      <SelectItem key={project.id} value={project.id}>{project.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Due Date</label>
                <Input
                  type="date"
                  name="dueDate"
                  value={task.dueDate}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Documents</label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {task.documents.map(doc => (
                    <div key={doc.id} className="flex items-center bg-secondary p-2 rounded">
                      <a href={doc.url} target="_blank" rel="noopener noreferrer" className="flex items-center mr-2">
                        <File className="w-4 h-4 mr-1" />
                        <span className="text-sm">{doc.name}</span>
                      </a>
                      <Button variant="ghost" size="sm" onClick={() => handleRemoveDocument(doc.id)}>
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                <div className="mt-2">
                  <Input
                    type="file"
                    onChange={handleDocumentUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <div className="flex items-center justify-center w-full h-32 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none">
                      <span className="flex items-center space-x-2">
                        <Paperclip className="w-6 h-6 text-gray-600" />
                        <span className="font-medium text-gray-600">
                          Drop files to Attach, or <span className="text-blue-600 underline">browse</span>
                        </span>
                      </span>
                    </div>
                  </label>
                </div>
              </div>
              <Button type="button" onClick={handleSave}>Save Changes</Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}