/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "../src/util/axios";
import { AxiosError } from "axios";
import { getStorage } from "../src/util/storage";

const getToken = () => getStorage().getItem("token");

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

export const updateDoctorProfile = async (id: number, data: FormData) => {
  data.append("_method", "PUT");

  const response = await api.post(`/v1/doctor/${id}`, data, {
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
export interface Clinic {
  id: number;
  name: string;
  address: string;
  phone_number: string;
  is_related: boolean;
  is_requested: boolean;
  is_active: boolean | null;
}

export interface Appointment {
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

export interface DoctorClinic {
  id: number;
  clinic: {
    id: number;
    name: string;
    address: string;
  };
  role: string;
  is_active: boolean;
}

export interface Patient {
  id: number;
  user: {
    first_name: string;
    last_name: string;
  };
  age: number;
  gender: string;
}

export const getAllClinicsForDoctor = async (
  doctorId: number
): Promise<Clinic[]> => {
  const response = await api.get(`/v1/doctor/${doctorId}/all-clinics`);
  console.log(response);
  return response.data.data.data;
};

export const getDoctorClinics = async (
  doctorId: number
): Promise<DoctorClinic[]> => {
  const response = await api.get(`/v1/doctor/${doctorId}/clinics`);
  return response.data.data.data;
};

export const getDoctorAppointments = async (
  doctorId: number
): Promise<Appointment[]> => {
  const response = await api.get(`/v1/doctor/${doctorId}/appointments`);
  return response.data.data.data;
};

export const updateAppointmentStatus = async (
  appointmentId: number,
  status: string
): Promise<void> => {
  await api.put(`/v1/appointment/${appointmentId}`, { status });
};

export const requestClinicAssignment = async (
  clinicId: number,
  doctorId: number,
  role: string
) => {
  const response = await api.post("/v1/doctor-clinic", {
    clinic_id: clinicId,
    doctor_profile_id: doctorId,
    role: role,
    is_active: false, // pending
  });
  return response.data;
};

export const getPendingClinicRequests = async () => {
  const response = await api.get("/v1/pending-clinic-requests");
  return response.data;
};

export const getAllMessages = async () => {
  const response = await api.get("/v1/messages", {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  return response.data;
};

export const sendMessage = async (messageData: {
  first_name: string;
  last_name: string;
  email: string;
  subject: string;
  message: string;
}) => {
  const response = await api.post("/message", messageData);
  return response.data;
};

export const createDoctor = async (doctorData: FormData) => {
  const response = await api.post("/v1/doctor", doctorData, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  return response.data;
};

export const updateDoctor = async (id: number, doctorData: FormData) => {
  console.log("Sending to Server:", Object.fromEntries(doctorData.entries()));
  const response = await api.post(`/v1/doctor/${id}`, doctorData, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  return response.data;
};

export interface DoctorSchedule {
  id: number;
  doctor_profile_id: number;
  clinic_id: number;
  date: string;
  start_time: string;
  end_time: string;
  slot_duration: number;
  is_active: boolean;
  clinic?: {
    name: string;
    address: string;
  };
  created_at: string;
  updated_at: string;
}

export const getSchedulesByDoctor = async (doctorId: number) => {
  const response = await api.get(`/v1/doctor/${doctorId}/schedules`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  return response.data;
};

export const createDoctorSchedule = async (scheduleData: {
  doctor_profile_id: number;
  clinic_id: number;
  date: string;
  start_time: string;
  end_time: string;
  slot_duration: number;
  is_active: boolean;
}) => {
  const response = await api.post("/v1/doctor-schedule", scheduleData, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  return response.data;
};

export const updateDoctorSchedule = async (
  id: number,
  scheduleData: Partial<{
    doctor_profile_id: number;
    clinic_id: number;
    date: string;
    start_time: string;
    end_time: string;
    slot_duration: number;
    is_active: boolean;
  }>
) => {
  const response = await api.put(`/v1/doctor-schedule/${id}`, scheduleData, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  return response.data;
};

export const deleteDoctorSchedule = async (id: number) => {
  await api.delete(`/v1/doctor-schedule/${id}`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
};

export const deleteMessageById = async (id: number) => {
  await api.delete(`/v1/message/${id}`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
};

export const assignDoctorToClinic = async (data: {
  doctor_id: string;
  clinic_id: string;
}) => {
  const response = await api.post("/v1/assign-doctor", data, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  return response.data;
};

export const removeDoctorFromClinic = (id: number) => {
  return api.delete(`/v1/doctor-clinic/${id}`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
};

export const getDoctorClinicAssignments = async () => {
  const response = await api.get("/v1/doctor-clinic-assignments", {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  return response.data;
};
