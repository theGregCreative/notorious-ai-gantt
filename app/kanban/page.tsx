"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/sidebar"
import { ModeToggle } from "@/components/ui/mode-toggle"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus } from "lucide-react"
import { useDebounce } from "@/hooks/useDebounce"

type Task = {
  id: string
  title: string
  status: "todo" | "inProgress" | "done"
}

export default function KanbanPage() {
  const [tasks, setTasks] = useState<Task[]>([
    { id: "1", title: "Design UI mockups", status: "todo" },
    { id: "2", title: "Implement authentication", status: "inProgress" },
    { id: "3", title: "Write API documentation", status: "done" },
    { id: "4", title: "Set up CI/CD pipeline", status: "inProgress" },
  ])

  const [newTask, setNewTask] = useState("")
  const debouncedNewTask = useDebounce(newTask, 300)

  const addTask = () => {
    if (debouncedNewTask.trim() !== "") {
      const newTaskObj: Task = {
        id: Date.now().toString(),
        title: debouncedNewTask,
        status: "todo",
      }
      setTasks([...tasks, newTaskObj])
      setNewTask("")
    }
  }

  const moveTask = (taskId: string, newStatus: "todo" | "inProgress" | "done") => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, status: newStatus } : task
    ))
  }

  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 p-6 overflow-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Kanban Board</h1>
          <ModeToggle />
        </div>

        <div className="flex mb-4">
          <Input
            type="text"
            placeholder="New task"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            className="mr-2"
          />
          <Button onClick={addTask}>
            <Plus className="mr-2 h-4 w-4" /> Add Task
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                      <p>{task.title}</p>
                      <div className="flex mt-2">
                        {status !== "todo" && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="mr-2"
                            onClick={() => moveTask(task.id, "todo")}
                          >
                            Move to Todo
                          </Button>
                        )}
                        {status !== "inProgress" && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="mr-2"
                            onClick={() => moveTask(task.id, "inProgress")}
                          >
                            Move to In Progress
                          </Button>
                        )}
                        {status !== "done" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => moveTask(task.id, "done")}
                          >
                            Move to Done
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}