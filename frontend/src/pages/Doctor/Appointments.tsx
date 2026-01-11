import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Navbar from "../../components/common/navbar";
import Footer from "../../components/common/footer";
import {
  getAppointmentByDoctorId,
  updateAppointmentStatusByDoctor,
} from "../../../services/apiSvc";
import {
  Calendar,
  CheckCircle2,
  Clock,
  Loader2,
  MapPin,
  MessageSquare,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Appointment {
  id: number;
  appointment_date: string;
  start_time: string;
  end_time: string;
  status: string;
  notes: string;
  patient: {
    user: {
      first_name: string;
      last_name: string;
    };
  };
  clinic: {
    name: string;
  };
}

const Appointments = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    fetchAppointments();
  }, [navigate]);

  const fetchAppointments = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const userId = user.data.profile.id;

      const data = await getAppointmentByDoctorId(userId);
      console.log("Fetched appointments:", data);
      if (data.status === "success") {
        setAppointments(data.data.data);
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateAppointment = async (appointmentId: number, status: string) => {
    try {
      console.log(`Updating appointment ${appointmentId} to status: ${status}`);
      const data = await updateAppointmentStatusByDoctor(appointmentId, status);
      if (data.status === "success") {
        fetchAppointments();
      }
    } catch (error) {
      console.error("Error updating appointment status:", error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "confirmed":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "completed":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "cancelled":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const filteredAppointments = appointments.filter(
    (appointment) =>
      statusFilter === "all" || appointment.status === statusFilter
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar role="doctor" />

      {loading && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Loading appointments...</p>
          </div>
        </div>
      )}

      <main className="container mx-auto py-10 px-4 space-y-8">
        <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight text-foreground/90">
              My Appointments
            </h1>
            <p className="text-muted-foreground">
              Manage and track all patient consultations and schedules.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </section>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAppointments.map((appointment) => (
            <Card key={appointment.id} className="overflow-hidden border-none shadow-sm hover:shadow-md transition-shadow ring-1 ring-border/50">
              <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-4">
                <div className="space-y-1">
                  <h3 className="font-semibold text-lg tracking-tight">
                    {appointment.patient.user.first_name}{" "}
                    {appointment.patient.user.last_name}
                  </h3>
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5" />
                    <span>{appointment.clinic.name}</span>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className={cn(
                    "px-2.5 py-0.5 font-medium border shadow-none",
                    getStatusColor(appointment.status)
                  )}
                >
                  {appointment.status.charAt(0).toUpperCase() +
                    appointment.status.slice(1)}
                </Badge>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 rounded-xl bg-muted/50 p-3">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> Date
                    </span>
                    <p className="text-sm font-medium">
                      {appointment.appointment_date}
                    </p>
                  </div>
                  <div className="space-y-1 border-l pl-4">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" /> Time
                    </span>
                    <p className="text-sm font-medium">
                      {appointment.start_time} - {appointment.end_time}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5 rounded-lg border bg-accent/30 p-3">
                  <MessageSquare className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-primary/70">
                      Notes
                    </span>
                    <p className="text-xs leading-relaxed text-muted-foreground italic">
                      &quot;{appointment.notes}&quot;
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-0 pb-6 flex gap-2">
                {appointment.status === "confirmed" && (
                  <>
                    <Button
                      className="flex-1 shadow-sm gap-2 bg-brandBlue hover:bg-brandBlue/90 text-white cursor-pointer"
                      size="sm"
                      onClick={() =>
                        updateAppointment(appointment.id, "completed")
                      }
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      Complete
                    </Button>
                  </>
                )}
                {appointment.status === "pending" && (
                  <>
                    <Button
                      size="sm"
                      onClick={() =>
                        updateAppointment(appointment.id, "confirmed")
                      }
                      className="flex-1 bg-[#0F766E] hover:bg-[#0F766E]/90 text-white cursor-pointer"
                    >
                      Approved
                    </Button>
                    <Button
                      size="sm"
                      onClick={() =>
                        updateAppointment(appointment.id, "cancelled")
                      }
                      className="flex-1 bg-[#B91C1C] hover:bg-[#B91C1C]/90 text-white cursor-pointer"
                    >
                      Reject
                    </Button>
                  </>
                )}
                {appointment.status === "completed" && (
                  <Button
                    variant="outline"
                    className="w-full text-muted-foreground h-9 bg-transparent"
                    size="sm"
                    disabled
                  >
                    Completed
                  </Button>
                )}
                {appointment.status === "cancelled" && (
                  <Button
                    variant="outline"
                    className="w-full text-muted-foreground h-9 bg-transparent"
                    size="sm"
                    disabled
                  >
                    No Action Available
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Appointments;
