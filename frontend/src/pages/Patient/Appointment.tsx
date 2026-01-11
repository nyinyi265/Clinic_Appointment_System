/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Navbar from "../../components/common/navbar";
import Footer from "../../components/common/footer";
import LoadingOverlay from "../../components/common/LoadingOverlay";
import {
  createAppointment,
  getAllClinics,
  getAllDoctors,
  getAppointmentByPatientId,
  updateAppointmentStatusByPatient,
} from "../../../services/apiSvc";
import { Calendar, Clock, MapPin, MessageSquare, Plus } from "lucide-react";

interface Appointment {
  id: number;
  appointment_date: string;
  start_time: string;
  end_time: string;
  status: string;
  notes: string;
  doctor: {
    user: {
      first_name: string;
      last_name: string;
    };
  };
  clinic: {
    name: string;
  };
}

interface Clinic {
  id: number;
  name: string;
}

interface Doctor {
  id: number;
  first_name: string;
  last_name: string;
  profile: {
    id: number;
    license_number: string;
    is_active: boolean;
  };
}

const Appointment = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loadingAppointments, setLoadingAppointments] = useState(true);
  const [loadingClinics, setLoadingClinics] = useState(true);
  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [bookingAppointment, setBookingAppointment] = useState(false);
  const [cancellingAppointment, setCancellingAppointment] = useState<
    number | null
  >(null);
  const [showBookDialog, setShowBookDialog] = useState(false);
  const [selectedClinic, setSelectedClinic] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    fetchAppointments();
    fetchClinics();
    fetchDoctors();
  }, [navigate]);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const patientProfileId = user.data.profile.id;

  const fetchAppointments = async () => {
    try {
      setLoadingAppointments(true);
      const data = await getAppointmentByPatientId(patientProfileId);
      if (data.status === "success") {
        setAppointments(data.data.data);
        console.log(data.data.data);
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
    } finally {
      setLoadingAppointments(false);
    }
  };

  const fetchClinics = async () => {
    try {
      setLoadingClinics(true);
      const data = await getAllClinics();
      if (data.status === "success") {
        setClinics(data.data.data);
      }
    } catch (error) {
      console.error("Error fetching clinics:", error);
    } finally {
      setLoadingClinics(false);
    }
  };

  const fetchDoctors = async () => {
    try {
      setLoadingDoctors(true);
      const data = await getAllDoctors();
      if (data.status === "success") {
        setDoctors(data.data.data);
      }
    } catch (error) {
      console.error("Error fetching doctors:", error);
    } finally {
      setLoadingDoctors(false);
    }
  };

  const handleBookAppointment = async () => {
    try {
      setBookingAppointment(true);
      const requestData = JSON.stringify({
        doctor_profile_id: selectedDoctor,
        patient_profile_id: patientProfileId,
        clinic_id: selectedClinic,
        appointment_date: appointmentDate,
        start_time: startTime,
        end_time: endTime,
        status: "pending",
        notes,
      });
      const data = await createAppointment(requestData);
      if (data.status === "success") {
        setShowBookDialog(false);
        fetchAppointments();
        // Reset form
        setSelectedClinic("");
        setSelectedDoctor("");
        setAppointmentDate("");
        setStartTime("");
        setEndTime("");
        setNotes("");
      }
    } catch (error) {
      console.error("Error booking appointment:", error);
    } finally {
      setBookingAppointment(false);
    }
  };

  const handleCancelAppointment = async (id: number) => {
    try {
      setCancellingAppointment(id);
      const status = JSON.stringify({
        status: "cancelled",
      });
      const data = await updateAppointmentStatusByPatient(id, status);
      if (data.status === "success") {
        fetchAppointments();
      }
    } catch (error) {
      console.error("Error cancelling appointment:", error);
    } finally {
      setCancellingAppointment(null);
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

  const activeAppointments = appointments.filter(
    (appointment) => appointment.status !== "cancelled"
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar role="patient" />

      <main className="container mx-auto py-8 px-4 space-y-8 bg-gradient-to-b from-background to-muted/20 min-h-[calc(100vh-200px)] mt-1">
        {/* Header */}
        <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight text-foreground/90">
              My Appointments
            </h1>
            <p className="text-muted-foreground">
              Manage your healthcare appointments and bookings.
            </p>
          </div>
          <Dialog open={showBookDialog} onOpenChange={setShowBookDialog}>
            <DialogTrigger asChild>
              <Button className="shadow-sm gap-2 bg-brandBlue hover:bg-brandBlue/90 text-white cursor-pointer">
                <Plus className="h-4 w-4" />
                Book New Appointment
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Book New Appointment</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="clinic">Clinic</Label>
                  <Select
                    value={selectedClinic}
                    onValueChange={setSelectedClinic}
                    disabled={loadingClinics}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          loadingClinics
                            ? "Loading clinics..."
                            : "Select clinic"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {clinics.map((clinic) => (
                        <SelectItem
                          key={clinic.id}
                          value={clinic.id.toString()}
                        >
                          {clinic.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="doctor">Doctor</Label>
                  <Select
                    value={selectedDoctor}
                    onValueChange={setSelectedDoctor}
                    disabled={loadingDoctors}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          loadingDoctors
                            ? "Loading doctors..."
                            : "Select doctor"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {doctors
                        .filter((doctor) => doctor.profile.is_active)
                        .map((doctor) => (
                          <SelectItem
                            key={doctor.id}
                            value={doctor.profile.id.toString()}
                          >
                            {doctor.first_name} {doctor.last_name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={appointmentDate}
                    onChange={(e) => setAppointmentDate(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="start">Start Time</Label>
                    <Input
                      id="start"
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="end">End Time</Label>
                    <Input
                      id="end"
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="notes">Notes</Label>
                  <Input
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Optional notes"
                  />
                </div>
                <Button
                  onClick={handleBookAppointment}
                  className="w-full bg-brandBlue hover:bg-brandBlue/90 text-white cursor-pointer"
                  disabled={bookingAppointment}
                >
                  {bookingAppointment ? "Booking..." : "Book Appointment"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </section>

        {loadingAppointments && <LoadingOverlay message="Loading appointments..." />}

        {!loadingAppointments && (
          <>
            {activeAppointments.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeAppointments.map((appointment) => (
                  <Card
                    key={appointment.id}
                    className="overflow-hidden border-none shadow-sm hover:shadow-md transition-shadow ring-1 ring-border/50"
                  >
                    <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-4">
                      <div className="space-y-1">
                        <h3 className="font-semibold text-lg tracking-tight">
                          {appointment.doctor.user.first_name} {appointment.doctor.user.last_name}
                        </h3>
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                          <MapPin className="h-3.5 w-3.5" />
                          <span>{appointment.clinic.name}</span>
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className={`px-2.5 py-0.5 font-medium border shadow-none ${getStatusColor(appointment.status)}`}
                      >
                        {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
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

                      {appointment.notes && (
                        <div className="flex items-start gap-2.5 rounded-lg border bg-accent/30 p-3">
                          <MessageSquare className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                          <div className="space-y-0.5">
                            <span className="text-[10px] uppercase font-bold tracking-wider text-primary/70">
                              Notes
                            </span>
                            <p className="text-xs leading-relaxed text-muted-foreground italic">
                              "{appointment.notes}"
                            </p>
                          </div>
                        </div>
                      )}
                    </CardContent>

                    <div className="p-6 pt-0">
                      {appointment.status === "pending" && (
                        <Button
                          variant="destructive"
                          className="w-full shadow-sm gap-2 cursor-pointer"
                          onClick={() => handleCancelAppointment(appointment.id)}
                          disabled={cancellingAppointment === appointment.id}
                        >
                          {cancellingAppointment === appointment.id ? "Cancelling..." : "Cancel Appointment"}
                        </Button>
                      )}
                      {(appointment.status === "confirmed" || appointment.status === "completed") && (
                        <Button
                          variant="outline"
                          className="w-full text-muted-foreground cursor-not-allowed"
                          disabled
                        >
                          {appointment.status === "confirmed" ? "Confirmed" : "Completed"}
                        </Button>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-gray-50 rounded-lg shadow-sm mx-auto border border-border/50">
                <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
                  <Calendar className="h-12 w-12 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">No Appointments Yet</h3>
                <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                  You haven't booked any appointments yet. Schedule your first healthcare consultation to get started.
                </p>
                <Dialog open={showBookDialog} onOpenChange={setShowBookDialog}>
                  <DialogTrigger asChild>
                    <Button className="shadow-sm gap-2 bg-brandBlue hover:bg-brandBlue/90 text-white cursor-pointer">
                      <Plus className="h-4 w-4" />
                      Book Your First Appointment
                    </Button>
                  </DialogTrigger>
                </Dialog>
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Appointment;
