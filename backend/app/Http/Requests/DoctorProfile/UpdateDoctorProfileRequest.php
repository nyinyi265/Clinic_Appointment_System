<?php

namespace App\Http\Requests\DoctorProfile;

use Illuminate\Foundation\Http\FormRequest;

class UpdateDoctorProfileRequest extends FormRequest
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
            'first_name' => 'string|max:255',
            'last_name' => 'string|max:255',
            'phone_number' => 'string|max:15',
            'email' => 'email|unique:users,email,' . $this->route('id') . '|string',
            'password' => 'nullable|string|min:8',
            'license_number' => 'string',
            'is_active' => 'boolean',
            'profile_picture' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'specialities' => 'nullable|array',
            'specialities.*' => 'exists:specialities,id',
        ];
    }
}
