<?php

namespace App\Services\DoctorProfile;

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
        $doctor = User::role('doctor')->whereHas('doctor_profile', function($q) use ($id) {
            $q->where('id', $id);
        })->with('doctor_profile')->first();
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

        $user->assignRole('doctor');

        return $user->load('doctor_profile');
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
        $doctor = User::role('doctor')->where('id', $id)->first();

        if (!$doctor) {
            return null;
        }

        DB::transaction(function () use ($doctor, $data) {
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

            $profileData = array_filter([
                'license_number' => $data['license_number'] ?? null,
                'is_active' => $data['is_active'] ?? null,
                'profile_picture' => $data['profile_picture'] ?? null,
            ], fn($value) => !is_null($value));

            if (!empty($profileData)) {
                $profile = $doctor->doctor_profile;
                if ($profile) {
                    $profile->fill($profileData)->save();
                }
            }

        });

        return $doctor->load('doctor_profile');
    }
}
