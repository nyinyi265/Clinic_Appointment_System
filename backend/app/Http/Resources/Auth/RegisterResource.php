<?php

namespace App\Http\Resources\Auth;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RegisterResource extends JsonResource
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
            'role' => $this->getRoleNames(),
        ];

        // Patient profile
        if ($this->relationLoaded('patient_profile') && $this->patient_profile) {
            $data['profile'] = $this->patient_profile->makeHidden(['user_id', 'created_at', 'updated_at'])->toArray();
        }

        return $data;
    }
}
