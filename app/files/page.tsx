"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/sidebar"
import { ModeToggle } from "@/components/ui/mode-toggle"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { FileText, Search } from "lucide-react"

type File = {
  id: string
  name: string
  taskId: string
  taskName: string
  projectId: string
  projectName: string
  uploadDate: string
}

export default function FilesPage() {
  const [files, setFiles] = useState<File[]>([])
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    // Simulating API call to fetch files
    const fetchFiles = async () => {
      // In a real application, this would be an API call
      const mockFiles: File[] = [
        { id: "1", name: "UI Mockup.fig", taskId: "1", taskName: "Design UI mockups", projectId: "1", projectName: "Website Redesign", uploadDate: "2023-07-10" },
        { id: "2", name: "API Docs.md", taskId: "3", taskName: "Write API documentation", projectId: "3", projectName: "Backend Services", uploadDate: "2023-07-11" },
        { id: "3", name: "CI Config.yml", taskId: "4", taskName: "Set up CI/CD pipeline", projectId: "4", projectName: "DevOps Improvement", uploadDate: "2023-07-12" },
      ]
      setFiles(mockFiles)
    }
    fetchFiles()
  }, [])

  const filteredFiles = files.filter(file =>
    file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    file.taskName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    file.projectName.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 p-6 overflow-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Files</h1>
          <ModeToggle />
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>File Management</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2 mb-4">
              <Search className="w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search files, tasks, or projects"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>File Name</TableHead>
                  <TableHead>Associated Task</TableHead>
                  <TableHead>Project</TableHead>
                  <TableHead>Upload Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFiles.map((file) => (
                  <TableRow key={file.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <FileText className="w-4 h-4 mr-2" />
                        {file.name}
                      </div>
                    </TableCell>
                    <TableCell>{file.taskName}</TableCell>
                    <TableCell>{file.projectName}</TableCell>
                    <TableCell>{file.uploadDate}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}