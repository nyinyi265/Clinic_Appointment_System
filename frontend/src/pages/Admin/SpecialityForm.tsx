/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getSpecialityById,
  createSpeciality,
  updateSpeciality,
} from "../../../services/apiSvc";

export default function SpecialityForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(isEditMode);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isEditMode && id) {
      const fetchSpeciality = async () => {
        try {
          const response = await getSpecialityById(parseInt(id));
          const speciality = response.data.data;
          setFormData({
            name: speciality.name || "",
            description: speciality.description || "",
          });
        } catch (err: any) {
          setError(err.message || "Failed to fetch speciality");
        } finally {
          setFetchLoading(false);
        }
      };

      fetchSpeciality();
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
        await updateSpeciality(parseInt(id), formData);
      } else {
        await createSpeciality(formData);
      }
      navigate("/admin/specialities");
    } catch (err: any) {
      setError(
        err.message || `Failed to ${isEditMode ? "update" : "create"} speciality`
      );
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading speciality...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold">
          {isEditMode ? "Edit Speciality" : "Create New Speciality"}
        </h1>
      </div>

      <div className="bg-white p-6 rounded shadow max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Speciality Name {isEditMode ? "" : "*"}
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required={!isEditMode}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter speciality name"
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Description {isEditMode ? "" : "*"}
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required={!isEditMode}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter speciality description"
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
                ? "Update Speciality"
                : "Create Speciality"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/admin/specialities")}
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
