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
import { Home, Inbox, ChevronRight, FileText, Settings } from "lucide-react"
import { Outlet, Link, useLocation } from "react-router"
import { useState } from "react"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { AuthProvider } from './contexts/AuthContext';
import { NavUser } from "./components/nav-user"
import { TestBackend } from '@/components/TestBackend';
import AddNewTask from "./components/add-new-task"

export default function App() {
  const [openItems, setOpenItems] = useState<string[]>([])
  const [selectedDate, setSelectedDate] = useState<CalendarValue>(new Date())

  const menuItems = [
    {
      title: "Home",
      url: "/",
      icon: Home,
      children: [
        { title: "Test", url: "/test", icon: FileText },
        { title: "Settings", url: "/settings", icon: Settings }
      ]
    },
    {
      title: "Inbox",
      url: "/inbox",
      icon: Inbox,
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
      let isParentPage = false

      for (const menuItem of menuItems) {
        if (menuItem.url === currentPath) {
          title = menuItem.title
          isParentPage = true
          break
        }
        for (const child of menuItem.children || []) {
          if (child.url === currentPath) {
            title = child.title
            break
          }
        }
      }

      const isLast = i === pathnames.length - 1

      if (isParentPage && !isLast && i === 0) {
        continue
      }

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
    <AuthProvider>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <SidebarProvider>
          <Sidebar>
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {menuItems.map((item) => (
                      <Collapsible
                        defaultOpen
                        key={item.title}
                        open={openItems.includes(item.title)}
                        onOpenChange={() => toggleOpen(item.title)}
                      >
                        <SidebarMenuItem>
                          {item.children && item.children.length > 0 ? (
                            <div className="w-full">
                              <CollapsibleTrigger asChild>
                                <SidebarMenuButton
                                  className={`w-full ${isItemActive(item) ? 'font-semibold bg-sidebar-accent' : 'font-normal'} `}
                                >
                                  <Link
                                    to={item.url}
                                    className="w-full flex items-center gap-2 pr-8"
                                  >
                                    <item.icon />
                                    <span>{item.title}</span>
                                  </Link>
                                  <ChevronRight className={`ml-auto h-4 w-4 hover:cursor-pointer hover:bg-background transition-transform ${openItems.includes(item.title) && " rotate-90"}`} />
                                </SidebarMenuButton>
                              </CollapsibleTrigger>
                            </div>
                          ) : (
                            <SidebarMenuButton asChild className={`w-full ${isItemActive(item) ? 'font-semibold bg-sidebar-accent' : 'font-normal'} `}>
                              <Link to={item.url}>
                                <item.icon />
                                <span>{item.title}</span>
                              </Link>
                            </SidebarMenuButton>
                          )}

                          {item.children && item.children.length > 0 && (
                            <CollapsibleContent>
                              <SidebarMenuSub>
                                {item.children.map((child) => (
                                  <SidebarMenuSubItem key={child.title}>
                                    <SidebarMenuSubButton asChild >
                                      <Link to={child.url}>
                                        <child.icon className="h-4 w-4" />
                                        <span>{child.title}</span>
                                      </Link>
                                    </SidebarMenuSubButton>
                                  </SidebarMenuSubItem>
                                ))}
                              </SidebarMenuSub>
                            </CollapsibleContent>
                          )}
                        </SidebarMenuItem>
                      </Collapsible>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
              <NavUser />
            </SidebarFooter>
          </Sidebar>

          <SidebarInset>
            <header className="sticky top-0 w-full h-16 flex items-center justify-between px-4 z-50 bg-background shadow overflow-x-auto">
              <div className="flex items-center gap-2 min-w-0 w-full overflow-hidden">
                <SidebarTrigger />
                <Separator orientation="vertical" className="h-4" />
                <Breadcrumb className="truncate min-w-0 overflow-hidden text-ellipsis whitespace-nowrap">
                  <BreadcrumbList>
                    {pathnames.length === 0 ? (
                      <BreadcrumbItem>
                        <BreadcrumbPage>Home</BreadcrumbPage>
                      </BreadcrumbItem>
                    ) : (
                      <>
                        <BreadcrumbItem>
                          <BreadcrumbLink asChild>
                            <Link to="/">Home</Link>
                          </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator className="hidden md:block" />
                        {generateBreadcrumbs()}
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
              <TestBackend />
            </main>
          </SidebarInset>
        </SidebarProvider>
      </ThemeProvider>
    </AuthProvider>
  )
}