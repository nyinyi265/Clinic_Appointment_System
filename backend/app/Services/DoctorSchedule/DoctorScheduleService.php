<?php

namespace App\Services\DoctorSchedule;

use App\Models\DoctorSchedule;

class DoctorScheduleService
{
    public function getAllDoctorSchedules()
    {
        return DoctorSchedule::with(['doctorProfile', 'clinic'])->get();
    }

    public function getSchedulesByDoctor($doctorId)
    {
        return DoctorSchedule::where('doctor_profile_id', $doctorId)->with(['clinic', 'doctorProfile'])->get();
    }

    public function getDoctorScheduleById($id)
    {
        return DoctorSchedule::with(['doctorProfile', 'clinic'])->find($id);
    }

    public function createDoctorSchedule($data)
    {
        return DoctorSchedule::create($data);
    }

    public function updateDoctorSchedule($id, $data)
    {
        $doctorSchedule = DoctorSchedule::find($id);
        if ($doctorSchedule) {
            $doctorSchedule->update($data);
            return $doctorSchedule;
        }
        return null;
    }

    public function deleteDoctorSchedule($id)
    {
        $doctorSchedule = DoctorSchedule::find($id);
        if ($doctorSchedule) {
            $doctorSchedule->delete();
            return true;
        }
        return false;
    }
}
