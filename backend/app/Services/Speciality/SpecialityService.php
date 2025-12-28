<?php

namespace App\Services\Speciality;

use App\Models\Speciality;

class SpecialityService
{
    public function getAllSpecialities()
    {
        return Speciality::all();
    }

    public function getSpecialityById($id)
    {
        return Speciality::find($id);
    }

    public function createSpeciality($data)
    {
        return Speciality::create($data);
    }

    public function updateSpeciality($id, $data)
    {
        $speciality = Speciality::find($id);
        if ($speciality) {
            $speciality->update($data);
            return $speciality;
        }
        return null;
    }

    public function deleteSpeciality($id)
    {
        $speciality = Speciality::find($id);
        if ($speciality) {
            $speciality->delete();
            return true;
        }
        return false;
    }
}
