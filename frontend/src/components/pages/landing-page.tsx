import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, CheckSquare, Gauge, KanbanSquare, User } from "lucide-react"

export default function LandingPage() {
  const features = [
    {
      icon: <Gauge className="w-6 h-6" />,
      title: "Dashboard",
      description: "Overview of your tasks and daily activities. Quick access to all important features."
    },
    {
      icon: <CheckSquare className="w-6 h-6" />,
      title: "Daily Tasks",
      description: "Create and manage your daily tasks. Add subtasks, set due dates, and track progress with checklists."
    },
    {
      icon: <KanbanSquare className="w-6 h-6" />,
      title: "Kanban Board",
      description: "Visual task management with drag-and-drop functionality. Organize tasks by status (New, In Progress, Completed)."
    },
    {
      icon: <Calendar className="w-6 h-6" />,
      title: "Calendar View",
      description: "Weekly calendar view to plan and track tasks. Search by date and see which week of the year it falls in."
    },
    {
      icon: <User className="w-6 h-6" />,
      title: "Profile Management",
      description: "Manage your account settings and preferences."
    }
  ]

  const keyFeatures = [
    "Task Creation and Management",
    "Subtasks with Checklists",
    "Automatic Status Updates",
    "Search Functionality",
    // "Drag and Drop Task Organization",
    "Weekly Calendar Planning",
    "Progress Tracking",
    "User Authentication"
  ]

  return (
    <div className="container mx-auto p-6 space-y-6 max-h-[90dvh] overflow-y-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Welcome to Time Manager</CardTitle>
          <CardDescription>
            A comprehensive task management solution to help you stay organized and productive
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {features.map((feature, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {feature.icon}
                {feature.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Key Features</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-6 space-y-2">
            {keyFeatures.map((feature, index) => (
              <li key={index} className="text-muted-foreground">{feature}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Getting Started</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">1. Create a Task</h3>
            <p className="text-muted-foreground">Start by creating a new task from the Daily Tasks page. Add a title, description, and set due dates.</p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">2. Add Subtasks</h3>
            <p className="text-muted-foreground">Break down your tasks into smaller subtasks. Add checklists to track progress.</p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">3. Organize with Kanban</h3>
            <p className="text-muted-foreground">Use the Kanban board to visualize your workflow and move tasks between different states.</p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">4. Plan with Calendar</h3>
            <p className="text-muted-foreground">Use the calendar view to plan your tasks and see your schedule by week.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}