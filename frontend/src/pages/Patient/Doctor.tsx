import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Navbar from "../../components/common/navbar";
import Footer from "../../components/common/footer";
import LoadingOverlay from "../../components/common/LoadingOverlay";
import { getAllDoctors, getAllSpecialities } from "../../../services/apiSvc";
import { Search, Stethoscope, MapPin, User } from "lucide-react";

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

      <main className="container mx-auto py-8 px-4 space-y-8 bg-gradient-to-b from-background to-muted/20 min-h-[calc(100vh-200px)] mt-1">
        {/* Header */}
        <section className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Find Doctors</h1>
          <p className="text-muted-foreground">
            Connect with healthcare professionals and book appointments.
          </p>
        </section>

        {/* Search and Filter */}
        <section className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search doctors by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select
            value={selectedSpeciality}
            onValueChange={setSelectedSpeciality}
            disabled={loadingSpecialities}
          >
            <SelectTrigger className="w-48">
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
        </section>

        {loadingDoctors && <LoadingOverlay message="Loading doctors..." />}

        {!loadingDoctors && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoctors.map((doctor) => (
              <Card
                key={doctor.id}
                className="overflow-hidden border-none shadow-sm hover:shadow-md transition-shadow ring-1 ring-border/50"
              >
                <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-4">
                  <div className="space-y-1">
                    <h3 className="font-semibold text-lg tracking-tight">
                      {doctor ? `${doctor.first_name} ${doctor.last_name}` : "Unknown Doctor"}
                    </h3>
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Stethoscope className="h-3.5 w-3.5" />
                      <span>License: {doctor?.profile?.license_number}</span>
                    </div>
                  </div>
                  <Badge
                    className={`px-2.5 py-0.5 font-medium ${doctor?.profile?.is_active ? "bg-green-100 border border-green-200 text-green-800 hover:bg-green-200" : "bg-red-100 border border-red-200 text-red-800 hover:bg-red-200"} transition-colors`}
                  >
                    {doctor?.profile?.is_active ? "Active" : "Inactive"}
                  </Badge>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Specialities */}
                  <div className="space-y-2 rounded-xl bg-muted/50 p-3 text-sm">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-primary" />
                      <span className="font-medium">Specialities:</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {doctor.specialities.map((speciality) => (
                        <Badge key={speciality.id} variant="secondary" className="text-xs">
                          {speciality.name}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Clinics */}
                  <div className="flex items-start gap-2.5 rounded-lg border bg-accent/30 p-3">
                    <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <div className="space-y-0.5">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-primary/70">
                        Active Clinics
                      </span>
                      <p className="text-xs leading-relaxed text-muted-foreground">
                        {doctor.clinics
                          .filter((c) => c.pivot.is_active)
                          .map((c) => c.name)
                          .join(", ") || "No active clinics"}
                      </p>
                    </div>
                  </div>
                </CardContent>

                <div className="p-6 pt-0">
                  <Button
                    className="w-full shadow-sm gap-2 bg-brandBlue hover:bg-brandBlue/90 text-white cursor-pointer"
                    onClick={() => navigate(`/doctor/${doctor.profile.id}`)}
                  >
                    View Details
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {!loadingDoctors && filteredDoctors.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No doctors found matching your search.</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Doctor;
