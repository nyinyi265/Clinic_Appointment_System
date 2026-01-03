<?php

namespace App\Services\DoctorClinic;

use App\Models\DoctorClinic;

class DoctorClinicService
{
    public function getAllDoctorClinics()
    {
        return DoctorClinic::with(['doctor', 'clinic'])->get();
    }

    public function getDoctorClinicById($id)
    {
        return DoctorClinic::with(['doctor', 'clinic'])->find($id);
    }

    public function createDoctorClinic($data)
    {
        return DoctorClinic::create($data);
    }

    public function updateDoctorClinic($id, $data)
    {
        $doctorClinic = DoctorClinic::find($id);
        if ($doctorClinic) {
            $doctorClinic->update($data);
            return $doctorClinic;
        }
        return null;
    }

    public function deleteDoctorClinic($id)
    {
        $doctorClinic = DoctorClinic::find($id);
        if ($doctorClinic) {
            $doctorClinic->delete();
            return true;
        }
        return false;
    }

    public function getClinicsByDoctor($doctorId)
    {
        return DoctorClinic::with('clinic')->where('doctor_profile_id', $doctorId)->get();
    }

    public function getDoctorsByClinic($clinicId)
    {
        return DoctorClinic::with(['doctor.user', 'doctor.specialities', 'clinic'])->where('clinic_id', $clinicId)->get();
    }
}
