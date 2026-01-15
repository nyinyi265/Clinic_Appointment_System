/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  getAllDoctors,
  getAllClinics,
  assignDoctorToClinic,
} from "../../../services/apiSvc";

interface AssignFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export default function AssignDoctorForm({
  onSuccess,
  onCancel,
}: AssignFormProps) {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [doctors, setDoctors] = useState([]);
  const [clinics, setClinics] = useState([]);

  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [selectedClinic, setSelectedClinic] = useState("");

  useEffect(() => {
    const loadOptions = async () => {
      try {
        setLoading(true);
        const [dRes, cRes] = await Promise.all([
          getAllDoctors(),
          getAllClinics(),
        ]);
        setDoctors(dRes.data.data || []);
        setClinics(cRes.data.data || []);
      } catch (error) {
        console.log(error);
        toast.error("Failed to load selection data");
      } finally {
        setLoading(false);
      }
    };
    loadOptions();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!selectedDoctor || !selectedClinic) {
      setError("Please select both a doctor and a clinic");
      return;
    }

    try {
      setSubmitting(true);
      await assignDoctorToClinic({
        doctor_id: selectedDoctor,
        clinic_id: selectedClinic,
      });
      toast.success("Assignment created successfully");
      onSuccess();
    } catch (error: any) {
      console.log(error);
      setError(error.message || "Assignment failed. Link might already exist.");
      toast.error("Assignment failed", {
        description: error.message || "Link might already exist.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading resources...</div>
      </div>
    );
  }

  console.log("doctors", doctors);

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold">New Doctor Assignment</h1>
      </div>

      <div className="bg-white p-6 rounded shadow max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="doctor"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Choose Doctor *
            </label>
            <select
              id="doctor"
              name="doctor"
              value={selectedDoctor}
              onChange={(e) => setSelectedDoctor(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a medical professional</option>
              {doctors.map((doc: any) => (
                <option key={doc.id} value={doc.id.toString()}>
                  Dr. {doc.first_name} {doc.last_name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="clinic"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Choose Clinic *
            </label>
            <select
              id="clinic"
              name="clinic"
              value={selectedClinic}
              onChange={(e) => setSelectedClinic(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a location</option>
              {clinics.map((clinic: any) => (
                <option key={clinic.id} value={clinic.id.toString()}>
                  {clinic.name} — {clinic.address}
                </option>
              ))}
            </select>
          </div>

          {error && <div className="text-red-600 text-sm">{error}</div>}

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2 bg-brandBlue text-white rounded-md hover:bg-brandBlue/90 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {submitting ? "Creating..." : "Save Assignment"}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 border-2 border-gray-600 text-black rounded-md hover:bg-gray-700 hover:text-white cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
