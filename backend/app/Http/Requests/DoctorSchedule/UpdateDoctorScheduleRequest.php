<?php

namespace App\Http\Requests\DoctorSchedule;

use Illuminate\Foundation\Http\FormRequest;

class UpdateDoctorScheduleRequest extends FormRequest
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
            'doctor_profile_id' => 'exists:doctor_profiles,id',
            'clinic_id' => 'exists:clinics,id',
            'date' => 'date',
            'start_time' => 'date_format:H:i',
            'end_time' => 'date_format:H:i|after:start_time',
            'slot_duration' => 'integer|min:1',
            'is_active' => 'boolean',
        ];
    }
}
