/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "../src/util/axios";
import { AxiosError } from "axios";

const getToken = () => localStorage.getItem("token");

export const getAllPatients = async () => {
  const response = await api.get("/v1/all-patients", {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  return response.data;
};

export const deletePatientById = async (id: number) => {
  await api.delete(`/v1/patient/${id}`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
};

export const getAllDoctors = async () => {
  const response = await api.get("/v1/all-doctors", {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  return response.data;
};

export const deleteDoctorById = async (id: number) => {
  await api.delete(`/v1/doctor/${id}`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
};

export const getAllClinics = async () => {
  try {
    const response = await api.get("/v1/all-clinics", {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      console.error(
        "Error fetching clinics:",
        error.response?.data || error.message
      );
    } else {
      console.error("Error fetching clinics:", error);
    }
    throw error;
  }
};

export const createClinic = async (clinicData: {
  name: string;
  address: string;
  phone_number: string;
}) => {
  const response = await api.post("/v1/clinic", clinicData, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  return response.data;
};

export const getClinicById = async (id: number) => {
  const response = await api.get(`/v1/clinic/${id}`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  return response.data;
};

export const updateClinic = async (
  id: number,
  clinicData: { name?: string; address?: string; phone_number?: string }
) => {
  const response = await api.put(`/v1/clinic/${id}`, clinicData, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  return response.data;
};

export const deleteClinicById = async (id: number) => {
  await api.delete(`/v1/clinic/${id}`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
};

export const getAllSpecialities = async () => {
  const response = await api.get("/v1/all-specialities", {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  return response.data;
};

export const deleteSpecialityById = async (id: number) => {
  await api.delete(`/v1/speciality/${id}`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
};

export const getSpecialityById = async (id: number) => {
  const response = await api.get(`/v1/speciality/${id}`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  return response.data;
};

export const createSpeciality = async (SpecialityData: {
  name: string;
  description: string;
}) => {
  const response = await api.post("/v1/speciality", SpecialityData, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  return response.data;
};

export const updateSpeciality = async (
  id: number,
  SpecialityData: {
    name: string;
    description: string;
  }
) => {
  const response = await api.put(`/v1/speciality/${id}`, SpecialityData, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  return response.data;
};

export const getAllAppointments = async () => {
  const response = await api.get("/v1/all-appointments", {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  return response.data;
};

export const deleteAppointmentById = async (id: number) => {
  await api.delete(`/v1/appointment/${id}`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
};

export const getAppointmentByPatientId = async (id: number) => {
  const response = await api.get(`/v1/patient/${id}/appointments`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  return response.data;
};

export const createAppointment = async (data: any) => {
  const response = await api.post("/v1/appointment", data, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  return response.data;
};

export const updateAppointmentStatusByPatient = async (
  id: number,
  status: string
) => {
  const response = await api.put(
    `/v1/patient/appointment/${id}/status`,
    { status },
    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );
  return response.data;
};

export const getDoctorById = async (id: number) => {
  const response = await api.get(`/v1/doctor/${id}`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  return response.data;
};

export const getDoctorsByClinic = async (clinicId: number) => {
  const response = await api.get(`/v1/clinic/${clinicId}/doctors`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  return response.data;
};

export const getClinicsByDoctor = async (doctorId: number) => {
  const response = await api.get(`/v1/doctor/${doctorId}/clinics`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  return response.data;
};

export const updatePatientProfile = async (id: number, data: FormData) => {
  data.append("_method", "PUT");

  const response = await api.post(`/v1/patient/${id}`, data, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
    transformRequest: (data) => data,
  });

  return response.data;
};

export const getAppointmentByDoctorId = async (id: number) => {
  const response = await api.get(`/v1/doctor/${id}/appointments`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  return response.data;
};

export const updateAppointmentStatusByDoctor = async (
  id: number,
  status: string
) => {
  const response = await api.put(
    `/v1/doctor/appointment/${id}/status`,
    { status },
    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );
  return response.data;
};

export const getPatientsByDoctorId = async (id: number) => {
  const response = await api.get(`/v1/doctor/${id}/patients`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  return response.data;
};
