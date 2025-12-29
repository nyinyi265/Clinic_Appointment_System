export type NavItem = {
  label: string;
  href: string;
  roles?: ("doctor" | "patient")[];
};

export const navLinks: NavItem[] = [
  { label: 'Services', href: '/services' }, // universal
  { label: 'How it Works', href: '/how-it-works' }, // universal
  { label: 'Specialists', href: '/specialists' }, // universal
  { label: 'Dashboard', href: '/doctor/dashboard', roles: ['doctor'] }, // doctor only
  { label: 'Appointments', href: '/doctor/appointments', roles: ['doctor'] }, // doctor only
  { label: 'Patients', href: '/doctor/patients', roles: ['doctor'] }, // doctor only
];
