"use client"

// import { SidebarTrigger } from "@/components/ui/sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
// import { Separator } from "@/components/ui/separator"
import { Bell, User } from "lucide-react" // Search
// import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function AdminHeader() {
  return (
    <header className="flex w-[calc(100%-16rem)] h-16 shrink-0 left-64 items-center gap-2 border-b px-4 sticky top-0 bg-background z-10">
      {/* <SidebarTrigger className="-ml-1" /> */}
      {/* <Separator orientation="vertical" className="mr-2 h-4" /> */}
      <Breadcrumb className="hidden md:flex">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin">Admin</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Dashboard</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="ml-auto mr-5 flex items-center gap-4">
        {/* <div className="relative hidden lg:block w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Search..." className="pl-8 bg-muted/50" />
        </div> */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-blue-600" />
        </Button>
        <Button variant="ghost" size="icon">
          <User className="h-5 w-5" />
        </Button>
      </div>
    </header>
  )
}
