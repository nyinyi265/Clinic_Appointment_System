import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Navbar from "../../components/common/navbar";
import Footer from "../../components/common/footer";
import { getAllDoctors, getAllSpecialities } from "../../../services/apiSvc";

interface Doctor {
  id: number;
  first_name: string;
  last_name: string;
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
      is_active: boolean;
    };
  }>;
}

interface Speciality {
  id: number;
  name: string;
}

const Doctor = () => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [specialities, setSpecialities] = useState<Speciality[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpeciality, setSelectedSpeciality] = useState("all");
  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [loadingSpecialities, setLoadingSpecialities] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    fetchDoctors();
    fetchSpecialities();
  }, [navigate]);

  const fetchDoctors = async () => {
    try {
      setLoadingDoctors(true);
      const data = await getAllDoctors();
      if (data.status === "success") {
        setDoctors(data.data.data);
        console.log(data.data.data);
      }
    } catch (error) {
      console.error("Error fetching doctors:", error);
    } finally {
      setLoadingDoctors(false);
    }
  };

  const fetchSpecialities = async () => {
    try {
      setLoadingSpecialities(true);
      const data = await getAllSpecialities();
      if (data.status === "success") {
        setSpecialities(data.data.data);
      }
    } catch (error) {
      console.error("Error fetching specialities:", error);
    } finally {
      setLoadingSpecialities(false);
    }
  };

  const filteredDoctors = doctors.filter((doctor) => {
    const nameMatch = doctor
      ? `${doctor.first_name} ${doctor.last_name}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      : false;
    const specialityMatch =
      selectedSpeciality === "all" ||
      doctor.specialities.some((s) => s.id.toString() === selectedSpeciality);
    return nameMatch && specialityMatch;
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar role="patient" />
      <main className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">Search Doctors</h1>
        <div className="mb-6 flex gap-4">
          <Input
            type="text"
            placeholder="Search doctors by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
          <Select
            value={selectedSpeciality}
            onValueChange={setSelectedSpeciality}
            disabled={loadingSpecialities}
          >
            <SelectTrigger className="max-w-md">
              <SelectValue placeholder={loadingSpecialities ? "Loading specialities..." : "Filter by speciality"} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Specialities</SelectItem>
              {specialities.map((speciality) => (
                <SelectItem
                  key={speciality.id}
                  value={speciality.id.toString()}
                >
                  {speciality.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {loadingDoctors ? (
          <p>Loading doctors...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoctors.map((doctor) => (
              <Card key={doctor.id}>
                <CardHeader>
                  <CardTitle>
                    {doctor
                      ? `${doctor.first_name} ${doctor.last_name}`
                      : "Unknown Doctor"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2">
                    Specialities:{" "}
                    {doctor.specialities.map((s) => s.name).join(", ")}
                  </p>
                  <p className="text-sm mb-4">
                    Active Clinics:{" "}
                    {doctor.clinics
                      .filter((c) => c.pivot.is_active)
                      .map((c) => c.name)
                      .join(", ")}
                  </p>
                  <Button className="mt-4" variant="outline" onClick={() => navigate(`/doctor/${doctor.profile.id}`)}>
                    View Details
                  </Button>
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

export default Doctor;
