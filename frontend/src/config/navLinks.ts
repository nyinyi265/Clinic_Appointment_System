export type NavItem = {
  label: string;
  href: string;
  roles?: ("doctor" | "patient")[];
};

export const navLinks: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Clinic', href: '/clinic', roles: ['patient'] }, 
  { label: 'Doctor', href: '/doctor', roles: ['patient'] }, 
  { label: 'Appointment', href: '/appointment', roles: ['patient'] }, 
  { label: 'About Us', href: '/aboutus' }, 
  { label: 'Contact Us', href: '/contactus' }, 
  { label: 'Home', href: '/doctor/dashboard', roles: ['doctor'] },
  { label: 'Appointments', href: '/doctor/appointments', roles: ['doctor'] },
  { label: 'Patients', href: '/doctor/patients', roles: ['doctor'] },
  { label: 'Clinics', href: '/doctor/clinics', roles: ['doctor'] },
  { label: 'Schedules', href: '/doctor/schedules', roles: ['doctor'] },
];
