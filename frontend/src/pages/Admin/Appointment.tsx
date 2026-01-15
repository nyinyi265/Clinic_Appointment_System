/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import {
  deleteAppointmentById,
  getAllAppointments,
} from "../../../services/apiSvc";
import { Loader2, Trash2 } from "lucide-react";
import ConfirmDialog from "../../components/ConfirmDialog";
import { toast } from "sonner";

export default function Appointment() {
  const [appointments, setAppointment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    appointmentId: null as number | null,
    patientName: "",
  });

  const fetchAppointments = async () => {
    try {
      const data = await getAllAppointments();
      if (data.length !== 0) {
        console.log("Appointments :", data);
        setAppointment(data.data.data);
      }
    } catch (err: any) {
      setError(err.message || "Fail to fetch appointments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleDeleteClick = (appt: any) => {
    const name = appt.patient?.user
      ? `${appt.patient.user.first_name} ${appt.patient.user.last_name}`
      : "Unknown Patient";

    setConfirmDialog({
      isOpen: true,
      appointmentId: appt.id,
      patientName: name,
    });
  };

  const handleConfirmDelete = async () => {
    if (!confirmDialog.appointmentId) return;
    setDeleteLoading(true);
    try {
      await deleteAppointmentById(confirmDialog.appointmentId);

      toast.success("Appointment Deleted", {
        description: `The appointment for ${confirmDialog.patientName} has been successfully removed.`,
      });

      await fetchAppointments();
      setConfirmDialog({ isOpen: false, appointmentId: null, patientName: "" });
    } catch (err: any) {
      setError(err.message || "Fail to delete appointment");
      toast.error("Error", {
        description:
          err.message || "Failed to delete the appointment. Please try again.",
      });
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleCloseDialog = () => {
    setConfirmDialog({ isOpen: false, appointmentId: null, patientName: "" });
  };

  return (
    <div>
      {loading && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">
              Loading appointments...
            </p>
          </div>
        </div>
      )}
      <h1 className="text-2xl font-bold mb-4">Appointments</h1>

      <div className="bg-white p-4 rounded shadow">
        <table className="w-full text-left border">
          <thead>
            <tr>
              <th className="border p-2">ID</th>
              <th className="border p-2">Patient</th>
              <th className="border p-2">Doctor</th>
              <th className="border p-2">Clinic</th>
              <th className="border p-2">Date</th>
              <th className="border p-2">Start Time</th>
              <th className="border p-2">End Time</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {appointments &&
              !loading &&
              !error &&
              appointments.map((appointment: any) => (
                <tr key={appointment.id}>
                  <td className="border p-2">{appointment.id}</td>
                  <td className="border p-2">
                    {appointment.patient?.user
                      ? `${appointment.patient.user.first_name} ${appointment.patient.user.last_name}`
                      : "N/A"}
                  </td>
                  <td className="border p-2">
                    {appointment.doctor?.user
                      ? `${appointment.doctor.user.first_name} ${appointment.doctor.user.last_name}`
                      : "N/A"}
                  </td>
                  <td className="border p-2">
                    {appointment.clinic?.name || "N/A"}
                  </td>
                  <td className="border p-2">{appointment.appointment_date}</td>
                  <td className="border p-2">{appointment.start_time}</td>
                  <td className="border p-2">{appointment.end_time}</td>
                  <td className="border p-2">{appointment.status}</td>
                  <td className="border p-2 flex justify-center">
                    <button
                      className="flex items-center justify-center bg-red-600 p-2 rounded-md text-white cursor-pointer hover:bg-red-700 disabled:opacity-50"
                      onClick={() => handleDeleteClick(appointment)}
                      disabled={deleteLoading}
                    >
                      <Trash2 className="inline-block w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}

            {appointments.length === 0 && !loading && (
              <tr>
                <td colSpan={8} className="border p-2 text-center">
                  No Appointments
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={handleCloseDialog}
        onConfirm={handleConfirmDelete}
        title="Cancel Appointment"
        description={`Are you sure you want to cancel the appointment for "${confirmDialog.patientName}"? This slot will become available for other patients.`}
        confirmText="Delete"
        cancelText="Cancel"
        isLoading={deleteLoading}
      />
    </div>
  );
}
