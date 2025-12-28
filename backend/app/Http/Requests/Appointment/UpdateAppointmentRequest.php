<?php

namespace App\Http\Requests\Appointment;

use Illuminate\Foundation\Http\FormRequest;

class UpdateAppointmentRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'patient_profile_id' => 'exists:patient_profiles,id',
            'doctor_profile_id' => 'exists:doctor_profiles,id',
            'clinic_id' => 'exists:clinics,id',
            'appointment_date' => 'date|after_or_equal:today',
            'start_time' => 'date_format:H:i',
            'end_time' => 'date_format:H:i|after:start_time',
            'status' => 'string|in:pending,scheduled,confirmed,completed,cancelled,no-show',
            'notes' => 'nullable|string|max:1000',
        ];
    }
}
