import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff, Stethoscope } from "lucide-react";
import Button from "../components/Button";
import Input from "../components/Input";
import { login } from "../../services/authSvc";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { email?: string; password?: string } = {};

    if (!email) newErrors.email = "Email is required";
    if (!password) newErrors.password = "Password is required";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      // Handle login logic here
      console.log("Login attempt:", { email, password });
    }

    try {
      const data = await login({ email, password });

      console.log("Login success:", data);

      // Example:
      // localStorage.setItem('token', data.token);
      // navigate('/dashboard');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Login failed:", error);
      setErrors({
        email: "Invalid email or password",
      });
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Image/Branding */}
      <div className="flex-[1/2] bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center p-8 lg:p-12">
        <div className="text-center text-white">
          <div className="mb-8">
            <Stethoscope className="mx-auto h-16 w-16 lg:h-24 lg:w-24 text-white" />
          </div>
          <h1 className="text-2xl lg:text-4xl font-bold mb-4">Care Point</h1>
          <p className="text-lg lg:text-xl opacity-90">
            Your health, our priority
          </p>
          <p className="mt-4 text-sm lg:text-lg opacity-75">
            Book appointments, track your health, and get the care you need
          </p>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold text-gray-900">Welcome back</h2>
            <p className="mt-2 text-sm text-gray-600">
              Please sign in to your account
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <Input
                label="Email address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                icon={Mail}
                error={errors.email}
                required
              />
              <Input
                label="Password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                icon={Lock}
                rightIcon={showPassword ? EyeOff : Eye}
                onRightClick={() => setShowPassword(!showPassword)}
                error={errors.password}
                required
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-900"
                >
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a
                  href="#"
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Forgot your password?
                </a>
              </div>
            </div>

            <div>
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full cursor-pointer"
              >
                Sign in
              </Button>
            </div>
          </form>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <a
                href="#"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Contact administrator
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
