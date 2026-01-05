/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navbar from "../../components/common/navbar";
import Footer from "../../components/common/footer";
import LoadingOverlay from "../../components/common/LoadingOverlay";
import { getPatientsByDoctorId } from "../../../services/apiSvc";
import { Mail, Phone, MapPin, User, Calendar } from "lucide-react";

interface Patient {
  id: number;
  user: {
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
  };
  age: number;
  dob: string;
  gender: number;
  address: string;
  appointments_count: number;
}

const Patients = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    fetchPatients();
  }, [navigate]);

  const fetchPatients = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const userId = user.data.profile.id;

      const data = await getPatientsByDoctorId(userId);
      if (data.status === "success") {
        setPatients(data.data.data);
      }
    } catch (error) {
      console.error("Error fetching patients:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar role="doctor" />

      <main className="container mx-auto py-10 px-4 space-y-8">
        {/* Header */}
        <section className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">My Patients</h1>
          <p className="text-muted-foreground">
            View and manage your registered patients.
          </p>
        </section>

        {loading && <LoadingOverlay message="Loading..." />}

        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {patients.map((patient) => (
              <Card
                key={patient.id}
                className="overflow-hidden border-none shadow-sm hover:shadow-md transition-shadow ring-1 ring-border/50"
              >
                {/* Header */}
                <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-4">
                  <div className="space-y-1">
                    <h3 className="font-semibold text-lg tracking-tight">
                      {patient.user.first_name} {patient.user.last_name}
                    </h3>
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <User className="h-3.5 w-3.5" />
                      <span>Age: {patient.age}</span>
                    </div>
                  </div>
                  <Badge
                    className={`px-2.5 py-0.5 font-medium ${patient.gender === 1 ? "bg-blue-100 border border-blue-200 text-blue-800 hover:bg-blue-200" : "bg-pink-100 border border-pink-200 text-pink-800 hover:bg-pink-200"}  transition-colors`}
                  >
                    {patient.gender === 1 ? "Male" : "Female"}
                  </Badge>
                </CardHeader>

                {/* Content */}
                <CardContent className="space-y-4">
                  {/* Contact Info */}
                  <div className="space-y-2 rounded-xl bg-muted/50 p-3 text-sm">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-primary" />
                      <span>{patient.user.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-primary" />
                      <span>{patient.user.phone_number}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-primary" />
                      <span>{patient.address || "N/A"}</span>
                    </div>
                  </div>

                  {/* DOB */}
                  <div className="flex items-center gap-2 rounded-lg border bg-accent/30 p-3">
                    <Calendar className="h-4 w-4 text-primary shrink-0" />
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-primary/70">
                        Date of Birth
                      </span>
                      <p className="text-sm text-muted-foreground">
                        {patient.dob
                          ? new Date(patient.dob).toLocaleDateString()
                          : "N/A"}
                      </p>
                    </div>
                  </div>
                </CardContent>

                {/* Footer */}
                <CardFooter className="pt-0 pb-6">
                  <div className="w-full flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">
                      Total Appointments
                    </span>
                    <span className="font-semibold bg-blue-100 py-1 px-2 rounded-md text-blue-800">
                      {patient.appointments_count}
                    </span>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Patients;
