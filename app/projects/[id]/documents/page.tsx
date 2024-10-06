"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Sidebar } from "@/components/sidebar"
import { ModeToggle } from "@/components/ui/mode-toggle"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Paperclip } from "lucide-react"

type Document = {
  id: string
  name: string
  url: string
  taskId?: string
}

export default function ProjectDocumentsPage() {
  const params = useParams()
  const [documents, setDocuments] = useState<Document[]>([])

  useEffect(() => {
    // Fetch documents for the project (mock data for now)
    const fetchDocuments = async () => {
      // In a real app, you'd make an API call here
      const mockDocuments: Document[] = [
        { id: "doc1", name: "Project Proposal.pdf", url: "#" },
        { id: "doc2", name: "UI Mockups.fig", url: "#", taskId: "1" },
        { id: "doc3", name: "API Specs.md", url: "#", taskId: "2" },
      ]
      setDocuments(mockDocuments)
    }

    fetchDocuments()
  }, [params.id])

  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 p-6 overflow-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Project Documents</h1>
          <ModeToggle />
        </div>

        <div className="space-y-4">
          {documents.map((doc) => (
            <Card key={doc.id}>
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center">
                  <Paperclip className="w-4 h-4 mr-2" />
                  <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-sm font-medium">
                    {doc.name}
                  </a>
                </div>
                {doc.taskId && (
                  <a href={`/tasks/${doc.taskId}`} className="text-xs text-muted-foreground hover:underline">
                    View associated task
                  </a>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}