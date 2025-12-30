import api from "../src/util/axios";

export const getAllPatients = async () => {
  const token = localStorage.getItem("token");
  const response = await api.get("/v1/all-patients", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const deletePatientById = async (id: number) => {
  const token = localStorage.getItem("token");
  await api.delete(`/v1/patient/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getAllDoctors = async () => {
  const token = localStorage.getItem("token");
  const response = await api.get("/v1/all-doctors", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const deleteDoctorById = async (id: number) => {
  const token = localStorage.getItem("token");
  await api.delete(`/v1/doctor/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getAllClinics = async () => {
  const token = localStorage.getItem("token");
  const response = await api.get("/v1/all-clinics", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const createClinic = async (clinicData: {
  name: string;
  address: string;
  phone_number: string;
}) => {
  const token = localStorage.getItem("token");
  const response = await api.post("/v1/clinic", clinicData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const getClinicById = async (id: number) => {
  const token = localStorage.getItem("token");
  const response = await api.get(`/v1/clinic/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const updateClinic = async (
  id: number,
  clinicData: { name?: string; address?: string; phone_number?: string }
) => {
  const token = localStorage.getItem("token");
  const response = await api.put(`/v1/clinic/${id}`, clinicData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const deleteClinicById = async (id: number) => {
  const token = localStorage.getItem("token");
  await api.delete(`/v1/clinic/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getAllSpecialities = async () => {
  const token = localStorage.getItem("token");
  const response = await api.get("/v1/all-specialities", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const deleteSpecialityById = async (id: number) => {
  const token = localStorage.getItem("token");
  await api.delete(`/v1/speciality/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getSpecialityById = async (id: number) => {
  const token = localStorage.getItem("token");
  const response = await api.get(`/v1/speciality/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const createSpeciality = async (SpecialityData: {
  name: string;
  description: string;
}) => {
  const token = localStorage.getItem("token");
  const response = await api.post("/v1/speciality", SpecialityData, {
    headers: {
      Authorization: `Bearer ${token}`,
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
  const token = localStorage.getItem("token");
  const response = await api.put(`/v1/speciality/${id}`, SpecialityData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const getAllAppointments = async () => {
  const token = localStorage.getItem("token");
  const response = await api.get("/v1/all-appointments", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const deleteAppointmentById = async (id: number) => {
  const token = localStorage.getItem("token");
  await api.delete(`v1/appointment/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
