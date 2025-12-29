import api from '../src/util/axios';

export const getAllPatients = async () => {
    const token = localStorage.getItem('token');
    const response = await api.get('/v1/all-patients', {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
}

export const deletePatientById = async (id: number) => {
    const token = localStorage.getItem('token');
    await api.delete(`/v1/patient/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
}