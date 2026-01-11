import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Navbar from "../../components/common/navbar";
import Footer from "../../components/common/footer";
import { getAllClinicsForDoctor, requestClinicAssignment, type Clinic } from "../../../services/apiSvc";
import { Loader2 } from "lucide-react";

const Clinics = () => {
  const navigate = useNavigate();
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [loading, setLoading] = useState(true);
  const [requestingClinic, setRequestingClinic] = useState<number | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    fetchClinics();
  }, [navigate]);

  const fetchClinics = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const userId = user.data.profile.id;
      console.log("userId :", userId);
      const data = await getAllClinicsForDoctor(userId);
      setClinics(data);
    } catch (error) {
      console.error("Error fetching clinics:", error);
    } finally {
      setLoading(false);
    }
  };

  const myClinics = clinics.filter((c) => c.is_related);
  const otherClinics = clinics.filter((c) => !c.is_related);

  const handleRequestAssignment = async (clinicId: number) => {
    try {
      setRequestingClinic(clinicId);
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const doctorId = user.data.profile.id;
      await requestClinicAssignment(clinicId, doctorId, "Doctor");
      // Refresh clinics
      fetchClinics();
    } catch (error) {
      console.error("Error requesting assignment:", error);
    } finally {
      setRequestingClinic(null);
    }
  };
return (
  <div className="min-h-screen bg-background text-foreground">
    <Navbar role="doctor" />

    {loading && (
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading clinics...</p>
        </div>
      </div>
    )}

    <main className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">Clinics</h1>

        {loading ? (
          <p>Loading clinics...</p>
        ) : (
          <>
            {myClinics.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">My Clinics</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {myClinics.map((clinic) => (
                    <Card key={clinic.id}>
                      <CardHeader>
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-lg">
                            {clinic.name}
                          </CardTitle>
                          <Badge
                            className={`
                              border font-medium shadow-none
                              ${
                                clinic.is_active
                                  ? "bg-blue-100 text-blue-700 border-blue-500 hover:bg-blue-100"
                                  : "bg-red-50 text-red-700 border-red-500 hover:bg-red-50"
                              }
                            `}
                          >
                            {clinic.is_active ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">
                              Address
                            </p>
                            <p className="text-sm">{clinic.address}</p>
                          </div>

                          <div>
                            <p className="text-sm font-medium text-muted-foreground">
                              Phone
                            </p>
                            <p className="text-sm">{clinic.phone_number}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {otherClinics.length > 0 && (
              <div>
                <h2 className="text-2xl font-semibold mb-4">Other Clinics</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {otherClinics.map((clinic) => (
                    <Card key={clinic.id}>
                      <CardHeader>
                        <CardTitle className="text-lg">{clinic.name}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">
                              Address
                            </p>
                            <p className="text-sm">{clinic.address}</p>
                          </div>

                          <div>
                            <p className="text-sm font-medium text-muted-foreground">
                              Phone
                            </p>
                            <p className="text-sm">{clinic.phone_number}</p>
                          </div>
                        </div>
                      </CardContent>
                      {/* <div className="p-6 pt-0">
                        <Button
                          onClick={() => handleRequestAssignment(clinic.id)}
                          className="w-full bg-brandBlue hover:bg-brandBlue/90 text-white"
                          disabled={requestingClinic === clinic.id || clinic.is_requested}
                        >
                          {clinic.is_requested ? "Requested" : requestingClinic === clinic.id ? "Requesting..." : "Request Assignment"}
                        </Button>
                      </div> */}
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Clinics;
