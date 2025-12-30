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
import { User } from "lucide-react" 
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
        <Button variant="ghost" size="icon">
          <User className="h-8 w-8" />
        </Button>
      </div>
    </header>
  )
}
