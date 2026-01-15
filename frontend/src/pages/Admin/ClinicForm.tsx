/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getClinicById,
  createClinic,
  updateClinic,
} from "../../../services/apiSvc";
import { toast } from "sonner";

export default function ClinicForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone_number: "",
  });
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(isEditMode);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isEditMode && id) {
      const fetchClinic = async () => {
        try {
          const response = await getClinicById(parseInt(id));
          const clinic = response.data.data;
          setFormData({
            name: clinic.name || "",
            address: clinic.address || "",
            phone_number: clinic.phone_number || "",
          });
        } catch (err: any) {
          setError(err.message || "Failed to fetch clinic");
        } finally {
          setFetchLoading(false);
        }
      };

      fetchClinic();
    }
  }, [id, isEditMode]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isEditMode && id) {
        await updateClinic(parseInt(id), formData);

        toast.success("Clinic Updated", {
          description: `${formData.name} has been successfully updated.`,
        });
      } else {
        await createClinic(formData);
        toast.success("Clinic Created", {
          description: `${formData.name} has been added to the system.`,
        });
      }
      navigate("/admin/clinics");
    } catch (err: any) {
      setError(
        err.message || `Failed to ${isEditMode ? "update" : "create"} clinic`
      );
      toast.error("Action Failed", {
        description: err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading clinic...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold">
          {isEditMode ? "Edit Clinic" : "Create New Clinic"}
        </h1>
      </div>

      <div className="bg-white p-6 rounded shadow max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Clinic Name {isEditMode ? "" : "*"}
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required={!isEditMode}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter clinic name"
            />
          </div>

          <div>
            <label
              htmlFor="address"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Address {isEditMode ? "" : "*"}
            </label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              required={!isEditMode}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter clinic address"
            />
          </div>

          <div>
            <label
              htmlFor="phone_number"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Phone Number {isEditMode ? "" : "*"}
            </label>
            <input
              type="tel"
              id="phone_number"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleInputChange}
              required={!isEditMode}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter phone number"
            />
          </div>

          {error && <div className="text-red-600 text-sm">{error}</div>}

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-brandBlue text-white rounded-md hover:bg-brandBlue/90 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading
                ? isEditMode
                  ? "Updating..."
                  : "Creating..."
                : isEditMode
                ? "Update Clinic"
                : "Create Clinic"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/admin/clinics")}
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
