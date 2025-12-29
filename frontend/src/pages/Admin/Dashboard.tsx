import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Users,
  Calendar,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  FileText,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const stats = [
  {
    title: "Total Patients",
    value: "2,845",
    description: "+12.5% from last month",
    icon: Users,
    trend: "up",
  },
  {
    title: "Active Appointments",
    value: "142",
    description: "+8.2% from last month",
    icon: Calendar,
    trend: "up",
  },
  {
    title: "Health Reports",
    value: "1,240",
    description: "-2.4% from last month",
    icon: Activity,
    trend: "down",
  },
];

const recentAppointments = [
  {
    patient: "Sarah Johnson",
    doctor: "Dr. Emily Smith",
    time: "Today, 10:00 AM",
    status: "Confirmed",
  },
  {
    patient: "Michael Brown",
    doctor: "Dr. Robert Wilson",
    time: "Today, 11:30 AM",
    status: "Pending",
  },
  {
    patient: "Jessica Williams",
    doctor: "Dr. Sarah Taylor",
    time: "Today, 2:00 PM",
    status: "Confirmed",
  },
];

export default function AdminPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-muted-foreground">
            Welcome back, Admin. Here's what's happening today.
          </p>
        </div>
        {/* <Button>Download Report</Button> */}
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {stats.map((stat, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center pt-1 text-xs">
                {stat.trend === "up" ? (
                  <ArrowUpRight className="mr-1 h-3 w-3 text-green-500" />
                ) : (
                  <ArrowDownRight className="mr-1 h-3 w-3 text-red-500" />
                )}
                <span
                  className={
                    stat.trend === "up" ? "text-green-500" : "text-red-500"
                  }
                >
                  {stat.description.split(" ")[0]}
                </span>
                <span className="ml-1 text-muted-foreground">
                  {stat.description.split(" ").slice(1).join(" ")}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Appointments</CardTitle>
            <CardDescription>
              You have {recentAppointments.length} appointments scheduled for
              today.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentAppointments.map((appointment, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                      {appointment.patient[0]}
                    </div>
                    <div>
                      <p className="text-sm font-medium leading-none">
                        {appointment.patient}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {appointment.doctor}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{appointment.time}</p>
                    <p
                      className={`text-xs ${
                        appointment.status === "Confirmed"
                          ? "text-green-500"
                          : "text-amber-500"
                      }`}
                    >
                      {appointment.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common administrative tasks.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              className="h-20 flex-col gap-2 bg-transparent"
            >
              <Users className="h-5 w-5" />
              Add Patient
            </Button>
            <Button
              variant="outline"
              className="h-20 flex-col gap-2 bg-transparent"
            >
              <Calendar className="h-5 w-5" />
              New Schedule
            </Button>
            <Button
              variant="outline"
              className="h-20 flex-col gap-2 bg-transparent"
            >
              <FileText className="h-5 w-5" />
              Generate Invoice
            </Button>
            <Button
              variant="outline"
              className="h-20 flex-col gap-2 bg-transparent"
            >
              <Settings className="h-5 w-5" />
              System Audit
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
