import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { getAppointmentByDoctorId, updateAppointmentStatusByDoctor } from "../../../services/apiSvc";

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

  const updateAppointment = async (
    appointmentId: number,
    status: string
  ) => {
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
        return "bg-yellow-500";
      case "confirmed":
        return "bg-blue-500";
      case "completed":
        return "bg-green-500";
      case "cancelled":
        return "bg-red-500";
      case "no-show":
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  const filteredAppointments = appointments.filter(
    (appointment) =>
      statusFilter === "all" || appointment.status === statusFilter
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar role="doctor" />
      <main className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">My Appointments</h1>
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

        {loading ? (
          <p>Loading appointments...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAppointments.map((appointment) => (
              <Card key={appointment.id}>
                <CardHeader>
                  <CardTitle className="text-lg">
                    {appointment.patient.user.first_name}{" "}
                    {appointment.patient.user.last_name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-4">
                    <p className="text-sm text-muted-foreground">
                      Clinic: {appointment.clinic.name}
                    </p>
                    <p className="text-sm">
                      Date: {appointment.appointment_date}
                    </p>
                    <p className="text-sm">
                      Time: {appointment.start_time} - {appointment.end_time}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">Status:</span>
                      <Badge className={getStatusColor(appointment.status)}>
                        {appointment.status}
                      </Badge>
                    </div>
                    {appointment.notes && (
                      <p className="text-sm text-muted-foreground">
                        Notes: {appointment.notes}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-2">
                    {appointment.status === "pending" && (
                      <>
                        <Button
                          size="sm"
                          onClick={() =>
                            updateAppointment(appointment.id, "confirmed")
                          }
                          className="flex-1"
                        >
                          Confirm
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() =>
                            updateAppointment(appointment.id, "cancelled")
                          }
                          className="flex-1"
                        >
                          Cancel
                        </Button>
                      </>
                    )}
                    {appointment.status === "confirmed" && (
                      <>
                        <Button
                          size="sm"
                          onClick={() =>
                            updateAppointment(appointment.id, "completed")
                          }
                          className="flex-1"
                        >
                          Complete
                        </Button>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Appointments;
