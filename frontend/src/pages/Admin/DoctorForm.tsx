/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getDoctorById,
  createDoctor,
  updateDoctor,
  getAllSpecialities,
} from "../../../services/apiSvc";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function DoctorForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;

  const [formData, setFormData] = useState<{
    first_name: string;
    last_name: string;
    phone_number: string;
    email: string;
    password?: string;
    license_number: string;
    is_active: boolean;
  }>({
    first_name: "",
    last_name: "",
    phone_number: "",
    email: "",
    password: "",
    license_number: "",
    is_active: true,
  });
  const [selectedSpecialities, setSelectedSpecialities] = useState<number[]>(
    []
  );
  const [availableSpecialities, setAvailableSpecialities] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(isEditMode);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSpecialities = async () => {
      try {
        const response = await getAllSpecialities();
        setAvailableSpecialities(response.data.data || []);
      } catch (err: any) {
        console.error("Failed to fetch specialities:", err);
      }
    };

    fetchSpecialities();
  }, []);

  useEffect(() => {
    if (isEditMode && id) {
      const fetchDoctor = async () => {
        try {
          const response = await getDoctorById(parseInt(id));
          const doctor = response.data.data;
          console.log("Fetched doctor:", doctor);
          setFormData({
            first_name: doctor.first_name || "",
            last_name: doctor.last_name || "",
            phone_number: doctor.phone_number || "",
            email: doctor.email || "",
            password: "", // Don't populate password for security
            license_number: doctor.profile.license_number || "",
            is_active: doctor.profile.is_active || false,
          });
          // Set selected specialities
          const specialityIds =
            doctor.specialities?.map((s: any) => s.id) || [];
          setSelectedSpecialities(specialityIds);
        } catch (err: any) {
          setError(err.message || "Failed to fetch doctor");
        } finally {
          setFetchLoading(false);
        }
      };

      fetchDoctor();
    }
  }, [id, isEditMode]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const checked =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSpecialityChange = (specialityId: number, checked: boolean) => {
    if (checked) {
      setSelectedSpecialities((prev) => [...prev, specialityId]);
    } else {
      setSelectedSpecialities((prev) =>
        prev.filter((id) => id !== specialityId)
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const dataToSend = new FormData();

      dataToSend.append("first_name", formData.first_name);
      dataToSend.append("last_name", formData.last_name);
      dataToSend.append("phone_number", formData.phone_number);
      dataToSend.append("email", formData.email);
      dataToSend.append("license_number", formData.license_number);
      dataToSend.append("is_active", formData.is_active ? "1" : "0");
      selectedSpecialities.forEach((id) => {
        dataToSend.append("specialities[]", id.toString());
      });
      if (isEditMode && id) {
        dataToSend.append("_method", "PUT");

        if (formData.password && formData.password.trim() !== "") {
          dataToSend.append("password", formData.password);
        }
        console.log(formData);
        await updateDoctor(parseInt(id), dataToSend);

        toast.success("Doctor Updated", {
          description: `Dr. ${formData.first_name} ${formData.last_name}'s profile has been updated.`,
        });
      } else {
        if (!formData.password || formData.password.trim() === "") {
          setError("Password is required for new doctors");
          setLoading(false);
          return;
        }
        dataToSend.append("password", formData.password);

        await createDoctor(dataToSend);

        toast.success("Doctor Created", {
          description: `Dr. ${formData.first_name} ${formData.last_name} has been added to the system.`,
        });
      }
      navigate("/admin/doctors");
    } catch (err: any) {
      if (err.response && err.response.data.errors) {
        console.error("Validation Errors:", err.response.data.errors);
        toast.error("Validation Failed", {
          description: Object.values(err.response.data.errors)
            .flat()
            .join(", "),
        });
      } else {
        setError(err.message || "Action Failed");
      }
      setError(
        err.message || `Failed to ${isEditMode ? "update" : "create"} doctor`
      );

      toast.error("Action Failed", {
        description: err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {fetchLoading && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Loading doctor...</p>
          </div>
        </div>
      )}
      <div className="flex items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold">
          {isEditMode ? "Edit Doctor" : "Create New Doctor"}
        </h1>
      </div>

      <div className="bg-white p-6 rounded shadow max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="first_name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                First Name {isEditMode ? "" : "*"}
              </label>
              <input
                type="text"
                id="first_name"
                name="first_name"
                value={formData.first_name}
                onChange={handleInputChange}
                required={!isEditMode}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter first name"
              />
            </div>

            <div>
              <label
                htmlFor="last_name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Last Name {isEditMode ? "" : "*"}
              </label>
              <input
                type="text"
                id="last_name"
                name="last_name"
                value={formData.last_name}
                onChange={handleInputChange}
                required={!isEditMode}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter last name"
              />
            </div>
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

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email {isEditMode ? "" : "*"}
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required={!isEditMode}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter email address"
            />
          </div>

          {!isEditMode && (
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password *
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required={!isEditMode}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter password"
              />
            </div>
          )}

          <div>
            <label
              htmlFor="license_number"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              License Number {isEditMode ? "" : "*"}
            </label>
            <input
              type="text"
              id="license_number"
              name="license_number"
              value={formData.license_number}
              onChange={handleInputChange}
              required={!isEditMode}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter license number"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Specialities
            </label>
            <div className="space-y-2 max-h-40 overflow-y-auto border border-gray-300 rounded-md p-3">
              {availableSpecialities.map((speciality) => (
                <div key={speciality.id} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`speciality-${speciality.id}`}
                    checked={selectedSpecialities.includes(speciality.id)}
                    onChange={(e) =>
                      handleSpecialityChange(speciality.id, e.target.checked)
                    }
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor={`speciality-${speciality.id}`}
                    className="ml-2 block text-sm text-gray-900"
                  >
                    {speciality.name}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="is_active"
              name="is_active"
              checked={formData.is_active}
              onChange={handleInputChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label
              htmlFor="is_active"
              className="ml-2 block text-sm text-gray-900"
            >
              Active
            </label>
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
                ? "Update Doctor"
                : "Create Doctor"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/admin/doctors")}
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
