<?php

namespace App\Services\Clinic;

use App\Models\Clinic;

class ClinicService
{
    //
    public function getAllClinics(){
        $clinics = Clinic::all();
        return $clinics;
    }

    public function getClinicById($id){
        $clinic = Clinic::find($id);
        return $clinic;
    }

    public function createClinic($data){
        $clinic = Clinic::create($data);
        return $clinic;
    }

    public function updateClinic($id, $data){
        $clinic = Clinic::find($id);
        if ($clinic) {
            $clinic->update($data);
            return $clinic;
        }
        return null;
    }

    public function deleteClinic($id){
        $clinic = Clinic::find($id);
        if ($clinic) {
            $clinic->delete();
            return true;
        }
        return false;
    }

    public function getAllClinicsWithRelationForDoctor($doctorId){
        return Clinic::leftJoin('doctor_clinics', function($join) use ($doctorId) {
            $join->on('clinics.id', '=', 'doctor_clinics.clinic_id')
                 ->where('doctor_clinics.doctor_profile_id', '=', $doctorId);
        })->select('clinics.*', 'doctor_clinics.id as relation_id', 'doctor_clinics.role', 'doctor_clinics.is_active')->get();
    }
}
