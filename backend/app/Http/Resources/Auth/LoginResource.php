<?php

namespace App\Http\Resources\Auth;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class LoginResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $data = [
            'id' => $this->id,
            'first_name' => $this->first_name,
            'last_name' => $this->last_name,
            'phone_number' => $this->phone_number,
            'email' => $this->email,
            'password' => $this->password,
            'role' => $this->getRoleNames(),
        ];

        // Patient profile
        if ($this->relationLoaded('patient_profile') && $this->patient_profile) {
            $data['profile'] = $this->patient_profile->makeHidden(['id','user_id', 'created_at', 'updated_at'])->toArray();
        }

        // Doctor profile
        if ($this->relationLoaded('doctor_profile') && $this->doctor_profile) {
            $data['profile'] = $this->doctor_profile->makeHidden(['id', 'user_id', 'created_at', 'updated_at'])->toArray();
        }

        return $data;
    }
}
