import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Navbar from '../../components/common/navbar';
import Footer from '../../components/common/footer';
import { getClinicById, getDoctorsByClinic } from '../../../services/apiSvc';

interface Clinic {
  id: number;
  name: string;
  address: string;
  phone_number: string;
  description?: string;
}

interface DoctorClinic {
  id: number;
  doctor_profile_id: number;
  clinic_id: number;
  role: string;
  is_active: number;
  doctor: {
    id: number;
    first_name: string;
    last_name: string;
    license_number: string;
    is_active: number;
    specialities: Array<{
      id: number;
      name: string;
    }>;
  };
  clinic: {
    id: number;
    name: string;
    address: string;
    phone_number: string;
  };
}

const ClinicDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [clinic, setClinic] = useState<Clinic | null>(null);
  const [doctors, setDoctors] = useState<DoctorClinic[]>([]);
  const [loadingClinic, setLoadingClinic] = useState(true);
  const [loadingDoctors, setLoadingDoctors] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    if (id) {
      fetchClinic();
      fetchDoctors();
    }
  }, [navigate, id]);

  const fetchClinic = async () => {
    try {
      setLoadingClinic(true);
      const data = await getClinicById(parseInt(id!));
      if (data.status === 'success') {
        setClinic(data.data.data);
      }
    } catch (error) {
      console.error('Error fetching clinic:', error);
    } finally {
      setLoadingClinic(false);
    }
  };

  const fetchDoctors = async () => {
    try {
      setLoadingDoctors(true);
      const data = await getDoctorsByClinic(parseInt(id!));
      if (data.status === 'success') {
        setDoctors(data.data.data);
        console.log(data.data.data);
      }
    } catch (error) {
      console.error('Error fetching doctors:', error);
    } finally {
      setLoadingDoctors(false);
    }
  };

  if (loadingClinic) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navbar role="patient" />
        <main className="container mx-auto py-8 px-4">
          <p>Loading clinic details...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!clinic) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navbar role="patient" />
        <main className="container mx-auto py-8 px-4">
          <p>Clinic not found.</p>
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
          <Button variant="outline" onClick={() => navigate('/clinic')}>
            ← Back to Clinics
          </Button>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">{clinic.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-2">{clinic.address}</p>
            <p className="mb-2">Phone: {clinic.phone_number}</p>
            {clinic.description && <p>{clinic.description}</p>}
          </CardContent>
        </Card>

        <h2 className="text-xl font-bold mb-4">Doctors at this Clinic</h2>
        {loadingDoctors ? (
          <p>Loading doctors...</p>
        ) : doctors.length === 0 ? (
          <p>No doctors found at this clinic.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {doctors.map((doctorClinic) => (
              <Card key={doctorClinic.id}>
                <CardHeader>
                  <CardTitle>{doctorClinic.doctor.first_name} {doctorClinic.doctor.last_name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2">
                    Specialities: {doctorClinic.doctor.specialities.map(s => s.name).join(', ')}
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

export default ClinicDetail;