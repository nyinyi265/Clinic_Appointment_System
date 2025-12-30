import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import AdminLayout from "./pages/Admin/Layout";
import AdminDashboard from "./pages/Admin/Dashboard";
import Patient from "./pages/Admin/Patient";
import Doctor from "./pages/Admin/Doctor";
import Appointment from "./pages/Admin/Appointment";
import Clinic from "./pages/Admin/Clinic";
import ClinicForm from "./pages/Admin/ClinicForm";
import Speciality from "./pages/Admin/Speciality";
import SpecialityForm from "./pages/Admin/SpecialityForm";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/admin"
        element={<AdminLayout children={<AdminDashboard />} />}
      />
      <Route
        path="/admin/patients"
        element={<AdminLayout children={<Patient />} />}
      />
      <Route
        path="/admin/doctors"
        element={<AdminLayout children={<Doctor />} />}
      />
      <Route
        path="/admin/specialities"
        element={<AdminLayout children={<Speciality />} />}
      />
      <Route
        path="/admin/appointments"
        element={<AdminLayout children={<Appointment />} />}
      />
      <Route
        path="/admin/clinics"
        element={<AdminLayout children={<Clinic />} />}
      />
      <Route
        path="/admin/clinics/create"
        element={<AdminLayout children={<ClinicForm />} />}
      />
      <Route
        path="/admin/clinics/edit/:id"
        element={<AdminLayout children={<ClinicForm />} />}
      />
      <Route
        path="/admin/speciality/create"
        element={<AdminLayout children={<SpecialityForm />} />}
      />
      <Route
        path="/admin/speciality/edit/:id"
        element={<AdminLayout children={<SpecialityForm />} />}
      />
    </Routes>
  );
}

export default App;
