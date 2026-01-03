import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Navbar from '../../components/common/navbar';
import Footer from '../../components/common/footer';
import { getAllClinics } from '../../../services/apiSvc';

interface Clinic {
  id: number;
  name: string;
  address: string;
  phone_number: string;
}

const Clinic = () => {
  const navigate = useNavigate();
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchClinics();
  }, [navigate]);

  const fetchClinics = async () => {
    try {
      const data = await getAllClinics();
      if (data.status === 'success') {
        setClinics(data.data.data);
      }
    } catch (error) {
      console.error('Error fetching clinics:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredClinics = clinics.filter(clinic =>
    clinic.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    clinic.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar role="patient" />
      <main className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">Search Clinics</h1>
        <div className="mb-6">
          <Input
            type="text"
            placeholder="Search clinics by name or address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </div>
        {loading ? (
          <p>Loading clinics...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClinics.map((clinic) => (
              <Card key={clinic.id}>
                <CardHeader>
                  <CardTitle>{clinic.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2">{clinic.address}</p>
                  <p className="text-sm">{clinic.phone_number}</p>
                  <Button className="mt-4" variant="outline" onClick={() => navigate(`/clinic/${clinic.id}`)}>
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

export default Clinic;