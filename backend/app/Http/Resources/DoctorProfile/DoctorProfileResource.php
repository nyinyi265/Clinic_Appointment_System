<?php

namespace App\Http\Resources\DoctorProfile;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DoctorProfileResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'first_name' => $this->first_name,
            'last_name' => $this->last_name,
            'phone_number' => $this->phone_number,
            'email' => $this->email,
            'password' => $this->password,
            'profile' => [
                'id' => $this->doctor_profile->id,
                'license_number' => $this->doctor_profile->license_number,
                'is_active' => $this->doctor_profile->is_active,
                'profile_picture' => $this->doctor_profile->profile_picture,
            ],
            'specialities' => $this->doctor_profile->specialities->map(function ($speciality) {
                return [
                    'id' => $speciality->id,
                    'name' => $speciality->name,
                ];
            }),
            'clinics' => $this->doctor_profile->clinics->map(function ($clinic) {
                return [
                    'id' => $clinic->id,
                    'name' => $clinic->name,
                    'pivot' => [
                        'is_active' => $clinic->pivot->is_active,
                    ],
                ];
            }),
            'role' => $this->getRoleNames(),
        ];
    }
}
