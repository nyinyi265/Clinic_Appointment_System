import api from '../src/util/axios';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  first_name: string;
  last_name: string;
  phone_number: string;
  email: string;
  password: string;
  gender: boolean;
  age: number;
  dob: string;
  address?: string;
  profile_picture?: File | null;
}

export const login = async (credentials: LoginCredentials) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
}

export const register = async (credentials: RegisterCredentials) => {
  const formData = new FormData();

  // Add all fields to FormData
  Object.entries(credentials).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (key === 'profile_picture' && value instanceof File) {
        formData.append(key, value);
      } else if (typeof value === 'boolean') {
        formData.append(key, value ? '1' : '0');
      } else {
        formData.append(key, String(value));
      }
    }
  });

  const response = await api.post('/auth/patient/register', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
}