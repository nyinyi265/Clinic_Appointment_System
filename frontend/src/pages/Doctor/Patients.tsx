/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Navbar from '../../components/common/navbar';
import Footer from '../../components/common/footer';

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
  gender: string;
  address: string;
  appointments_count?: number;
}

const Patients = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchPatients();
  }, [navigate]);

  const fetchPatients = async () => {
    try {
      const token = localStorage.getItem('token');
      const userId = JSON.parse(localStorage.getItem('user') || '{}').id;

      // Get appointments to derive patients
      const response = await fetch(`/api/v1/doctor/${userId}/appointments`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const appointments = data.data.data;

        // Group appointments by patient and count
        const patientMap = new Map<number, Patient & { appointments_count: number }>();

        appointments.forEach((appointment: any) => {
          const patient = appointment.patient_profile;
          const patientId = patient.id;

          if (!patientMap.has(patientId)) {
            patientMap.set(patientId, {
              id: patientId,
              user: patient.user,
              age: patient.age || 0,
              dob: patient.dob || '',
              gender: patient.gender || 'Unknown',
              address: patient.address || '',
              appointments_count: 1
            });
          } else {
            const existing = patientMap.get(patientId)!;
            existing.appointments_count += 1;
          }
        });

        setPatients(Array.from(patientMap.values()));
      }
    } catch (error) {
      console.error('Error fetching patients:', error);
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
                      <Badge variant="outline">{patient.gender}</Badge>
                    </div>
                    <p className="text-sm">
                      DOB: {patient.dob ? new Date(patient.dob).toLocaleDateString() : 'N/A'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Address: {patient.address || 'N/A'}
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