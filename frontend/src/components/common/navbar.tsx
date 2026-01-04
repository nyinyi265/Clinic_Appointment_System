import React, { useState, useEffect, useRef } from "react";
import { navLinks } from "../../config/navLinks";
import { Stethoscope, User, LogOut, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
// import { userUser } from "../hooks/useUser"; // get role after login

type NavbarProps = {
  role?: "patient" | "doctor"; // optional, undefined if not logged in
};

const Navbar: React.FC<NavbarProps> = ({ role }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const storedRole = localStorage.getItem('role') as NavbarProps['role'] | null;
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isLoggedIn = !!token;
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentRole = role ?? storedRole;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const visibleLinks = navLinks.filter(
    (link) => {
      if (currentRole === 'doctor') {
        return link.roles && link.roles.includes('doctor');
      }
      return !link.roles || (currentRole != null && link.roles.includes(currentRole));
    }
  );

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <nav className="flex items-center justify-between py-4 px-16 bg-white shadow-md">
      <div className="flex gap-2 items-center text-blue-600 font-bold text-lg">
        <div className="bg-blue-600 rounded-md p-2">
          <Stethoscope className="h-6 w-6 text-white font-bold" />
        </div>
        Care Point
      </div>
      <ul className="flex space-x-6 items-center">
        {visibleLinks.map((item) => (
          <li key={item.href}>
            <a href={item.href} className="text-gray-700 hover:text-blue-600">
              {item.label}
            </a>
          </li>
        ))}
      </ul>
      <div className="flex items-center">
        {isLoggedIn ? (
          <div className="relative" ref={dropdownRef}>
            <button
              className="flex items-center text-gray-700 hover:text-blue-600 cursor-pointer"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <User className="h-4 w-4 mr-2" />
              <span>{user.data.first_name} {user.data.last_name}</span>
              <ChevronDown className="h-4 w-4 ml-1" />
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                <button
                  className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    setDropdownOpen(false);
                    // Navigate to profile edit based on role
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
            <button className="text-gray-700 hover:text-white mr-4 border-2 border-blue-600 rounded-lg px-4 py-2 hover:bg-blue-600 cursor-pointer" onClick={() => navigate("/login")}>
              Login
            </button>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 cursor-pointer">
              Sign Up
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
