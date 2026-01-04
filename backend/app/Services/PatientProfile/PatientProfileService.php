<?php

namespace App\Services\PatientProfile;

use App\Models\User;
use Illuminate\Support\Facades\DB;

use function Illuminate\Log\log;

class PatientProfileService
{
    //
    public function getAllPatients()
    {
        $patient = User::role('patient')->with('patient_profile')->get();
        return $patient;
    }

    public function getPatientById($id)
    {
        $patient = User::role('patient')->where('id', $id)->with('patient_profile')->firstOrFail();
        return $patient;
    }

    public function deletePatient($id)
    {
        $patient = User::role('patient')->where('id', $id)->first();
        $patient->delete();
        return $patient;
    }

    public function updatePatient($id, $data)
    {
        log()->info('Update Patient Data:', $data);
        $patient = User::role('patient')->where('id', $id)->first();
        if (!$patient) {
            return null;
        }

        DB::transaction(function () use ($patient, $data) {
            $updateUserData = array_filter([
                'first_name' => $data['first_name'] ?? null,
                'last_name' => $data['last_name'] ?? null,
                'phone_number' => $data['phone_number'] ?? null,
                'email' => $data['email'] ?? null,
            ], fn($value) => !is_null($value));

            if (isset($data['password']) && $data['password'] !== '') {
                $updateUserData['password'] = bcrypt($data['password']);
            }

            if (!empty($updateUserData)) {
                $patient->update($updateUserData);
            }

            $profileData = array_filter([
                'age' => $data['age'] ?? null,
                'dob' => $data['dob'] ?? null,
                'gender' => $data['gender'] ?? null,
                'address' => $data['address'] ?? null,
                'profile_picture' => $data['profile_picture'] ?? null,
            ], fn($value) => !is_null($value));

            if (!empty($profileData)) {
                $profile = $patient->patient_profile;
                if ($profile) {
                    $profile->fill($profileData)->save();
                }
            }
        });
        return $patient->load('patient_profile');
    }
}
