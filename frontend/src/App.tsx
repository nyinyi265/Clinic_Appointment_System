import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import AdminLayout from "./pages/Admin/Layout";
import AdminDashboard from "./pages/Admin/Dashboard";
import Patient from "./pages/Admin/Patient";
import Doctor from "./pages/Admin/Doctor";
import Appointment from "./pages/Admin/Appointment";
import Clinic from "./pages/Admin/Clinic";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/admin" element={<AdminLayout children={<AdminDashboard />} />} />
      <Route path="/admin/patients" element={<AdminLayout children={<Patient />} />} />
      <Route path="/admin/doctors" element={<AdminLayout children={<Doctor />} />} />
      <Route path="/admin/appointments" element={<AdminLayout children={<Appointment />} />} />
      <Route path="/admin/clinics" element={<AdminLayout children={<Clinic />} />} />
    </Routes>
  );
}

export default App;
