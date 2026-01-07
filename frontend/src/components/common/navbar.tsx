import React, { useState, useEffect, useRef } from "react";
import { navLinks } from "../../config/navLinks";
import { Stethoscope, User, LogOut, ChevronDown } from "lucide-react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";

type NavbarProps = {
  role?: "patient" | "doctor";
};

const Navbar: React.FC<NavbarProps> = ({ role }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");
  const storedRole = localStorage.getItem("role") as NavbarProps["role"] | null;
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isLoggedIn = !!token;
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentRole = role ?? storedRole;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const visibleLinks = navLinks.filter((link) => {
    if (currentRole === "doctor") {
      return link.roles && link.roles.includes("doctor");
    }
    return (
      !link.roles || (currentRole != null && link.roles.includes(currentRole))
    );
  });

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <nav className="flex items-center justify-between py-4 px-16 bg-white shadow-md mb-5">
      <div className="flex gap-2 items-center text-brandBlue font-bold text-lg">
        <div className="bg-brandBlue rounded-xl p-2">
          <Stethoscope className="h-6 w-6 text-white font-bold" />
        </div>
        Care Point
      </div>
      <ul className="flex space-x-6 items-center">
        {visibleLinks.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <li key={item.href}>
              <Link
                to={item.href}
                className={`text-gray-700 hover:text-blue-600 transition-colors ${
                  isActive ? "text-brandBlue underline underline-offset-4" : ""
                }`}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
      <div className="flex items-center">
        {isLoggedIn ? (
          <div className="relative" ref={dropdownRef}>
            <button
              className="flex items-center cursor-pointer bg-blue-50 rounded-lg hover:bg-blue-100"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <div className="flex items-center gap-3 py-2 px-4">
                <div className="text-right hidden sm:block text-brandBlue">
                  <p className="text-sm font-medium leading-none">
                    {user.data.first_name} {user.data.last_name}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {currentRole}
                  </p>
                </div>
                <Avatar className="h-9 w-9 border-2 border-gray-200 bg-gray-100 rounded-full overflow-hidden flex items-center justify-center">
                  {/* <AvatarImage src="/public/placeholder-user.jpg" /> */}
                  <AvatarFallback>
                    {user.data.first_name[0].toUpperCase()}
                    {user.data.last_name[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </div>
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                <button
                  className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-blue-100 cursor-pointer"
                  onClick={() => {
                    setDropdownOpen(false);
                    navigate(`/${currentRole}/profile`);
                  }}
                >
                  <User className="h-4 w-4 mr-2" />
                  Profile Edit
                </button>
                <button
                  className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-red-100 cursor-pointer"
                  onClick={() => {
                    setDropdownOpen(false);
                    handleLogout();
                  }}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <button
              className="text-gray-700 hover:text-white mr-4 border-2 border-blue-600 rounded-lg px-4 py-2 hover:bg-blue-600 cursor-pointer"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 cursor-pointer"
              onClick={() => navigate("/register")}
            >
              Sign Up
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
