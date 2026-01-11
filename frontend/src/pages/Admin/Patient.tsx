/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { getAllPatients, deletePatientById } from "../../../services/apiSvc";
import { Loader2, Trash2 } from "lucide-react";

export default function Patient() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPatients = async () => {
    try {
      const data = await getAllPatients();
      if (data.length !== 0) {
        console.log(data);
        setPatients(data.data.data);
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch patients");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const deletePatient = async (id: number) => {
    try {
      await deletePatientById(id);
      fetchPatients();
    } catch (err: any) {
      setError(err.message || "Failed to delete patient");
    }
  };
  return (
    <div>
      {loading && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Loading patients...</p>
          </div>
        </div>
      )}
      <h1 className="text-2xl font-bold mb-4">Patients</h1>

      <div className="bg-white p-4 rounded shadow">
        {/* Example table */}
        <table className="w-full text-left border">
          <thead>
            <tr>
              <th className="border p-2">ID</th>
              <th className="border p-2">Name</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Phone No.</th>
              <th className="border p-2">DOB</th>
              <th className="border p-2">Age</th>
              <th className="border p-2">Gender</th>
              <th className="border p-2">Address</th>
              <th className="border p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {patients &&
              !loading &&
              !error &&
              patients.map((patient: any) => (
                <tr key={patient.id}>
                  <td className="border p-2">{patient.id}</td>
                  <td className="border p-2">
                    {patient.first_name} {patient.last_name}
                  </td>
                  <td className="border p-2">{patient.email}</td>
                  <td className="border p-2">{patient.phone_number}</td>
                  <td className="border p-2">{patient.profile.dob}</td>
                  <td className="border p-2">{patient.profile.age}</td>
                  <td className="border p-2">
                    {patient.gender === 0 ? "Male" : "Female"}
                  </td>
                  <td className="border p-2">{patient.profile.address}</td>
                  <td className="border p-2 flex justify-center">
                    <button
                      className="flex items-center justify-center bg-red-600 p-2 rounded-md text-white cursor-pointer hover:bg-red-700"
                      onClick={() => deletePatient(patient.id)}
                    >
                      <Trash2 className="inline-block w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            {!patients && !loading ? (
              <tr>
                <td className="border p-2 text-center" colSpan={9}>
                  No patients found.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
