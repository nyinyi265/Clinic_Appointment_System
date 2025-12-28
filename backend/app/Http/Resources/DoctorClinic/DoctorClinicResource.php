<?php

namespace App\Http\Resources\DoctorClinic;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DoctorClinicResource extends JsonResource
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
            'doctor_profile_id' => $this->doctor_profile_id,
            'clinic_id' => $this->clinic_id,
            'role' => $this->role,
            'is_active' => $this->is_active,
            'doctor' => $this->whenLoaded('doctor'),
            'clinic' => $this->whenLoaded('clinic'),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
