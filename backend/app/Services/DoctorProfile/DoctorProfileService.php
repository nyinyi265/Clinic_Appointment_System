<?php

namespace App\Services\DoctorProfile;

use App\Models\DoctorSpecialities;
use App\Models\PatientProfile;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class DoctorProfileService
{
    //
    public function getAllDoctors()
    {
        $doctors = User::role('doctor')->whereHas('doctor_profile')->with(['doctor_profile.specialities', 'doctor_profile.clinics'])->get();
        return $doctors;
    }

    public function getDoctorById($id)
    {
        $doctor = User::role('doctor')
            ->where('id', $id)
            ->with(['doctor_profile.specialities', 'doctor_profile.clinics'])
            ->first();
        return $doctor;
    }

    public function registerDoctor($data)
    {
        $user = User::create([
            'first_name' => $data['first_name'],
            'last_name' => $data['last_name'],
            'phone_number' => $data['phone_number'],
            'email' => $data['email'],
            'password' => bcrypt($data['password']),
        ]);

        $doctorProfile = $user->doctor_profile()->create([
            'license_number' => $data['license_number'],
            'is_active' => $data['is_active'],
        ]);

        // Create doctor specialities if provided
        if (isset($data['specialities']) && is_array($data['specialities'])) {
            foreach ($data['specialities'] as $specialityId) {
                DoctorSpecialities::create([
                    'doctor_profile_id' => $doctorProfile->id,
                    'speciality_id' => $specialityId,
                ]);
            }
        }

        $user->assignRole('doctor');

        return $user->load('doctor_profile.specialities');
    }

    public function doctorLogin($data)
    {
        $doctor = User::role('doctor')->where('email', $data['email'])->first();

        if (!$doctor || !Hash::check($data['password'], $doctor->password)) {
            return null;
        }
        return $doctor;
    }

    public function deleteDoctor($id)
    {
        $doctor = User::role('doctor')->where('id', $id)->first();
        $doctor->delete();
        return $doctor;
    }

    public function updateDoctor($id, $data)
    {
        // Find the user by ID
        $doctor = User::role('doctor')->where('id', $id)->first();

        if (!$doctor) {
            return null;
        }

        DB::transaction(function () use ($doctor, $data) {
            // 1. Update User Data
            $updateUserData = array_filter([
                'first_name' => $data['first_name'] ?? null,
                'last_name' => $data['last_name'] ?? null,
                'email' => $data['email'] ?? null,
                'phone_number' => $data['phone_number'] ?? null,
            ], fn($value) => !is_null($value));

            if (isset($data['password']) && $data['password'] !== '') {
                $updateUserData['password'] = bcrypt($data['password']);
            }

            if (!empty($updateUserData)) {
                $doctor->update($updateUserData);
            }

            // 2. Fix: Get profile OR create it if it's missing
            $profile = $doctor->doctor_profile;

            $profileData = array_filter([
                'license_number' => $data['license_number'] ?? null,
                'is_active' => $data['is_active'] ?? null,
                'profile_picture' => $data['profile_picture'] ?? null,
            ], fn($value) => !is_null($value));

            if ($profile) {
                $profile->update($profileData);
            } else {
                // Create profile if this user doesn't have one yet
                $doctor->doctor_profile()->create($profileData);
                $profile = $doctor->fresh()->doctor_profile;
            }

            // 3. Update Specialities
            if (isset($data['specialities']) && is_array($data['specialities'])) {
                // Use the relationship if defined, otherwise manual delete
                $profile->specialities()->detach();

                foreach ($data['specialities'] as $specialityId) {
                    DoctorSpecialities::create([
                        'doctor_profile_id' => $profile->id,
                        'speciality_id' => $specialityId,
                    ]);
                }
            }
        });

        return $doctor->load('doctor_profile.specialities');
    }

    public function getPatientsByDoctor($doctorId)
    {
        $patients = PatientProfile::whereHas('appointments', function ($q) use ($doctorId) {
            $q->where('doctor_profile_id', $doctorId);
        })
            ->with('user')
            ->withCount([
                'appointments' => function ($q) use ($doctorId) {
                    $q->where('doctor_profile_id', $doctorId);
                }
            ])
            ->get();

        return $patients;
    }
}
