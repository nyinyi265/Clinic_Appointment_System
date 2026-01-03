export type NavItem = {
  label: string;
  href: string;
  roles?: ("doctor" | "patient")[];
};

export const navLinks: NavItem[] = [
  { label: 'Home', href: '/' }, // universal
  { label: 'Clinic', href: '/clinic', roles: ['patient'] }, // patient only
  { label: 'Doctor', href: '/doctor', roles: ['patient'] }, // patient only
  { label: 'Appointment', href: '/appointment', roles: ['patient'] }, // patient only
  { label: 'About Us', href: '/aboutus' }, // universal
  { label: 'Contact Us', href: '/contactus' }, // universal
  { label: 'Dashboard', href: '/doctor/dashboard', roles: ['doctor'] }, // doctor only
  { label: 'Appointments', href: '/doctor/appointments', roles: ['doctor'] }, // doctor only
  { label: 'Patients', href: '/doctor/patients', roles: ['doctor'] }, // doctor only
  { label: 'Clinics', href: '/doctor/clinics', roles: ['doctor'] }, // doctor only
];
