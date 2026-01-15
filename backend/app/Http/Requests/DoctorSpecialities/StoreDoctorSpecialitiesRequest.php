<?php

namespace App\Http\Requests\DoctorSpecialities;

use Illuminate\Foundation\Http\FormRequest;

class StoreDoctorSpecialitiesRequest extends FormRequest
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
            'doctor_profile_id' => 'required|exists:doctor_profiles,id',
            'speciality_id' => 'required|exists:specialities,id',
        ];
    }
}
