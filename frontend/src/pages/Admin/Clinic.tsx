/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { deleteClinicById, getAllClinics } from "../../../services/apiSvc";
import { Pencil, Trash2, Plus, Loader2 } from "lucide-react";

export default function Clinic() {
  const navigate = useNavigate();
  const [clinics, setClinics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClinics = async () => {
    try {
      const data = await getAllClinics();
      if (data.length !== 0) {
        console.log(data);
        setClinics(data.data.data);
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch clinics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClinics();
  }, []);

  const deleteClinic = async (id: number) => {
    try {
      await deleteClinicById(id);
      fetchClinics();
    } catch (err: any) {
      setError(err.message || "Failed to delete clinic");
    }
  };
  return (
    <div>
      {loading && (
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading clinics...</p>
        </div>
      </div>
    )}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Clinics</h1>
        <button
          onClick={() => navigate("/admin/clinics/create")}
          className="flex items-center gap-2 px-4 py-2 bg-brandBlue text-white rounded-md hover:bg-brandBlue/90 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Create Clinic
        </button>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <table className="w-full text-left border">
          <thead>
            <tr>
              <th className="border p-2">ID</th>
              <th className="border p-2">Name</th>
              <th className="border p-2">Address</th>
              <th className="border p-2">Phone No.</th>
              <th className="border p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {clinics &&
              !loading &&
              !error &&
              clinics.map((clinic: any) => (
                <tr key={clinic.id}>
                  <td className="border p-2"> {clinic.id} </td>
                  <td className="border p-2"> {clinic.name} </td>
                  <td className="border p-2"> {clinic.address} </td>
                  <td className="border p-2"> {clinic.phone_number} </td>
                  <td className="border p-2 flex gap-2 justify-center">
                    <button
                      className="flex items-center justify-center bg-brandBlue p-2 rounded-md text-white cursor-pointer hover:bg-brandBlue/90"
                      onClick={() => navigate(`/admin/clinics/edit/${clinic.id}`)}
                    >
                      <Pencil className="inline-block w-4 h-4" />
                    </button>
                    <button
                      className="flex items-center justify-center bg-red-600 p-2 rounded-md text-white cursor-pointer hover:bg-red-700"
                      onClick={() => deleteClinic(clinic.id)}
                    >
                      <Trash2 className="inline-block w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}

            {clinics.length === 0 && !loading && (
              <tr>
                <td colSpan={5} className="border p-2 text-center">
                  No clinics found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
