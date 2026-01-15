/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { Plus, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import AdminLayout from "./Layout";
import AssignDoctorForm from "./AssignDoctorForm";
import ConfirmDialog from "../../components/ConfirmDialog"; // 1. Import the dialog
import {
  getDoctorClinicAssignments,
  removeDoctorFromClinic,
} from "../../../services/apiSvc";

export default function AssignDoctorPage() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false); // Changed to boolean to match Clinic logic

  // 2. Initialize ConfirmDialog state
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    assignmentId: null as number | null,
    doctorName: "",
  });

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const res = await getDoctorClinicAssignments();
      setAssignments(res.data.data || []);
    } catch (error) {
      console.log(error);
      toast.error("Failed to load assignments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  // 3. Update Delete Click handler to open dialog
  const handleDeleteClick = (item: any) => {
    setConfirmDialog({
      isOpen: true,
      assignmentId: item.id,
      doctorName: `Dr. ${item.doctor?.user?.first_name} ${item.doctor?.user?.last_name}`,
    });
  };

  // 4. Implement Confirm and Close handlers
  const handleConfirmDelete = async () => {
    if (!confirmDialog.assignmentId) return;

    setDeleteLoading(true);
    try {
      await removeDoctorFromClinic(confirmDialog.assignmentId);

      toast.success("Assignment Removed", {
        description: `The assignment for ${confirmDialog.doctorName} has been removed.`,
      });

      await fetchAssignments();
      handleCloseDialog();
    } catch (error: any) {
      toast.error("Error", {
        description: error.message || "Failed to remove assignment.",
      });
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleCloseDialog = () => {
    setConfirmDialog({ isOpen: false, assignmentId: null, doctorName: "" });
  };

  return (
    <AdminLayout>
      <div>
        {loading && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">
                Loading assignments...
              </p>
            </div>
          </div>
        )}

        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Assign Doctors</h1>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-brandBlue text-white rounded-md hover:bg-brandBlue/90 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Assign Doctor
          </button>
        </div>

        {showForm ? (
          <div className="animate-in zoom-in-95 duration-300">
            <AssignDoctorForm
              onSuccess={() => {
                setShowForm(false);
                fetchAssignments();
              }}
              onCancel={() => setShowForm(false)}
            />
          </div>
        ) : (
          <div className="bg-white p-4 rounded shadow overflow-x-auto">
            <table className="w-full text-left border">
              <thead>
                <tr>
                  <th className="border p-2">ID</th>
                  <th className="border p-2">Doctor Name</th>
                  <th className="border p-2">Clinic Name</th>
                  <th className="border p-2">Assigned Date</th>
                  <th className="border p-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {assignments.map((item: any) => (
                  <tr key={item.id}>
                    <td className="border p-2">{item.id}</td>
                    <td className="border p-2">
                      Dr. {item.doctor?.user?.first_name}{" "}
                      {item.doctor?.user?.last_name}
                    </td>
                    <td className="border p-2">{item.clinic?.name}</td>
                    <td className="border p-2">
                      {new Date(item.created_at).toLocaleDateString()}
                    </td>
                    <td className="border p-2 text-center">
                      <button
                        className="flex items-center justify-center bg-red-600 p-2 rounded-md text-white cursor-pointer hover:bg-red-700 disabled:opacity-50 mx-auto"
                        onClick={() => handleDeleteClick(item)} // Pass item instead of just ID
                        disabled={deleteLoading}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                {assignments.length === 0 && !loading && (
                  <tr>
                    <td colSpan={5} className="border p-2 text-center">
                      No Doctor-Clinic assignments
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* 5. Add ConfirmDialog Component */}
        <ConfirmDialog
          isOpen={confirmDialog.isOpen}
          onClose={handleCloseDialog}
          onConfirm={handleConfirmDelete}
          title="Remove Assignment"
          description={`Are you sure you want to remove the assignment for ${confirmDialog.doctorName}?`}
          confirmText="Delete"
          cancelText="Cancel"
          isLoading={deleteLoading}
        />
      </div>
    </AdminLayout>
  );
}
