import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { updateDoctorProfile } from "../../../services/apiSvc";

interface DoctorProfile {
  id: number;
  first_name: string;
  last_name: string;
  phone_number: string;
  email: string;
  profile: {
    license_number: string;
    is_active: boolean;
    profile_picture: string;
  };
}

const DoctorProfile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<DoctorProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phone_number: "",
    email: "",
    password: "",
    license_number: "",
    is_active: false,
    profile_picture: null as File | null,
  });
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!token) {
      navigate("/login");
      return;
    }

    // Load current user data
    setProfile(user.data);
    setFormData({
      first_name: user.data.first_name || "",
      last_name: user.data.last_name || "",
      phone_number: user.data.phone_number || "",
      email: user.data.email || "",
      password: "",
      license_number: user.data.profile.license_number || "",
      is_active: user.data.profile.is_active || false,
      profile_picture: null,
    });
    if (user.data.profile.profile_picture) {
      setPreviewImage(
        `http://localhost:8000/${
          user.data.profile.profile_picture
        }?t=${Date.now()}`
      );
    }
    setLoading(false);
  }, [navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData((prev) => ({
        ...prev,
        profile_picture: file,
      }));
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const data = new FormData();
      data.append("first_name", formData.first_name);
      data.append("last_name", formData.last_name);
      data.append("phone_number", formData.phone_number);
      data.append("email", formData.email);
      if (formData.password) {
        data.append("password", formData.password);
      }
      data.append("license_number", formData.license_number);
      data.append("is_active", formData.is_active ? "1" : "0");
      if (formData.profile_picture) {
        data.append("profile_picture", formData.profile_picture);
      }

      for (const [key, value] of data.entries()) {
        console.log(key, value);
      }
      const response = await updateDoctorProfile(profile!.id, data);
      console.log("Update response:", response);
      if (response.status === "success") {
        const updatedUser = {
          ...JSON.parse(localStorage.getItem("user") || "{}"),
          data: response.data.data,
        };

        localStorage.setItem("user", JSON.stringify(updatedUser));

        setProfile(response.data.data);
        navigate("/");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <main className="container mx-auto py-8 px-4">
          <p>Loading profile...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="container mx-auto py-8 px-4">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>
              {" "}
              <Button
                variant="outline"
                className="cursor-pointer mr-3"
                onClick={() => navigate(-1)}
              >
                ←
              </Button>
              Edit Profile
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="first_name">First Name</Label>
                  <Input
                    id="first_name"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="last_name">Last Name</Label>
                  <Input
                    id="last_name"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="password">
                  Password (leave blank to keep current)
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <Label htmlFor="phone_number">Phone Number</Label>
                <Input
                  id="phone_number"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="license_number">License Number</Label>
                <Input
                  id="license_number"
                  name="license_number"
                  value={formData.license_number}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="is_active"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleInputChange}
                  className="cursor-pointer"
                  title="Is Active"
                />
                <Label htmlFor="is_active" className="cursor-pointer">Is Active</Label>
              </div>

              <div>
                <Label htmlFor="profile_picture">Profile Picture</Label>
                <Input
                  id="profile_picture"
                  name="profile_picture"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                {previewImage && (
                  <div className="mt-2">
                    <img
                      src={previewImage}
                      alt="Profile Preview"
                      className="w-32 h-32 object-cover rounded-full"
                    />
                  </div>
                )}
              </div>

              <Button
                type="submit"
                disabled={saving}
                className="w-full bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
              >
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default DoctorProfile;