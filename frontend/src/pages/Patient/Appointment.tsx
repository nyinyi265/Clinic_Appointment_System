/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
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
import ConfirmDialog from "../../components/ConfirmDialog";
import {
  createAppointment,
  getAllClinics,
  getAllDoctors,
  getAppointmentByPatientId,
  updateAppointmentStatusByPatient,
  getDoctorsByClinic,
  getClinicsByDoctor,
  getSchedulesByDoctor,
} from "../../../services/apiSvc";
import { Calendar, MapPin, Plus, MessageSquare } from "lucide-react";
import { getStorage } from "../../util/storage";

// --- Interfaces ---
interface Appointment {
  id: number;
  appointment_date: string;
  start_time: string;
  end_time: string;
  status: string;
  notes: string;
  doctor: { user: { first_name: string; last_name: string } };
  clinic: { name: string };
}

interface Clinic {
  id: number;
  name: string;
}

interface Doctor {
  id: number;
  user: { first_name: string; last_name: string };
  profile?: { id: number };
}

interface DoctorClinicPivot {
  doctor_profile_id: number;
  clinic_id: number;
  doctor: Doctor;
  clinic: Clinic;
}

const Appointment = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  // Master Lists (Initial Load)
  const [allClinics, setAllClinics] = useState<Clinic[]>([]);
  const [allDoctors, setAllDoctors] = useState<Doctor[]>([]);

  // Display Lists (Filtered)
  const [displayClinics, setDisplayClinics] = useState<Clinic[]>([]);
  const [displayDoctors, setDisplayDoctors] = useState<Doctor[]>([]);

  // Selection States
  const [selectedClinic, setSelectedClinic] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState(""); // This stores Doctor Profile ID
  const [appointmentDate, setAppointmentDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [notes, setNotes] = useState("");

  // Loading & UI States
  const [loading, setLoading] = useState({
    appointments: true,
    clinics: false,
    doctors: false,
  });
  const [showBookDialog, setShowBookDialog] = useState(false);
  const [bookingAppointment, setBookingAppointment] = useState(false);
  const [cancellingAppointment, setCancellingAppointment] = useState<
    number | null
  >(null);
  const [confirmCancel, setConfirmCancel] = useState({
    isOpen: false,
    appointmentId: null as number | null,
  });
  const [schedules, setSchedules] = useState<any[]>([]);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);

  const user = JSON.parse(getStorage().getItem("user") || "{}");
  const patientProfileId = user?.data?.profile?.id;

  // 1. Initial Load
  useEffect(() => {
    const token = getStorage().getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const init = async () => {
      try {
        const [appts, clincs, docs] = await Promise.all([
          getAppointmentByPatientId(patientProfileId),
          getAllClinics(),
          getAllDoctors(),
        ]);
        setAppointments(appts.data.data);
        setAllClinics(clincs.data.data);
        setDisplayClinics(clincs.data.data);
        setAllDoctors(docs.data.data);
        setDisplayDoctors(docs.data.data);
      } catch (err) {
        console.error("Initialization error", err);
      } finally {
        setLoading((prev) => ({ ...prev, appointments: false }));
      }
    };
    init();
  }, [navigate]);

  // 2. Logic: When Clinic is Selected -> Filter Doctors
  useEffect(() => {
    const filterByClinic = async () => {
      if (selectedClinic && selectedClinic !== "0") {
        setLoading((p) => ({ ...p, doctors: true }));
        try {
          const res = await getDoctorsByClinic(Number(selectedClinic));
          const filtered = res.data.data.map((p: DoctorClinicPivot) => ({
            ...p.doctor,
            profile: { id: p.doctor_profile_id }, // Ensure profile ID is attached
          }));
          setDisplayDoctors(filtered);
        } catch (error) {
          console.error(error);
        } finally {
          setLoading((p) => ({ ...p, doctors: false }));
        }
      } else if (!selectedDoctor) {
        setDisplayDoctors(allDoctors);
      }
    };
    filterByClinic();
  }, [selectedClinic]);

  console.log("available slots", availableSlots);

  // 3. Logic: When Doctor is Selected -> Filter Clinics
  useEffect(() => {
    const filterByDoctor = async () => {
      if (selectedDoctor && selectedDoctor !== "0") {
        setLoading((p) => ({ ...p, clinics: true }));
        try {
          const res = await getClinicsByDoctor(Number(selectedDoctor));
          const filtered = res.data.data.map((p: any) => p.clinic);
          setDisplayClinics(filtered);
        } catch (error) {
          console.error(error);
        } finally {
          setLoading((p) => ({ ...p, clinics: false }));
        }
      } else if (!selectedClinic) {
        setDisplayClinics(allClinics);
      }
    };
    filterByDoctor();
  }, [selectedDoctor]);

  // 4. Fetch Schedules (Requires Doctor Profile ID + Clinic ID)
  useEffect(() => {
    const fetchSlots = async () => {
      if (
        selectedDoctor &&
        selectedClinic &&
        selectedDoctor !== "0" &&
        selectedClinic !== "0"
      ) {
        try {
          const res = await getSchedulesByDoctor(Number(selectedDoctor));
          // Only show schedules for the specific clinic chosen
          const filteredSchedules = res.data.data.filter(
            (s: any) => Number(s.clinic_id) === Number(selectedClinic)
          );
          console.log("filteredSchedules", filteredSchedules);
          setSchedules(filteredSchedules);
        } catch (error) {
          console.error(error);
        }
      }
    };
    fetchSlots();
  }, [selectedDoctor, selectedClinic]);

  // 5. Calculate Time Slots based on Date
  useEffect(() => {
    if (appointmentDate && schedules.length > 0) {
      // 1. Find the schedule (this part is now working in your logs)
      const daySchedule = schedules.find((s) => {
        const apiDateOnly = s.date.split("T")[0];
        return apiDateOnly === appointmentDate;
      });

      if (daySchedule) {
        const slots: string[] = [];
        const startTimeStr = daySchedule.start_time
          .split("T")[1]
          .substring(0, 5);
        const endTimeStr = daySchedule.end_time.split("T")[1].substring(0, 5);

        const baseDate = `2000-01-01`;
        const current = new Date(`${baseDate}T${startTimeStr}`);
        const end = new Date(`${baseDate}T${endTimeStr}`);
        const duration = Number(daySchedule.slot_duration) || 30;

        const bookedTimes = appointments
          .filter(
            (appt) =>
              appt.appointment_date === appointmentDate &&
              appt.status !== "cancelled"
          )
          .map((appt) => appt.start_time.substring(0, 5));

        // Ensure the loop runs correctly
        while (current < end) {
          const timeString = current.toTimeString().substring(0, 5);
          if (!bookedTimes.includes(timeString)) {
            slots.push(timeString);
          }
          current.setMinutes(current.getMinutes() + duration);
        }
        setAvailableSlots(slots);
      } else {
        setAvailableSlots([]);
      }
    }
  }, [appointmentDate, schedules]);

  const handleBookAppointment = async () => {
    if (!startTime || !endTime) return;
    try {
      setBookingAppointment(true);
      const requestData = JSON.stringify({
        doctor_profile_id: Number(selectedDoctor),
        patient_profile_id: patientProfileId,
        clinic_id: Number(selectedClinic),
        appointment_date: appointmentDate,
        start_time: startTime,
        end_time: endTime,
        status: "pending",
        notes,
      });
      const data = await createAppointment(requestData);
      if (data.status === "success") {
        toast.success("Appointment Booked", {
          description: `Your appointment for ${appointmentDate} at ${startTime} has been scheduled.`,
        });
        setShowBookDialog(false);
        // Reset and refresh
        setSelectedClinic("");
        setSelectedDoctor("");
        setAppointmentDate("");
        setNotes("");
        const freshAppts = await getAppointmentByPatientId(patientProfileId);
        setAppointments(freshAppts.data.data);
      }
    } catch (error) {
      console.error(error);
      toast.error("Booking Failed", {
        description: "Something went wrong while booking your appointment.",
      });
    } finally {
      setBookingAppointment(false);
    }
  };

  const handleCancelAppointment = async (id: number) => {
    try {
      // Set loading state for this specific ID
      setCancellingAppointment(id);

      const statusData = "cancelled";

      // Call your existing API service
      const data = await updateAppointmentStatusByPatient(id, statusData);

      if (data.status === "success") {
        toast.success("Appointment Cancelled", {
          description: "The appointment has been removed from your schedule.",
        });
        const freshAppts = await getAppointmentByPatientId(patientProfileId);
        setAppointments(freshAppts.data.data);
      }
    } catch (error) {
      console.error("Error cancelling appointment:", error);
      toast.error("Cancellation Failed", {
        description:
          "Could not cancel the appointment. Please try again later.",
      });
    } finally {
      setCancellingAppointment(null);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending:
        "bg-yellow-100 text-yellow-700 border-yellow-200 hover:bg-yellow-300",
      confirmed: "bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-300",
      completed:
        "bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-300",
      cancelled: "bg-red-100 text-red-700 border-red-200 hover:bg-red-300",
    };
    return colors[status] || "bg-gray-100 text-gray-700";
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar role="patient" />
      <main className="container mx-auto py-8 px-4 mt-1">
        <section className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-bold">My Appointments</h1>
            <p className="text-muted-foreground">
              Manage your healthcare bookings.
            </p>
          </div>

          <Dialog open={showBookDialog} onOpenChange={setShowBookDialog}>
            <DialogTrigger asChild>
              <Button className="bg-brandBlue text-white cursor-pointer hover:bg-brandBlue/90">
                <Plus className="mr-2 h-4 w-4" /> Book New Appointment
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Book New Appointment</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                {/* CLINIC SELECT */}
                <div className="space-y-2">
                  <Label>Clinic</Label>
                  <Select
                    value={selectedClinic}
                    onValueChange={(val) => {
                      setSelectedClinic(val);
                      setAppointmentDate(""); // Reset downstream
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Clinic" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">All Clinics</SelectItem>
                      {displayClinics.map((c) => (
                        <SelectItem key={c.id} value={c.id.toString()}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* DOCTOR SELECT */}
                <div className="space-y-2">
                  <Label>Doctor</Label>
                  <Select
                    value={selectedDoctor}
                    onValueChange={(val) => {
                      setSelectedDoctor(val);
                      setAppointmentDate(""); // Reset downstream
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          loading.doctors
                            ? "Loading doctors..."
                            : "Select Doctor"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">All Doctors</SelectItem>
                      {displayDoctors.map((d: any) => (
                        <SelectItem
                          key={d.profile?.id}
                          value={d.profile?.id.toString()}
                        >
                          Dr. {d.user?.first_name || d.first_name}{" "}
                          {d.user?.last_name || d.last_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* DATE SELECT */}
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Input
                    type="date"
                    value={appointmentDate}
                    onChange={(e) => setAppointmentDate(e.target.value)}
                    disabled={!selectedDoctor || !selectedClinic}
                  />
                </div>

                {/* TIME SLOT SELECT */}
                <div className="space-y-2">
                  <Label>Available Time Slots</Label>
                  <Select
                    value={startTime}
                    onValueChange={(val) => {
                      setStartTime(val);
                      const day = schedules.find(
                        (s) => s.date === appointmentDate
                      );
                      const duration = day?.slot_duration || 30;
                      const [h, m] = val.split(":").map(Number);
                      const d = new Date();
                      d.setHours(h, m + duration);
                      setEndTime(d.toTimeString().substring(0, 5));
                    }}
                    disabled={availableSlots.length === 0}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          availableSlots.length > 0
                            ? "Select Time"
                            : "No slots available"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {availableSlots.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Notes</Label>
                  <Input
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Reason for visit"
                  />
                </div>

                <Button
                  onClick={handleBookAppointment}
                  className="w-full bg-brandBlue text-white cursor-pointer hover:bg-brandBlue/90"
                  disabled={bookingAppointment || !startTime}
                >
                  {bookingAppointment ? "Booking..." : "Confirm Booking"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </section>

        {loading.appointments ? (
          <LoadingOverlay message="Loading appointments..." />
        ) : appointments.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-8 bg-card rounded-2xl border border-dashed border-muted-foreground/25 shadow-sm mt-4">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-brandBlue/10 blur-2xl rounded-full" />
              <div className="relative mx-auto w-20 h-20 bg-brandBlue/10 rounded-2xl flex items-center justify-center">
                <Calendar className="h-10 w-10 text-brandBlue" />
              </div>
            </div>

            <h3 className="text-xl font-bold text-foreground mb-2">
              No upcoming appointments
            </h3>
            <p className="text-muted-foreground mb-8 max-w-[300px] mx-auto text-sm leading-relaxed">
              You don't have any active appointments scheduled. Book a new one
              to see it here.
            </p>

            <Dialog open={showBookDialog} onOpenChange={setShowBookDialog}>
              <DialogTrigger asChild>
                <Button
                  size="lg"
                  className="shadow-md gap-2 bg-brandBlue hover:bg-brandBlue/90 text-white cursor-pointer"
                >
                  <Plus className="h-5 w-5" />
                  Book Your First Appointment
                </Button>
              </DialogTrigger>
            </Dialog>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {appointments
              .filter((appt) => appt.status !== "cancelled")
              .map((appt) => (
                <Card key={appt.id} className="shadow-sm">
                  <CardHeader className="flex flex-row items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">
                        Dr. {appt.doctor.user.first_name}{" "}
                        {appt.doctor.user.last_name}
                      </h3>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="h-3 w-3 mr-1" />
                        {appt.clinic.name}
                      </div>
                    </div>
                    <Badge className={getStatusColor(appt.status)}>
                      {appt.status}
                    </Badge>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {appt.notes && (
                      <div className="flex items-start gap-3 rounded-lg border bg-accent/40 p-3 mb-3">
                        <MessageSquare className="h-4 w-4 text-brandBlue shrink-0 mt-0.5" />
                        <div className="space-y-1">
                          <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
                            Patient Note
                          </span>
                          <p className="text-xs leading-relaxed text-foreground/80 italic">
                            "{appt.notes}"
                          </p>
                        </div>
                      </div>
                    )}
                    <div className="grid grid-cols-2 gap-2 bg-muted/30 p-3 rounded-lg">
                      <div>
                        <Label className="text-[10px] uppercase">Date</Label>
                        <p className="text-sm font-medium">
                          {appt.appointment_date}
                        </p>
                      </div>
                      <div className="border-l pl-3">
                        <Label className="text-[10px] uppercase">Time</Label>
                        <p className="text-sm font-medium">{appt.start_time}</p>
                      </div>
                    </div>
                    {appt.status === "pending" && (
                      <Button
                        variant="destructive"
                        className="w-full shadow-sm gap-2 cursor-pointer mt-2 text-white cursor-pointer"
                        onClick={() =>
                          setConfirmCancel({
                            isOpen: true,
                            appointmentId: appt.id,
                          })
                        }
                        disabled={cancellingAppointment === appt.id}
                      >
                        {cancellingAppointment === appt.id ? (
                          "Cancelling..."
                        ) : (
                          <>Cancel Appointment</>
                        )}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
          </div>
        )}
        <ConfirmDialog
          isOpen={confirmCancel.isOpen}
          onClose={() =>
            setConfirmCancel({ isOpen: false, appointmentId: null })
          }
          onConfirm={() => {
            if (confirmCancel.appointmentId) {
              handleCancelAppointment(confirmCancel.appointmentId);
              setConfirmCancel({ isOpen: false, appointmentId: null });
            }
          }}
          title="Cancel Appointment"
          description="Are you sure you want to cancel this appointment? This action cannot be undone."
        />
      </main>
      <Footer />
    </div>
  );
};

export default Appointment;
