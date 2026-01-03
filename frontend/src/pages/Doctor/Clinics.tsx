import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Navbar from '../../components/common/navbar';
import Footer from '../../components/common/footer';

interface DoctorClinic {
  id: number;
  clinic: {
    id: number;
    name: string;
    address: string;
    phone_number: string;
  };
  role: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const Clinics = () => {
  const navigate = useNavigate();
  const [doctorClinics, setDoctorClinics] = useState<DoctorClinic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchDoctorClinics();
  }, [navigate]);

  const fetchDoctorClinics = async () => {
    try {
      const token = localStorage.getItem('token');
      const userId = JSON.parse(localStorage.getItem('user') || '{}').id;

      const response = await fetch(`/api/v1/doctor/${userId}/clinics`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setDoctorClinics(data.data.data);
      }
    } catch (error) {
      console.error('Error fetching doctor clinics:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar role="doctor" />
      <main className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">My Clinics</h1>

        {loading ? (
          <p>Loading clinics...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {doctorClinics.map((doctorClinic) => (
              <Card key={doctorClinic.id}>
                <CardHeader>
                  <CardTitle className="text-lg">
                    {doctorClinic.clinic.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Address</p>
                      <p className="text-sm">{doctorClinic.clinic.address}</p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Phone</p>
                      <p className="text-sm">{doctorClinic.clinic.phone_number}</p>
                    </div>

                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Role</p>
                        <p className="text-sm">{doctorClinic.role}</p>
                      </div>
                      <Badge variant={doctorClinic.is_active ? 'default' : 'secondary'}>
                        {doctorClinic.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Joined</p>
                      <p className="text-sm">
                        {new Date(doctorClinic.created_at).toLocaleDateString()}
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

export default Clinics;