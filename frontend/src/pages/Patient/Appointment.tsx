/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
  createAppointment,
  getAllClinics,
  getAllDoctors,
  getAppointmentByPatientId,
  updateAppointmentStatusByPatient,
} from "../../../services/apiSvc";

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
  const [cancellingAppointment, setCancellingAppointment] = useState<number | null>(null);
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

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar role="patient" />
      <main className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">My Appointments</h1>
          <Dialog open={showBookDialog} onOpenChange={setShowBookDialog}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700 cursor-pointer">
                Book New Appointment
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Book Appointment</DialogTitle>
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
                      <SelectValue placeholder={loadingClinics ? "Loading clinics..." : "Select clinic"} />
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
                      <SelectValue placeholder={loadingDoctors ? "Loading doctors..." : "Select doctor"} />
                    </SelectTrigger>
                    <SelectContent>
                      {doctors.map((doctor) =>
                        doctor.profile.is_active === true ? (
                          <SelectItem
                            key={doctor.id}
                            value={doctor.id.toString()}
                          >
                            {doctor.first_name} {doctor.last_name}
                          </SelectItem>
                        ) : (
                          <div className="text-sm py-1 px-2">
                            No Doctor Available
                          </div>
                        )
                      )}
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
                <div className="flex gap-2">
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
                  className="w-full bg-blue-600 hover:bg-blue-700 cursor-pointer"
                  disabled={bookingAppointment}
                >
                  {bookingAppointment ? "Booking..." : "Book Appointment"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        {loadingAppointments ? (
          <p>Loading appointments...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {appointments.map(
              (appointment) =>
                appointment.status !== "cancelled" && (
                  <Card key={appointment.id}>
                    <CardHeader>
                      <CardTitle>
                        {appointment.doctor.user.first_name}{" "}
                        {appointment.doctor.user.last_name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-2">
                        {appointment.clinic.name}
                      </p>
                      <p className="text-sm mb-1">
                        Date: {appointment.appointment_date}
                      </p>
                      <p className="text-sm mb-1">
                        Time: {appointment.start_time} - {appointment.end_time}
                      </p>
                      <p className="text-sm mb-4">
                        Status: {appointment.status}
                      </p>
                      {appointment.notes && (
                        <p className="text-sm mb-4">
                          Notes: {appointment.notes}
                        </p>
                      )}
                      {appointment.status !== "cancelled" &&
                        appointment.status !== "completed" && (
                          <Button className="text-white cursor-pointer hover:bg-red-700"
                            variant="destructive"
                            onClick={() =>
                              handleCancelAppointment(appointment.id)
                            }
                            disabled={cancellingAppointment === appointment.id}
                          >
                            {cancellingAppointment === appointment.id ? "Cancelling..." : "Cancel"}
                          </Button>
                        )}
                    </CardContent>
                  </Card>
                )
            )}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Appointment;
