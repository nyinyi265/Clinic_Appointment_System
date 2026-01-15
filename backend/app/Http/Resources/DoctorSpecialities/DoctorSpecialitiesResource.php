<?php

namespace App\Http\Resources\DoctorSpecialities;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DoctorSpecialitiesResource extends JsonResource
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
            'speciality_id' => $this->speciality_id,
            'doctor' => $this->whenLoaded('doctor'),
            'speciality' => $this->whenLoaded('speciality'),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
