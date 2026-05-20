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

// import Calendar, { type CalendarValue } from "./components/calendar"
import { Kanban, Logs, Gauge, CalendarSearch, House, Globe, RefreshCw } from "lucide-react"
import { Outlet, Link, useLocation, useNavigate } from "react-router"
import { useEffect, useState } from "react"
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { NavUser } from "./components/nav-user"
import AddNewTask from "./components/add-new-task"
import { ColumnWidthProvider } from "./contexts/ColumnWidthContext"
import { Button } from "./components/ui/button"

export default function App() {
  const [openItems, setOpenItems] = useState<string[]>([])
  // const [selectedDate, setSelectedDate] = useState<CalendarValue>(new Date())
  const { user } = useAuth()
  const navigate = useNavigate()

  const menuItems = [
    {
      title: "Home",
      url: "/",
      icon: House,
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
    {
      title: "DashBoard",
      url: "/dashboard",
      icon: Gauge,
      children: []
    },
    {
      title: "Calendar",
      url: "/calendar",
      icon: CalendarSearch,
      children: []
    },
    {
      title: "Time Zones",
      url: "/time-zones",
      icon: Globe,
      children: []
    },
  ].filter(item => {
    // If user is not logged in, only show Home and Calendar
    if (!user) {
      return item.title === "Home" || item.title === "Calendar" || item.title === "Time Zones"
    }
    return true
  })

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

  const [quote, setQuote] = useState<{ quote: string, author: string } | null>(null)
  const [filteredQuotesList, setFilteredQuotesList] = useState<any[]>([]);
  const fetchAllQuotes = async () => {
    const url = `https://dummyjson.com/quotes?limit=100`;

    const categories = ['Change',
      'Choice',
      'Confidence',
      'Courage',
      'Excellence',
      'Future',
      'Happiness',
      'Inspiration',
      'Kindness',
      'Leadership',
      'Love',
      'Success',
      'Work',
    ]

    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error("Error getting data from API");

      const data = await res.json();

      if (data && data.quotes && data.quotes.length > 0) {
        const filtered = data.quotes.filter((citat: any) => {
          const quote = citat.quote.toLowerCase();
          return categories.some(cuvant => quote.includes(cuvant));
        });

        const finalList = filtered.length > 0 ? filtered : data.quotes;

        setFilteredQuotesList(finalList);

        const randomQuote = finalList[Math.floor(Math.random() * finalList.length)];
        setQuote({
          quote: randomQuote.quote,
          author: randomQuote.author,
        });
      }
    } catch (err) {
      console.error("API Error:", err);
    }
  };

  const handleNextQuoteClick = () => {
    if (filteredQuotesList.length > 0) {
      const randomQuote = filteredQuotesList[Math.floor(Math.random() * filteredQuotesList.length)];
      setQuote({
        quote: randomQuote.quote,
        author: randomQuote.author,
      });
    }
  };

  useEffect(() => {
    fetchAllQuotes();
  }, []);

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
                        <SidebarMenuButton
                          asChild
                          tooltip={item.title}
                          className={`w-full ${isItemActive(item) ? 'font-semibold bg-sidebar-accent' : 'font-normal'}`}
                        >
                          <Link to={item.url}>
                            <item.icon />
                            <span>{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
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
                  {user ? <AddNewTask /> : <Button><Link to="/auth/login">Login</Link></Button>}
                  {/* <Calendar inline showTime selectionMode="range" value={selectedDate} onChange={setSelectedDate} /> */}
                  <ModeToggle />
                </div>

              </header>
              <div className="p-6 mx-auto">
                {quote ? (
                  <div className="flex flex-col align-items-center justify-content-center">
                    <blockquote className="m-0">
                      <p style={{ fontSize: '0.9rem', fontWeight: 'bold', fontStyle: 'italic' }}>
                        "{quote.quote}"
                        <cite style={{ marginLeft: '0.5rem', fontSize: '0.75rem', fontWeight: 'normal', fontStyle: 'normal', color: 'var(--text-color)' }}>— {quote.author}</cite>
                      </p>
                    </blockquote>

                    <Button
                      onClick={handleNextQuoteClick}
                      variant={'outline'}
                      size="sm"
                      className="m-auto"
                    >
                      <RefreshCw /> New quote
                    </Button>
                  </div>
                ) : (
                  <p>Loading quote...</p>
                )}
              </div>
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