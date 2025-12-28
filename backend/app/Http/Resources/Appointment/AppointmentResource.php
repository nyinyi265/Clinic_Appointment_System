<?php

namespace App\Http\Resources\Appointment;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AppointmentResource extends JsonResource
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
            'patient_profile_id' => $this->patient_profile_id,
            'doctor_profile_id' => $this->doctor_profile_id,
            'clinic_id' => $this->clinic_id,
            'appointment_date' => $this->appointment_date,
            'start_time' => $this->start_time,
            'end_time' => $this->end_time,
            'status' => $this->status,
            'notes' => $this->notes,
            'patient_profile' => $this->whenLoaded('patientProfile'),
            'doctor_profile' => $this->whenLoaded('doctorProfile'),
            'clinic' => $this->whenLoaded('clinic'),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
