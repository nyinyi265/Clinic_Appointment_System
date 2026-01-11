/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Navbar from '../../components/common/navbar';
import Footer from '../../components/common/footer';
import LoadingOverlay from '../../components/common/LoadingOverlay';
import {
  Calendar,
  Users,
  Building2,
  CheckCircle2,
  Clock,
  User,
  MapPin,
  Stethoscope
} from 'lucide-react';
import { getAppointmentByDoctorId, getClinicsByDoctor, getPatientsByDoctorId, updateAppointmentStatusByDoctor, type Appointment, type DoctorClinic, type Patient } from '../../../services/apiSvc';


const Dashboard = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctorClinics, setDoctorClinics] = useState<DoctorClinic[]>([]);
  const [loading, setLoading] = useState(true);
  console.log('Clinics :', doctorClinics);

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
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const userId = user.data.profile.id;
      // Fetch appointments
      const appointmentsData = await getAppointmentByDoctorId(userId);
      setAppointments(appointmentsData.data.data);

      // Fetch patients
      const patientsData = await getPatientsByDoctorId(userId);
      setPatients(patientsData.data.data);

      // Fetch doctor clinics
      const clinicsData = await getClinicsByDoctor(userId);
      setDoctorClinics(clinicsData.data.data);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateAppointmentStatus = async (appointmentId: number, status: string) => {
    try {
      await updateAppointmentStatusByDoctor(appointmentId, status);
      fetchDashboardData(); // Refresh data
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

  const pendingAppointments = appointments.filter(app => app.status === 'pending').length;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar role="doctor" />

      {loading && <LoadingOverlay message="Loading dashboard..." />}

      {!loading && (
        <main className="container mx-auto py-10 px-4 space-y-8">
          {/* Header */}
          <section className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight text-foreground/90">
              Dashboard Overview
            </h1>
            <p className="text-muted-foreground">
              Welcome back! Here's an overview of your practice and recent activities.
            </p>
          </section>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="overflow-hidden border-none shadow-sm hover:shadow-md transition-shadow ring-1 ring-border/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Total Appointments</p>
                    <p className="text-3xl font-bold text-foreground">{appointments.length}</p>
                  </div>
                  <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Calendar className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden border-none shadow-sm hover:shadow-md transition-shadow ring-1 ring-border/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Total Patients</p>
                    <p className="text-3xl font-bold text-foreground">{patients.length}</p>
                  </div>
                  <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Users className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden border-none shadow-sm hover:shadow-md transition-shadow ring-1 ring-border/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Active Clinics</p>
                    <p className="text-3xl font-bold text-foreground">{doctorClinics.filter(c => c.is_active).length}</p>
                  </div>
                  <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Building2 className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden border-none shadow-sm hover:shadow-md transition-shadow ring-1 ring-border/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Pending Appointments</p>
                    <p className="text-3xl font-bold text-foreground">{pendingAppointments}</p>
                  </div>
                  <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Clock className="h-6 w-6 text-orange-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Appointments & Patients */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Appointments */}
            <Card className="overflow-hidden border-none shadow-sm hover:shadow-md transition-shadow ring-1 ring-border/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <div className="space-y-1">
                  <CardTitle className="text-xl font-semibold tracking-tight">
                    Recent Appointments
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Your latest appointment bookings
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/doctor/appointments')}
                  className="shrink-0"
                >
                  View All
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {appointments.slice(0, 3).map((appointment) => (
                  <div key={appointment.id} className="flex items-start gap-4 rounded-xl bg-muted/50 p-4">
                    <div className="h-10 w-10 bg-brandBlue/10 rounded-lg flex items-center justify-center shrink-0">
                      <User className="h-5 w-5 text-brandBlue" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-sm">
                          {appointment.patient.user.first_name} {appointment.patient.user.last_name}
                        </h4>
                        <Badge
                          variant="outline"
                          className={`px-2 py-0.5 text-xs font-medium border ${getStatusColor(appointment.status)}`}
                        >
                          {appointment.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        <span>{appointment.clinic.name}</span>
                        <span>•</span>
                        <span>{appointment.appointment_date}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {appointment.start_time} - {appointment.end_time}
                      </p>
                    </div>
                  </div>
                ))}
                {appointments.length === 0 && (
                  <div className="text-center py-8">
                    <Stethoscope className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-sm text-muted-foreground">No appointments yet</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Patients */}
            <Card className="overflow-hidden border-none shadow-sm hover:shadow-md transition-shadow ring-1 ring-border/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <div className="space-y-1">
                  <CardTitle className="text-xl font-semibold tracking-tight">
                    Recent Patients
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Patients you've recently treated
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/doctor/patients')}
                  className="shrink-0"
                >
                  View All
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {patients.slice(0, 3).map((patient) => (
                  <div key={patient.id} className="flex items-center gap-4 rounded-xl bg-muted/50 p-4">
                    <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center shrink-0">
                      <User className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">
                        {patient.user.first_name} {patient.user.last_name}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        Age: {patient.age} • Gender: {patient.gender}
                      </p>
                    </div>
                  </div>
                ))}
                {patients.length === 0 && (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-sm text-muted-foreground">No patients yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Clinics Overview */}
          <Card className="overflow-hidden border-none shadow-sm hover:shadow-md transition-shadow ring-1 ring-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <div className="space-y-1">
                <CardTitle className="text-xl font-semibold tracking-tight">
                  My Clinics
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Clinics where you provide medical services
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/doctor/clinics')}
                className="shrink-0"
              >
                Manage Clinics
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {doctorClinics.map((doctorClinic) => (
                  <div key={doctorClinic.id} className="rounded-xl border bg-card p-4 hover:shadow-sm transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Building2 className="h-5 w-5 text-purple-600" />
                      </div>
                      <Badge
                        className="text-xs bg-blue-100 text-blue-700 border-blue-500 hover:bg-blue-100"
                      >
                        {doctorClinic.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-medium text-sm">{doctorClinic.clinic.name}</h4>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {doctorClinic.clinic.address}
                      </p>
                    </div>
                  </div>
                ))}
                {doctorClinics.length === 0 && (
                  <div className="col-span-full text-center py-8">
                    <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-sm text-muted-foreground">No clinics assigned yet</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </main>
      )}

      <Footer />
    </div>
  );
};

export default Dashboard;