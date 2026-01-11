<?php

namespace App\Http\Resources\Clinic;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ClinicResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return[
            'id' => $this->id,
            'name' => $this->name,
            'address' => $this->address,
            'phone_number' => $this->phone_number,
            'is_related' => !is_null($this->relation_id) && $this->is_active,
            'is_requested' => !is_null($this->relation_id) && !$this->is_active,
            'role' => $this->role,
            'is_active' => $this->is_active,
        ];
    }
}
