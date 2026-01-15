<?php

namespace App\Services\DoctorClinic;

use App\Models\DoctorClinic;
use App\Models\User;

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
        return DoctorClinic::with('clinic')->where('doctor_profile_id', $doctorId)->whereHas('clinic')->get();
    }

    public function getDoctorsByClinic($clinicId)
    {
        return DoctorClinic::with(['doctor.user', 'doctor.specialities', 'clinic'])->where('clinic_id', $clinicId)->get();
    }

    public function getPendingClinicRequests()
    {
        return DoctorClinic::with(['doctor.user', 'clinic'])->where('is_active', false)->get();
    }

    public function assignDoctor($userId, $clinicId)
    {
        $doctor = User::role('doctor')->where('id', $userId)->with('doctor_profile')->first();
        if (!$doctor || !$doctor->doctor_profile) {
            throw new \Exception('Doctor not found or profile missing');
        }

        $profileId = $doctor->doctor_profile->id;

        // Check if already assigned
        $existing = DoctorClinic::where('doctor_profile_id', $profileId)->where('clinic_id', $clinicId)->first();
        if ($existing) {
            throw new \Exception('Doctor is already assigned to this clinic');
        }

        return DoctorClinic::create([
            'doctor_profile_id' => $profileId,
            'clinic_id' => $clinicId,
            'role' => 'Doctor',
            'is_active' => true,
        ]);
    }

    public function getAssignments()
    {
        return DoctorClinic::with(['doctor.user', 'clinic'])->where('is_active', true)->get();
    }
}
