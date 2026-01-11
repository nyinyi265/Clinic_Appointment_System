/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { deleteDoctorById, getAllDoctors } from "../../../services/apiSvc";
import { Loader2, Trash2, Plus, Pencil } from "lucide-react";

export default function Doctor() {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDoctors = async () => {
    try {
      const data = await getAllDoctors();
      if (data.length !== 0) {
        console.log(data);
        setDoctors(data.data.data);
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch doctors");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const deleteDoctor = async (id: number) => {
    try {
      await deleteDoctorById(id);
      fetchDoctors();
    } catch (err: any) {
      setError(err.message || "Failed to delete doctor");
    }
  };

  return (
    <div>
      {loading && (
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading doctors...</p>
        </div>
      </div>
    )}
    <div className="flex justify-between items-center mb-4">
      <h1 className="text-2xl font-bold">Doctors</h1>
      <button
        onClick={() => navigate("/admin/doctors/create")}
        className="flex items-center gap-2 px-4 py-2 bg-brandBlue text-white rounded-md hover:bg-brandBlue/90 cursor-pointer"
      >
        <Plus className="w-4 h-4" />
        Create Doctor
      </button>
    </div>

    <div className="bg-white p-4 rounded shadow">
        {/* Example table */}
        <table className="w-full text-left border">
          <thead>
            <tr>
              <th className="border p-2">ID</th>
              <th className="border p-2">Name</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Phone No.</th>
              <th className="border p-2">License No.</th>
              <th className="border p-2">Specialities</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {!error && doctors &&
              doctors.map((doctor: any) => (
                <tr key={doctor.id}>
                  <td className="border p-2">{doctor.id}</td>
                  <td className="border p-2">
                    {doctor.first_name} {doctor.last_name}
                  </td>
                  <td className="border p-2">{doctor.email}</td>
                  <td className="border p-2">{doctor.phone_number}</td>
                  <td className="border p-2">{doctor.profile.license_number}</td>
                  <td className="border p-2">{doctor.specialities?.map((s: any) => s.name).join(', ') || '-'}</td>
                  <td className="border p-2">{doctor.profile.is_active}</td>
                  <td className="border p-2 flex gap-2 justify-center">
                    <button
                      className="flex items-center justify-center bg-brandBlue p-2 rounded-md text-white cursor-pointer hover:bg-brandBlue/90"
                      onClick={() => navigate(`/admin/doctors/edit/${doctor.id}`)}
                    >
                      <Pencil className="inline-block w-4 h-4" />
                    </button>
                    <button
                      className="flex items-center justify-center bg-red-600 p-2 rounded-md text-white cursor-pointer hover:bg-red-700"
                      onClick={() => deleteDoctor(doctor.id)}
                    >
                      <Trash2 className="inline-block w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}

            {doctors.length === 0 && !loading && (
              <tr>
                <td colSpan={8} className="border p-2 text-center">
                  No Doctors
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
