<?php

namespace App\Http\Resources\Patient;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PatientProfileResource extends JsonResource
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
            'profile' => [
                'id' => $this->patient_profile->id ?? null,
                'gender' => $this->patient_profile->gender ?? null,
                'age' => $this->patient_profile->age ?? null,
                'dob' => $this->patient_profile->dob ?? null,
                'address' => $this->patient_profile->address ?? null,
                'profile_picture' => $this->patient_profile->profile_picture ?? null,
            ],
        ];

    }
}
