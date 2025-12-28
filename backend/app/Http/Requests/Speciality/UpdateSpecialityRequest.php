<?php

namespace App\Http\Requests\Speciality;

use Illuminate\Foundation\Http\FormRequest;

class UpdateSpecialityRequest extends FormRequest
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
        $specialityId = $this->route('id'); // Get the speciality ID from route

        return [
            'name' => 'string|max:255|unique:specialities,name,' . $specialityId,
            'description' => 'nullable|string|max:1000',
        ];
    }
}
