<?php

namespace App\Services\Auth;

use App\Models\PatientProfile;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AuthService
{
    //
    public function patientRegister($data)
    {
        $user = User::create([
            'first_name' => $data['first_name'],
            'last_name' => $data['last_name'],
            'phone_number' => $data['phone_number'],
            'email' => $data['email'],
            'password' => bcrypt($data['password']),
        ]);

        $patient = $user->patient_profile()->create([
            'age' => $data['age'],
            'dob' => $data['dob'],
            'gender' => $data['gender'],
            'address' => $data['address'],
        ]);
        $user->assignRole('patient');
        $user->load('patient_profile');
        return $user;
    }

    public function patientLogin($data)
    {
        $user = User::where('email', $data['email'])->first();
        if (!$user || !Hash::check($data['password'], $user->password)) {
            return null;
        }
        if ($user->hasRole('patient')) {
            return null;
        }
        return $user;
    }

    public function adminLogin($data)
    {
        $admin = User::where('email', $data['email'])->first();
        if (!$admin || !Hash::check($data['password'], $admin->password)) {
            return null;
        }
        if ($admin->hasRole('admin')) {
            return null;
        }
        return $admin;
    }
}
