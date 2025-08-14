import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { ThemeProvider } from "@/components/theme-provider"
import { ModeToggle } from "./components/mode-toggle"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
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
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { Progress } from "./components/ui/progress"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Textarea } from "./components/ui/textarea"
import { Input } from "./components/ui/input"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "./components/ui/label"
import { ExampleCombobox } from "./components/example-combobox"
import Calendar from "./components/calendar"
import Table from "./components/table/table"
import { Home, Inbox, ChevronRight, FileText, Settings, Users } from "lucide-react"
import { Outlet, Link, useLocation } from "react-router"
import { useState } from "react"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

export default function App() {
  const [openItems, setOpenItems] = useState<string[]>([])
  const menuItems = [
    {
      title: "Home",
      url: "/",
      icon: Home,
      children: [
        { title: "Test", url: "/test", icon: FileText },
        { title: "Profile", url: "/profile", icon: Users },
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
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <SidebarProvider>
        <Sidebar>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map((item) => (
                    <Collapsible
                      key={item.title}
                      open={openItems.includes(item.title)}
                      onOpenChange={() => toggleOpen(item.title)}
                    >
                      <SidebarMenuItem>
                        {item.children && item.children.length > 0 ? (
                          <div className="w-full">
                            <CollapsibleTrigger asChild>
                              <SidebarMenuButton
                                className="w-full"
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
                          <SidebarMenuButton asChild>
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
                                  <SidebarMenuSubButton asChild>
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
        </Sidebar>

        <SidebarInset>
          {/* Header */}
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
              <Dialog>
                <form>
                  <DialogTrigger asChild>
                    <Button variant="outline">Open Dialog</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Edit profile</DialogTitle>
                      <DialogDescription>
                        Make changes to your profile here. Click save when you&apos;re done.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4">
                      <div className="grid gap-3">
                        <Label htmlFor="name-1">Name</Label>
                        <Input id="name-1" name="name" defaultValue="Pedro Duarte" />
                      </div>
                      <div className="grid gap-3">
                        <Label htmlFor="username-1">Username</Label>
                        <Input id="username-1" name="username" defaultValue="@peduarte" />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button className="bg-teal-400" type="submit">Save changes</Button>
                      <DialogClose asChild>
                        <Button variant="outlineDestructive">Cancel</Button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </form>
              </Dialog>
              <Calendar inline showTime selectionMode="range" />
              <ModeToggle />
            </div>
          </header>

          {/* <div className="flex min-h-screen flex-col items-center justify-center">
            <Button>Click me</Button>
            <Tooltip>
              <TooltipTrigger>Hover me</TooltipTrigger>
              <TooltipContent>
                <p>Add to library</p>
              </TooltipContent>
            </Tooltip>
            <Separator />
            <Skeleton className="h-[200px] w-[100%] rounded-full" />
            <ResizablePanelGroup
              direction="horizontal"
              className="min-h-[200px] max-w-md rounded-lg border md:min-w-[100%] md:max-w-full"
            >
              <ResizablePanel defaultSize={15}>
                <div className="flex h-full items-center justify-center p-6">
                  <span className="font-semibold">Sidebar</span>
                </div>
              </ResizablePanel>
              <ResizableHandle withHandle />
              <ResizablePanel defaultSize={55}>
                <div className="flex h-full items-center justify-center p-6">
                  <span className="font-semibold">Content Lorem, ipsum dolor sit amet consectetur adipisicing elit. Vel nostrum, aperiam voluptate perferendis at temporibus mollitia sint atque sit optio, magnam ipsa vitae cupiditate! Sequi reiciendis ipsa quos magni. Nobis, velit officia quae et amet molestiae assumenda recusandae voluptatum repudiandae magni fuga nam a quo iusto voluptas odit quaerat facere.</span>
                </div>
              </ResizablePanel>
              <ResizableHandle withHandle />
              <ResizablePanel defaultSize={30}>
                <div className="flex h-full items-center justify-center p-6">
                  <span className="font-semibold">Content 2 Lorem ipsum dolor sit amet consectetur adipisicing elit. Ab dolorem voluptatum corporis voluptas praesentium fuga molestiae, atque dolorum, qui ratione hic odio officia reiciendis repellat dolores, quidem quas architecto? Sapiente!</span>
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
            <Progress value={33} />
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious href="#" />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">1</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext href="#" />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
            <Textarea />
            <Input />
            <ExampleCombobox />
            <Table />
          </div> */}
          <main className="flex flex-col items-center justify-center">
            <Outlet />
          </main>
        </SidebarInset>
      </SidebarProvider>
    </ThemeProvider>
  )
}