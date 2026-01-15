import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Navbar from '../../components/common/navbar';
import Footer from '../../components/common/footer';
import LoadingOverlay from '../../components/common/LoadingOverlay';
import { getAllClinics } from '../../../services/apiSvc';
import { MapPin, Phone, Search } from 'lucide-react';
import { getStorage } from '../../util/storage';
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
    const token = getStorage().getItem('token');
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

      <main className="container mx-auto py-8 px-4 space-y-8 bg-gradient-to-b from-background to-muted/20 min-h-[calc(100vh-200px)] mt-1">
        {/* Header */}
        <section className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Find Clinics</h1>
          <p className="text-muted-foreground">
            Discover and explore healthcare facilities in your area.
          </p>
        </section>

        {/* Search */}
        <section className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search clinics by name or address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </section>

        {loading && <LoadingOverlay message="Loading clinics..." />}

        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClinics.map((clinic) => (
              <Card
                key={clinic.id}
                className="overflow-hidden border-none shadow-sm hover:shadow-md transition-shadow ring-1 ring-border/50"
              >
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-semibold tracking-tight">
                    {clinic.name}
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Address */}
                  <div className="flex items-start gap-2 rounded-lg border bg-accent/30 p-3">
                    <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-primary/70">
                        Address
                      </span>
                      <p className="text-sm text-muted-foreground">
                        {clinic.address}
                      </p>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-center gap-2 rounded-lg border bg-accent/30 p-3">
                    <Phone className="h-4 w-4 text-primary shrink-0" />
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-primary/70">
                        Phone
                      </span>
                      <p className="text-sm text-muted-foreground">
                        {clinic.phone_number}
                      </p>
                    </div>
                  </div>
                </CardContent>

                <div className="p-6 pt-0">
                  <Button
                    className="w-full shadow-sm gap-2 bg-brandBlue hover:bg-brandBlue/90 text-white cursor-pointer"
                    onClick={() => navigate(`/clinic/${clinic.id}`)}
                  >
                    View Details
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {!loading && filteredClinics.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No clinics found matching your search.</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Clinic;