// Footer.tsx
import { Stethoscope } from "lucide-react";
import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-white text-gray-700 py-10 px-5">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Logo & Description */}
        <div>
          <h2 className="flex gap-2 items-center text-blue-600 text-xl font-bold mb-2">
            <div className="bg-blue-600 rounded-md p-2">
              <Stethoscope className="h-6 w-6 text-white font-bold" />
            </div>
            Care Point
          </h2>
          <p>Empowering patients with modern healthcare solutions.</p>
          <p>Your health is our top priority.</p>
        </div>

        {/* Platform Links */}
        <div>
          <h3 className="font-bold mb-2">Platform</h3>
          <ul className="space-y-1 text-gray-600">
            <li>
              <a href="#" className="hover:text-gray-900">
                Find a Doctor
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-gray-900">
                Telehealth
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-gray-900">
                Health Tracking
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-gray-900">
                Specialists
              </a>
            </li>
          </ul>
        </div>

        {/* Support Links */}
        <div>
          <h3 className="font-bold mb-2">Support</h3>
          <ul className="space-y-1 text-gray-600">
            <li>
              <a href="#" className="hover:text-gray-900">
                Help Center
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-gray-900">
                Contact Us
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-gray-900">
                Patient Privacy
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-gray-900">
                Security
              </a>
            </li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="font-bold mb-2">Newsletter</h3>
          <p className="mb-2">Get health tips and updates in your inbox.</p>
          <div className="flex">
            <input
              type="email"
              placeholder="Email address"
              className="border border-gray-300 rounded-l px-3 py-2 flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="bg-blue-600 text-white px-4 rounded-r hover:bg-blue-700">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="mt-10 text-center text-gray-400 text-sm">
        © 2025 Care Point Inc. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
