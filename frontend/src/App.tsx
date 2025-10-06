import { ThemeProvider } from "@/components/theme-provider"
import { ModeToggle } from "./components/mode-toggle"
import { Separator } from "@/components/ui/separator"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "./components/ui/sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./components/ui/breadcrumb"

import Calendar, { type CalendarValue } from "./components/calendar"
import { Kanban, ChevronRight, Logs, Gauge } from "lucide-react"
import { Outlet, Link, useLocation } from "react-router"
import { useState } from "react"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { AuthProvider } from './contexts/AuthContext';
import { NavUser } from "./components/nav-user"
import AddNewTask from "./components/add-new-task"
import { ColumnWidthProvider } from "./contexts/ColumnWidthContext"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export default function App() {
  const [openItems, setOpenItems] = useState<string[]>([])
  const [selectedDate, setSelectedDate] = useState<CalendarValue>(new Date())

  const menuItems = [
    {
      title: "Dashboard",
      url: "/",
      icon: Gauge,
      children: []
    },
    {
      title: "Dailys",
      url: "/daily-tasks",
      icon: Logs,
      children: []
    },
    {
      title: "Kanban Bord",
      url: "/kanban",
      icon: Kanban,
      children: []
    },
  ]

  const location = useLocation()
  const pathnames = location.pathname.split("/").filter(Boolean)

  const toggleOpen = (title: string) => {
    setOpenItems(prev =>
      prev.includes(title)
        ? prev.filter(item => item !== title)
        : [...prev, title]
    )
  }

  const isItemActive = (item: any) => {
    if (location.pathname === item.url) return true
    return item.children?.some((child: any) => location.pathname === child.url)
  }

  const generateBreadcrumbs = () => {
    const breadcrumbs = []
    let currentPath = ""

    for (let i = 0; i < pathnames.length; i++) {
      const segment = pathnames[i]
      currentPath += `/${segment}`

      let title = segment
      let hasChildren = false

      for (const menuItem of menuItems) {
        if (menuItem.url === currentPath && menuItem.children && menuItem.children.length > 0) {
          title = menuItem.title
          hasChildren = true
          break
        }
      }

      if (!hasChildren) continue

      const isLast = i === pathnames.length - 1

      if (breadcrumbs.length > 0) {
        breadcrumbs.push(
          <BreadcrumbSeparator key={`sep-${i}`} className="hidden md:block" />
        )
      }

      breadcrumbs.push(
        <BreadcrumbItem key={currentPath}>
          {isLast ? (
            <BreadcrumbPage>{title}</BreadcrumbPage>
          ) : (
            <BreadcrumbLink asChild>
              <Link to={currentPath}>{title}</Link>
            </BreadcrumbLink>
          )}
        </BreadcrumbItem>
      )
    }

    return breadcrumbs
  }

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <AuthProvider>
        <SidebarProvider>
          <Sidebar collapsible="icon">
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {menuItems.map((item) => (
                      <SidebarMenuItem key={item.title}>
                        <TooltipProvider delayDuration={0}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <SidebarMenuButton
                                asChild
                                className={`w-full ${isItemActive(item) ? 'font-semibold bg-sidebar-accent' : 'font-normal'}`}
                              >
                                <Link to={item.url}>
                                  <item.icon />
                                  <span>{item.title}</span>
                                </Link>
                              </SidebarMenuButton>
                            </TooltipTrigger>
                            <TooltipContent side="right">
                              {item.title}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
              <NavUser />
            </SidebarFooter>
          </Sidebar>
          <ColumnWidthProvider>
            <SidebarInset>
              <header className="sticky top-0 w-full h-16 flex items-center justify-between px-4 z-50 bg-background shadow overflow-x-auto">
                <div className="flex items-center gap-2 min-w-0 w-full overflow-hidden">
                  <SidebarTrigger />
                  <Separator orientation="vertical" className="h-4" />
                  <Breadcrumb className="truncate min-w-0 overflow-hidden text-ellipsis whitespace-nowrap">
                    <BreadcrumbList>
                      {pathnames.length === 0 ? (
                        <BreadcrumbItem>
                          <BreadcrumbPage>Dashboard</BreadcrumbPage>
                        </BreadcrumbItem>
                      ) : (
                        <>
                          {generateBreadcrumbs().length > 0 && (
                            <>
                              <BreadcrumbItem>
                                <BreadcrumbLink asChild>
                                  <Link to="/">Dashboard</Link>
                                </BreadcrumbLink>
                              </BreadcrumbItem>
                              <BreadcrumbSeparator className="hidden md:block" />
                              {generateBreadcrumbs()}
                            </>
                          )}
                        </>
                      )}
                    </BreadcrumbList>
                  </Breadcrumb>
                </div>
                <div className="shrink-0 ml-auto flex items-center gap-2">
                  <AddNewTask />
                  <Calendar inline showTime selectionMode="range" value={selectedDate} onChange={setSelectedDate} />
                  <ModeToggle />
                </div>
              </header>

              <main className="flex flex-col items-center justify-center">
                <Outlet />
              </main>
            </SidebarInset>
          </ColumnWidthProvider>
        </SidebarProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}