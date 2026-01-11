/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "../../components/common/navbar";
import Footer from "../../components/common/footer";
import { getDoctorById, getClinicsByDoctor } from "../../../services/apiSvc";
import LoadingOverlay from "@/components/common/LoadingOverlay";

interface Doctor {
  id: number;
  first_name: string;
  last_name: string;
  phone_number: string;
  email: string;
  password: string;
  profile: {
    id: number;
    license_number: string;
    is_active: number;
  };
  specialities: Array<{
    id: number;
    name: string;
  }>;
  clinics: Array<{
    id: number;
    name: string;
    pivot: {
      is_active: number;
    };
  }>;
  role: string;
}

interface DoctorClinic {
  id: number;
  doctor_profile_id: number;
  clinic_id: number;
  role: string;
  is_active: number;
  clinic: {
    id: number;
    name: string;
    address: string;
    phone_number: string;
  };
  doctor: {
    id: number;
    first_name: string;
    last_name: string;
  };
}

const DoctorDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [clinics, setClinics] = useState<DoctorClinic[]>([]);
  const [loadingDoctor, setLoadingDoctor] = useState(true);
  const [loadingClinics, setLoadingClinics] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    if (id) {
      fetchDoctor();
      fetchClinics();
    }
  }, [navigate, id]);

  const fetchDoctor = async () => {
    try {
      setLoadingDoctor(true);
      const data = await getDoctorById(parseInt(id!));
      if (data.status === "success") {
        setDoctor(data.data.data);
      }
    } catch (error) {
      console.error("Error fetching doctor:", error);
    } finally {
      setLoadingDoctor(false);
    }
  };

  const fetchClinics = async () => {
    try {
      setLoadingClinics(true);
      const data = await getClinicsByDoctor(parseInt(id!));
      if (data.status === "success") {
        setClinics(data.data.data);
      }
    } catch (error) {
      console.error("Error fetching clinics:", error);
    } finally {
      setLoadingClinics(false);
    }
  };

  if (loadingDoctor) {
    return (
      loadingDoctor && <LoadingOverlay message="Loading doctor details..." />
    );
  }

  if (!doctor) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navbar role="patient" />
        <main className="container mx-auto py-8 px-4">
          <p>Doctor not found.</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar role="patient" />
      <main className="container mx-auto py-8 px-4">
        <div className="mb-6">
          <Button variant="outline" onClick={() => navigate("/doctor")}>
            ← Back to Doctors
          </Button>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">
              {doctor.first_name} {doctor.last_name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-2">Email: {doctor.email}</p>
            <p className="mb-2">Phone: {doctor.phone_number}</p>
            <p className="mb-2">
              License Number: {doctor.profile.license_number}
            </p>
            <p className="mb-2">
              Status: {doctor.profile.is_active ? "Active" : "Inactive"}
            </p>
            <p className="text-sm text-muted-foreground">
              Specialities:{" "}
              {doctor.specialities.map((s: { name: any }) => s.name).join(", ")}
            </p>
          </CardContent>
        </Card>

        <h2 className="text-xl font-bold mb-4">Clinics</h2>
        {loadingClinics ? (
          <p>Loading clinics...</p>
        ) : clinics.length === 0 ? (
          <p>No clinics found for this doctor.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clinics.map((doctorClinic) => (
              <Card key={doctorClinic.id}>
                <CardHeader>
                  <CardTitle>{doctorClinic.clinic.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2">
                    {doctorClinic.clinic.address}
                  </p>
                  <p className="text-sm mb-2">
                    Phone: {doctorClinic.clinic.phone_number}
                  </p>
                  <p className="text-sm mb-4">
                    Status: {doctorClinic.is_active ? "Active" : "Inactive"}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default DoctorDetail;
