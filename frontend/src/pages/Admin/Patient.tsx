/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { useEffect, useState } from "react";
import { getAllPatients, deletePatientById } from "../../../services/apiSvc";
import { Trash } from "lucide-react";

export default function Patient() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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
    fetchPatients();
  }, []);

  const deletePatient = async (id: number) => {
    try {
      await deletePatientById(id);
    } catch (err: any) {
      setError(err.message || "Failed to delete patient");
    }
  };
  return (
    <div>
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
                  <td className="border p-2">{patient.dob}</td>
                  <td className="border p-2">{patient.age}</td>
                  <td className="border p-2">
                    {patient.gender === 0 ? "Male" : "Female"}
                  </td>
                  <td className="border p-2">{patient.address}</td>
                  <td className="border p-2 flex justify-center">
                    <button
                      className="flex items-center justify-center bg-red-600 p-2 rounded-md text-white cursor-pointer hover:bg-red-700"
                      onClick={() => deletePatient(patient.id)}
                    >
                      <Trash className="inline-block w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            {loading && (
              <tr>
                <td className="border p-2 text-center" colSpan={9}>
                  Loading patients...
                </td>
              </tr>
            )}
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
