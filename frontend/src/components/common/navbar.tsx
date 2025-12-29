import React from "react";
import { navLinks } from "../../config/navLinks";
import { Stethoscope } from "lucide-react";
import { useNavigate } from "react-router-dom";
// import { userUser } from "../hooks/useUser"; // get role after login

type NavbarProps = {
  role?: "patient" | "doctor"; // optional, undefined if not logged in
};

const Navbar: React.FC<NavbarProps> = ({ role }) => {
  const navigate = useNavigate();
  const visibleLinks = navLinks.filter(
    (link) => !link.roles || link.roles.includes(role || "patient")
  );

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
        <button className="text-gray-700 hover:text-white mr-4 border-2 border-blue-600 rounded-lg px-4 py-2 hover:bg-blue-600 cursor-pointer" onClick={() => navigate("/login")}>
          Login
        </button>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 cursor-pointer">
          Sign Up
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
