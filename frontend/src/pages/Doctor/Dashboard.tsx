/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Navbar from '../../components/common/navbar';
import Footer from '../../components/common/footer';

interface Appointment {
  id: number;
  appointment_date: string;
  start_time: string;
  end_time: string;
  status: string;
  notes: string;
  patient: {
    id: number;
    user: {
      first_name: string;
      last_name: string;
    };
  };
  clinic: {
    name: string;
  };
}

interface Patient {
  id: number;
  user: {
    first_name: string;
    last_name: string;
  };
  age: number;
  gender: string;
}

interface DoctorClinic {
  id: number;
  clinic: {
    name: string;
    address: string;
  };
  role: string;
  is_active: boolean;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctorClinics, setDoctorClinics] = useState<DoctorClinic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchDashboardData();
  }, [navigate]);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const userId = JSON.parse(localStorage.getItem('user') || '{}').id;

      // Fetch appointments
      const appointmentsResponse = await fetch(`/api/v1/doctor/${userId}/appointments`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (appointmentsResponse.ok) {
        const appointmentsData = await appointmentsResponse.json();
        setAppointments(appointmentsData.data.data);
      }

      // Fetch patients (this might need a new endpoint)
      // For now, we'll get unique patients from appointments
      const uniquePatients = appointments.reduce((acc: Patient[], appointment) => {
        const patient = appointment.patient;
        if (!acc.find(p => p.id === patient.id)) {
          acc.push({
            id: patient.id,
            user: patient.user,
            age: 0, // Would need to fetch from patient profile
            gender: 'Unknown'
          });
        }
        return acc;
      }, []);
      setPatients(uniquePatients);

      // Fetch doctor clinics
      const clinicsResponse = await fetch(`/api/v1/doctor/${userId}/clinics`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (clinicsResponse.ok) {
        const clinicsData = await clinicsResponse.json();
        setDoctorClinics(clinicsData.data.data);
      }

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateAppointmentStatus = async (appointmentId: number, status: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/v1/appointment/${appointmentId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });
      if (response.ok) {
        fetchDashboardData(); // Refresh data
      }
    } catch (error) {
      console.error('Error updating appointment status:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'confirmed': return 'bg-blue-500';
      case 'completed': return 'bg-green-500';
      case 'cancelled': return 'bg-red-500';
      case 'no-show': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar role="doctor" />
      <main className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">Doctor Dashboard</h1>

        {loading ? (
          <p>Loading dashboard...</p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Appointments Section */}
            <Card>
              <CardHeader>
                <CardTitle>My Appointments ({appointments.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {appointments.slice(0, 5).map((appointment) => (
                    <div key={appointment.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-semibold">
                            {appointment.patient.user.first_name} {appointment.patient.user.last_name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {appointment.clinic.name} • {appointment.appointment_date}
                          </p>
                          <p className="text-sm">
                            {appointment.start_time} - {appointment.end_time}
                          </p>
                        </div>
                        <Badge className={getStatusColor(appointment.status)}>
                          {appointment.status}
                        </Badge>
                      </div>
                      {appointment.notes && (
                        <p className="text-sm text-muted-foreground mb-2">
                          Notes: {appointment.notes}
                        </p>
                      )}
                      <div className="flex gap-2">
                        {appointment.status === 'pending' && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => updateAppointmentStatus(appointment.id, 'confirmed')}
                            >
                              Confirm
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => updateAppointmentStatus(appointment.id, 'cancelled')}
                            >
                              Cancel
                            </Button>
                          </>
                        )}
                        {appointment.status === 'confirmed' && (
                          <Button
                            size="sm"
                            onClick={() => updateAppointmentStatus(appointment.id, 'completed')}
                          >
                            Mark Complete
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                  {appointments.length > 5 && (
                    <Button variant="outline" className="w-full">
                      View All Appointments
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Patients Section */}
            <Card>
              <CardHeader>
                <CardTitle>My Patients ({patients.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {patients.slice(0, 5).map((patient) => (
                    <div key={patient.id} className="border rounded-lg p-4">
                      <p className="font-semibold">
                        {patient.user.first_name} {patient.user.last_name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Age: {patient.age} • Gender: {patient.gender}
                      </p>
                    </div>
                  ))}
                  {patients.length > 5 && (
                    <Button variant="outline" className="w-full">
                      View All Patients
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Clinics Section */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>My Clinics ({doctorClinics.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {doctorClinics.map((doctorClinic) => (
                    <div key={doctorClinic.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-semibold">{doctorClinic.clinic.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {doctorClinic.clinic.address}
                          </p>
                          <p className="text-sm">Role: {doctorClinic.role}</p>
                        </div>
                        <Badge variant={doctorClinic.is_active ? 'default' : 'secondary'}>
                          {doctorClinic.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;