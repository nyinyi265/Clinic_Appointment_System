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
            'password' => $this->password,
            'gender' => $this->patient_profile->gender,
            'age' => $this->patient_profile->age,
            'dob' => $this->patient_profile->dob,
            'address' => $this->patient_profile->address,
            'role' => $this->getRoleNames(),
        ];
    }
}
