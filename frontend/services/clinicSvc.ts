import api from '../src/util/axios';

export interface Clinic {
  id: number;
  name: string;
  address: string;
  phone_number: string;
  is_related: boolean;
  role: string | null;
  is_active: boolean | null;
}

export const getAllClinicsForDoctor = async (doctorId: number): Promise<Clinic[]> => {
  const response = await api.get(`/v1/doctor/${doctorId}/all-clinics`);
  return response.data.data.data;
};