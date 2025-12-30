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
            'patient' => $this->whenLoaded('patientProfile', function () {
                return [
                    'id' => $this->patientProfile->id,
                    'user' => $this->patientProfile->user ? [
                        'id' => $this->patientProfile->user->id,
                        'first_name' => $this->patientProfile->user->first_name,
                        'last_name' => $this->patientProfile->user->last_name,
                        'email' => $this->patientProfile->user->email,
                        'phone_number' => $this->patientProfile->user->phone_number,
                    ] : null,
                ];
            }),
            'doctor' => $this->whenLoaded('doctorProfile', function () {
                return [
                    'id' => $this->doctorProfile->id,
                    'user' => $this->doctorProfile->user ? [
                        'id' => $this->doctorProfile->user->id,
                        'first_name' => $this->doctorProfile->user->first_name,
                        'last_name' => $this->doctorProfile->user->last_name,
                        'email' => $this->doctorProfile->user->email,
                        'phone_number' => $this->doctorProfile->user->phone_number,
                    ] : null,
                ];
            }),
            'clinic' => $this->whenLoaded('clinic', function () {
                return [
                    'id' => $this->clinic->id,
                    'name' => $this->clinic->name,
                    'address' => $this->clinic->address,
                    'phone_number' => $this->clinic->phone_number,
                ];
            }),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
