
import {
  BadgeCheck,
  ChevronsUpDown,
  CircleUserRound,
  LogIn,
  LogOut,
} from "lucide-react"
import { Link } from 'react-router'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  SidebarMenu,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'
import { Button } from "./ui/button"
import { useAuth } from "@/contexts/AuthContext"
import { toast } from 'sonner'

export function NavUser() {
  const { isMobile } = useSidebar()
  const { user, logout } = useAuth()

  const getUserName = (user: any): string => {
    if (user?.displayName && user?.displayName.trim() !== "") {
      return user?.displayName
    }

    if (user?.email) {
      const localPart = user.email.split("@")[0]
      const cleaned = localPart
        .replace(/[-_.]/g, " ")
        .replace(/\s+/g, " ")
        .trim()

      const formatted = cleaned
        .split(" ")
        .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))

      return `${formatted[0][0]} ${formatted[1][0]}`
    }
    return ''
  }

  const userData = {
    name: getUserName(user),
    email: user?.email ?? '',
    avatar: user?.photoURL ?? ''
  }

  const handleLogout = async () => {
    try {
      await logout()
      toast.success('Logout successful')
    } catch (err) {
      toast.error('Logout failed')
    }
  }
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild >
            <Button
              variant='ghost'
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground !px-0"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={userData.avatar} alt={userData.name} />
                <AvatarFallback className="rounded-lg"><CircleUserRound /></AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{userData.name}</span>
                <span className="truncate text-xs">{userData.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={userData.avatar} alt={userData.name} />
                  <AvatarFallback className="rounded-lg"><CircleUserRound /></AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{userData.name}</span>
                  <span className="truncate text-xs">{userData.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link to="/profile">
                  <BadgeCheck className="mr-2 h-4 w-4" /> Profil
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              {user ?
                <Button onClick={handleLogout} variant="destructive" className="w-full">Logout <LogOut className="text-white" /> </Button> :
                <Button className="w-full flex gap-2"><Link to="/auth/login">Login </Link><LogIn className="text-primary-foreground" /></Button>}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
