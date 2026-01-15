/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Calendar,
  ArrowUpRight,
  Stethoscope,
  LayoutDashboard,
  Settings,
} from "lucide-react";

// Shadcn/UI components
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

// API Services
import {
  getAllPatients,
  getAllDoctors,
  getAllAppointments,
} from "../../../services/apiSvc";

export default function AdminPage() {
  const navigate = useNavigate();
  const [data, setData] = useState({
    patients: [],
    doctors: [],
    appointments: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Parallel fetching for performance
        const [patientsRes, doctorsRes, appointmentsRes] = await Promise.all([
          getAllPatients(),
          getAllDoctors(),
          getAllAppointments(),
        ]);

        setData({
          patients: patientsRes.data.data || [],
          doctors: doctorsRes.data.data || [],
          appointments: appointmentsRes.data.data || [],
        });
      } catch (error) {
        console.error("Error fetching admin dashboard data:", error);
      } finally {
        // Subtle delay to ensure smooth transition
        setTimeout(() => setLoading(false), 600);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* 1. Header Section */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Dashboard Overview
        </h1>
        {loading ? (
          <Skeleton className="h-4 w-64" />
        ) : (
          <p className="text-muted-foreground">
            System is running smoothly. Currently managing {data.doctors.length}{" "}
            doctors and {data.patients.length} patients.
          </p>
        )}
      </div>

      {/* 2. Stats Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        {loading ? (
          <>
            <StatSkeleton />
            <StatSkeleton />
            <StatSkeleton />
          </>
        ) : (
          <>
            <StatCard
              title="Total Patients"
              value={data.patients.length.toLocaleString()}
              icon={Users}
              color="text-blue-600"
              bg="bg-blue-50"
              trend="+4.3% from last week"
            />
            <StatCard
              title="Medical Staff"
              value={data.doctors.length.toLocaleString()}
              icon={Stethoscope}
              color="text-emerald-600"
              bg="bg-emerald-50"
              trend="2 pending approvals"
            />
            <StatCard
              title="Total Bookings"
              value={data.appointments.length.toLocaleString()}
              icon={Calendar}
              color="text-brandBlue"
              bg="bg-blue-100/50"
              trend="12 today"
            />
          </>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* 3. Recent Appointments Table */}
        <Card className="lg:col-span-2 shadow-sm border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Appointments</CardTitle>
              <CardDescription>
                Latest patient-doctor interactions.
              </CardDescription>
            </div>
            {!loading && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/admin/appointments")}
              >
                View All
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : (
              <div className="relative overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-slate-500 uppercase bg-slate-50">
                    <tr>
                      <th className="px-4 py-3 font-medium">Patient</th>
                      <th className="px-4 py-3 font-medium">Doctor</th>
                      <th className="px-4 py-3 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {data.appointments.slice(0, 6).map((appt: any) => (
                      <tr
                        key={appt.id}
                        className="hover:bg-slate-50/50 transition-colors"
                      >
                        <td className="px-4 py-4 font-medium text-slate-900">
                          {appt.patient?.user?.first_name}{" "}
                          {appt.patient?.user?.last_name}
                        </td>
                        <td className="px-4 py-4 text-slate-600">
                          Dr. {appt.doctor?.user?.first_name}{" "}
                          {appt.doctor?.user?.last_name}
                        </td>
                        <td className="px-4 py-4">
                          <Badge
                            variant="outline"
                            className={getStatusClass(appt.status)}
                          >
                            {appt.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                    {data.appointments.length === 0 && (
                      <tr>
                        <td
                          colSpan={3}
                          className="px-4 py-10 text-center text-slate-400 font-light italic"
                        >
                          No recent appointments found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 4. Quick Links Section */}
        <div className="space-y-6">
          <Card className="shadow-sm border-slate-200">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common administrative tasks.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3">
              {loading ? (
                <>
                  <Skeleton className="h-11 w-full" />
                  <Skeleton className="h-11 w-full" />
                  <Skeleton className="h-11 w-full" />
                </>
              ) : (
                <>
                  <QuickLinkButton
                    label="Manage Doctors"
                    icon={Stethoscope}
                    onClick={() => navigate("/admin/doctors")}
                  />
                  <QuickLinkButton
                    label="Patient Directory"
                    icon={Users}
                    onClick={() => navigate("/admin/patients")}
                  />
                  <QuickLinkButton
                    label="Schedule Audit"
                    icon={LayoutDashboard}
                    onClick={() => navigate("/admin/audit")}
                  />
                  <QuickLinkButton
                    label="Settings"
                    icon={Settings}
                    onClick={() => navigate("/admin/settings")}
                  />
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// --- Internal UI Components ---

function StatCard({ title, value, icon: Icon, color, bg, trend }: any) {
  return (
    <Card className="border-none shadow-sm ring-1 ring-slate-200 hover:ring-brandBlue/50 transition-all">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">{title}</p>
            <h3 className="text-3xl font-bold mt-1 text-slate-900">{value}</h3>
            <p className="text-[11px] text-slate-400 mt-1 uppercase tracking-wider font-semibold">
              {trend}
            </p>
          </div>
          <div className={`${bg} p-3 rounded-2xl`}>
            <Icon className={`h-6 w-6 ${color}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function StatSkeleton() {
  return (
    <Card className="border-none shadow-sm ring-1 ring-slate-200 p-6">
      <div className="flex items-center justify-between">
        <div className="space-y-3">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-3 w-32" />
        </div>
        <Skeleton className="h-12 w-12 rounded-2xl" />
      </div>
    </Card>
  );
}

function QuickLinkButton({ label, icon: Icon, onClick }: any) {
  return (
    <Button
      variant="outline"
      className="w-full justify-start h-11 gap-3 border-slate-200 hover:bg-slate-50 hover:text-brandBlue hover:border-brandBlue/30 transition-all group cursor-pointer"
      onClick={onClick}
    >
      <Icon className="h-4 w-4 text-slate-400 group-hover:text-brandBlue" />
      <span className="text-sm font-medium">{label}</span>
      <ArrowUpRight className="ml-auto h-3 w-3 opacity-0 group-hover:opacity-50 transition-opacity" />
    </Button>
  );
}

function getStatusClass(status: string) {
  const s = status?.toLowerCase();
  if (s === "confirmed" || s === "completed")
    return "bg-emerald-50 text-emerald-700 border-emerald-200";
  if (s === "pending") return "bg-amber-50 text-amber-700 border-amber-200";
  if (s === "cancelled") return "bg-red-50 text-red-700 border-red-200";
  return "bg-slate-50 text-slate-700 border-slate-200";
}
