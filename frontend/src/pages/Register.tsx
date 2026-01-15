import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff, Stethoscope, User, Phone, Calendar, MapPin } from "lucide-react";
import Button from "../components/Button";
import Input from "../components/Input";
import { register } from "../../services/authSvc";
import { useNavigate } from "react-router-dom";
import { getStorage } from "../util/storage";

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phone_number: "",
    email: "",
    password: "",
    confirmPassword: "",
    gender: "",
    age: "",
    dob: "",
    address: "",
    profile_picture: null as File | null,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({ ...prev, profile_picture: file }));
    if (errors.profile_picture) {
      setErrors(prev => ({ ...prev, profile_picture: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.first_name) newErrors.first_name = "First name is required";
    if (!formData.last_name) newErrors.last_name = "Last name is required";
    if (!formData.phone_number) newErrors.phone_number = "Phone number is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (formData.password.length < 8) newErrors.password = "Password must be at least 8 characters";
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match";
    if (!formData.gender) newErrors.gender = "Gender is required";
    if (!formData.age) newErrors.age = "Age is required";
    if (!formData.dob) newErrors.dob = "Date of birth is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const registerData = {
        ...formData,
        gender: formData.gender === "male",
        age: parseInt(formData.age),
      };
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { confirmPassword, ...finalData } = registerData;

      const data = await register(registerData);

      console.log("Registration success:", data);

      // Store token and user data
      const storage = getStorage();
      storage.setItem("token", data.data.token);
      storage.setItem("role", "patient");
      storage.setItem("user", JSON.stringify(data.data));

      navigate("/");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Registration failed:", error);
      setErrors({
        email: error.response?.data?.message || "Registration failed. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Image/Branding */}
      <div className="flex-[1/2] bg-brandBlue flex items-center justify-center p-8 lg:p-12">
        <div className="text-center text-white">
          <div className="mb-8">
            <Stethoscope className="mx-auto h-16 w-16 lg:h-24 lg:w-24 text-white" />
          </div>
          <h1 className="text-2xl lg:text-4xl font-bold mb-4">Care Point</h1>
          <p className="text-lg lg:text-xl opacity-90">
            Join our healthcare community
          </p>
          <p className="mt-4 text-sm lg:text-lg opacity-75">
            Create your account to book appointments and manage your health records
          </p>
        </div>
      </div>

      {/* Right side - Register Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white overflow-y-auto">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
            <p className="mt-2 text-sm text-gray-600">
              Fill in your information to get started
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="First Name"
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleInputChange}
                placeholder="Enter first name"
                icon={User}
                error={errors.first_name}
                required
              />
              <Input
                label="Last Name"
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleInputChange}
                placeholder="Enter last name"
                error={errors.last_name}
                required
              />
            </div>

            <Input
              label="Phone Number"
              type="tel"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleInputChange}
              placeholder="Enter phone number"
              icon={Phone}
              error={errors.phone_number}
              required
            />

            <Input
              label="Email address"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
              icon={Mail}
              error={errors.email}
              required
            />

            <Input
              label="Password"
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter your password"
              icon={Lock}
              rightIcon={showPassword ? EyeOff : Eye}
              onRightClick={() => setShowPassword(!showPassword)}
              error={errors.password}
              required
            />

            <Input
              label="Confirm Password"
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="Confirm your password"
              icon={Lock}
              rightIcon={showConfirmPassword ? EyeOff : Eye}
              onRightClick={() => setShowConfirmPassword(!showConfirmPassword)}
              error={errors.confirmPassword}
              required
            />

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Gender
              </label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                title="Select your gender"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
              {errors.gender && (
                <p className="text-sm text-red-600">{errors.gender}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Age"
                type="number"
                name="age"
                value={formData.age}
                onChange={handleInputChange}
                placeholder="Enter age"
                error={errors.age}
                min="1"
                required
              />
              <Input
                label="Date of Birth"
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleInputChange}
                icon={Calendar}
                error={errors.dob}
                required
              />
            </div>

            <Input
              label="Address (Optional)"
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="Enter your address"
              icon={MapPin}
            />

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Profile Picture (Optional)
              </label>
              <input
                id="profile_picture"
                type="file"
                name="profile_picture"
                onChange={handleFileChange}
                accept="image/*"
                aria-label="Profile picture upload"
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {formData.profile_picture && (
                <p className="text-sm text-gray-600">
                  Selected: {formData.profile_picture.name}
                </p>
              )}
              {errors.profile_picture && (
                <p className="text-sm text-red-600">{errors.profile_picture}</p>
              )}
            </div>

            <div>
              <Button
                type="submit"
                size="lg"
                className="w-full cursor-pointer bg-brandBlue hover:bg-brandBlue/90 text-white"
                disabled={loading}
              >
                {loading ? "Creating Account..." : "Create Account"}
              </Button>
            </div>
          </form>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <a
                href="#"
                className="font-medium text-blue-600 hover:text-blue-500 cursor-pointer"
                onClick={() => navigate("/login")}
              >
                Sign in
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;