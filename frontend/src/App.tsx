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
import PatientClinic from "./pages/Patient/Clinic";
import PatientDoctor from "./pages/Patient/Doctor";
import PatientAppointment from "./pages/Patient/Appointment";
import ClinicDetail from "./pages/Patient/ClinicDetail";
import DoctorDetail from "./pages/Patient/DoctorDetail";
import PatientProfile from "./pages/Patient/Profile";
import Aboutus from "./pages/Patient/Aboutus";
import Contactus from "./pages/Patient/Contactus";
import DoctorDashboard from "./pages/Doctor/Dashboard";
import DoctorAppointments from "./pages/Doctor/Appointments";
import DoctorPatients from "./pages/Doctor/Patients";
import DoctorClinics from "./pages/Doctor/Clinics";
import DoctorProfile from "./pages/Doctor/Profile";

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
      <Route path="/clinic" element={<PatientClinic />} />
      <Route path="/clinic/:id" element={<ClinicDetail />} />
      <Route path="/doctor" element={<PatientDoctor />} />
      <Route path="/doctor/:id" element={<DoctorDetail />} />
      <Route path="/patient/profile" element={<PatientProfile />} />
      <Route path="/appointment" element={<PatientAppointment />} />
      <Route path="/aboutus" element={<Aboutus />} />
      <Route path="/contactus" element={<Contactus />} />
      <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
      <Route path="/doctor/appointments" element={<DoctorAppointments />} />
      <Route path="/doctor/patients" element={<DoctorPatients />} />
      <Route path="/doctor/clinics" element={<DoctorClinics />} />
      <Route path="/doctor/profile" element={<DoctorProfile />} />
    </Routes>
  );
}

export default App;
