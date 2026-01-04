/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navbar from "../../components/common/navbar";
import Footer from "../../components/common/footer";
import { getPatientsByDoctorId } from "../../../services/apiSvc";

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
      <main className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">My Patients</h1>

        {loading ? (
          <p>Loading patients...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {patients.map((patient) => (
              <Card key={patient.id}>
                <CardHeader>
                  <CardTitle className="text-lg">
                    {patient.user.first_name} {patient.user.last_name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Email: {patient.user.email}
                    </p>
                    <p className="text-sm">
                      Phone: {patient.user.phone_number}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Age: {patient.age}</span>
                      <Badge variant="outline">{patient.gender === 1 ? "Male" : "Female"}</Badge>
                    </div>
                    <p className="text-sm">
                      DOB:{" "}
                      {patient.dob
                        ? new Date(patient.dob).toLocaleDateString()
                        : "N/A"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Address: {patient.address || "N/A"}
                    </p>
                    <div className="pt-2 border-t">
                      <p className="text-sm font-medium">
                        Total Appointments: {patient.appointments_count}
                      </p>
                    </div>
                  </div>
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

export default Patients;
