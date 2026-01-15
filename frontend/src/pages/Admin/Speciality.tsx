/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import {
  deleteSpecialityById,
  getAllSpecialities,
} from "../../../services/apiSvc";
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ConfirmDialog from "../../components/ConfirmDialog";
import { toast } from "sonner";

export default function Speciality() {
  const navigate = useNavigate();
  const [specialities, setSpecialities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    specialityId: null as number | null,
    specialityName: "",
  });

  const fetchSpecialities = async () => {
    try {
      const data = await getAllSpecialities();
      if (data.length !== 0) {
        console.log("Specialities :", data);
        setSpecialities(data.data.data);
      }
    } catch (error: any) {
      setError(error.message || "Fail to fetch Specialities");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSpecialities();
  }, []);

  const handleDeleteClick = (speciality: any) => {
    setConfirmDialog({
      isOpen: true,
      specialityId: speciality.id,
      specialityName: speciality.name,
    });
  };

  // 4. HANDLE THE ACTUAL DELETION
  const handleConfirmDelete = async () => {
    if (!confirmDialog.specialityId) return;
    setDeleteLoading(true);
    try {
      await deleteSpecialityById(confirmDialog.specialityId);

      toast.success("Speciality Deleted", {
        description: `The speciality ${confirmDialog.specialityName} has been successfully removed.`,
      });
      await fetchSpecialities();
      setConfirmDialog({
        isOpen: false,
        specialityId: null,
        specialityName: "",
      });
    } catch (err: any) {
      setError(err.message || "Failed to delete speciality");
      toast.error("Error", {
        description:
          err.message || "Failed to delete the speciality. Please try again.",
      });
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleCloseDialog = () => {
    setConfirmDialog({ isOpen: false, specialityId: null, specialityName: "" });
  };

  return (
    <div>
      {loading && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">
              Loading specialities...
            </p>
          </div>
        </div>
      )}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Specialities</h1>
        <button
          onClick={() => navigate("/admin/speciality/create")}
          className="flex items-center gap-2 px-4 py-2 bg-brandBlue text-white rounded-md hover:bg-brandBlue/90 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Create Speciality
        </button>
      </div>

      <div className="bg-white p-4 rounded shadow">
        {/* Example table */}
        <table className="w-full text-left border">
          <thead>
            <tr>
              <th className="border p-2">ID</th>
              <th className="border p-2">Name</th>
              <th className="border p-2">Description</th>
              <th className="border p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {specialities &&
              !loading &&
              !error &&
              specialities.map((speciality: any) => (
                <tr key={speciality.id}>
                  <td className="border p-2">{speciality.id}</td>
                  <td className="border p-2">{speciality.name}</td>
                  <td className="border p-2">{speciality.description}</td>
                  <td className="border p-2 flex gap-2 justify-center">
                    <button
                      className="flex items-center justify-center bg-brandBlue p-2 rounded-md text-white cursor-pointer hover:bg-brandBlue/90"
                      onClick={() =>
                        navigate(`/admin/speciality/edit/${speciality.id}`)
                      }
                    >
                      <Pencil className="inline-block w-4 h-4" />
                    </button>
                    <button
                      className="flex items-center justify-center bg-red-600 p-2 rounded-md text-white cursor-pointer hover:bg-red-700 disabled:opacity-50"
                      onClick={() => handleDeleteClick(speciality)}
                      disabled={deleteLoading}
                    >
                      <Trash2 className="inline-block w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}

            {specialities.length === 0 && !loading && (
              <tr>
                <td className="text-center p-2" colSpan={4}>
                  No speciality found
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
        title="Delete Speciality"
        description={`Are you sure you want to delete "${confirmDialog.specialityName}"? Doctors assigned to this speciality may be affected.`}
        confirmText="Delete"
        cancelText="Cancel"
        isLoading={deleteLoading}
      />
    </div>
  );
}
