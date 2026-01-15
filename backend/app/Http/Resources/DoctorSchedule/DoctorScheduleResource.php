<?php

namespace App\Http\Resources\DoctorSchedule;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DoctorScheduleResource extends JsonResource
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
            'date' => $this->date,
            'start_time' => $this->start_time,
            'end_time' => $this->end_time,
            'slot_duration' => $this->slot_duration,
            'is_active' => $this->is_active,
            'doctor_profile' => $this->whenLoaded('doctorProfile'),
            'clinic' => $this->whenLoaded('clinic'),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
