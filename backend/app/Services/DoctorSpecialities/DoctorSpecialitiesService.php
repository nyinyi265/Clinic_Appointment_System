<?php

namespace App\Services\DoctorSpecialities;

use App\Models\DoctorSpecialities;

class DoctorSpecialitiesService
{
    public function getAllDoctorSpecialities()
    {
        return DoctorSpecialities::with(['doctor', 'speciality'])->get();
    }

    public function getDoctorSpecialityById($id)
    {
        return DoctorSpecialities::with(['doctor', 'speciality'])->find($id);
    }

    public function createDoctorSpeciality($data)
    {
        return DoctorSpecialities::create($data);
    }

    public function updateDoctorSpeciality($id, $data)
    {
        $doctorSpeciality = DoctorSpecialities::find($id);
        if ($doctorSpeciality) {
            $doctorSpeciality->update($data);
            return $doctorSpeciality;
        }
        return null;
    }

    public function deleteDoctorSpeciality($id)
    {
        $doctorSpeciality = DoctorSpecialities::find($id);
        if ($doctorSpeciality) {
            $doctorSpeciality->delete();
            return true;
        }
        return false;
    }

    public function getSpecialitiesByDoctor($doctorId)
    {
        return DoctorSpecialities::with('speciality')->where('doctor_profile_id', $doctorId)->get();
    }

    public function getDoctorsBySpeciality($specialityId)
    {
        return DoctorSpecialities::with('doctor')->where('speciality_id', $specialityId)->get();
    }
}
