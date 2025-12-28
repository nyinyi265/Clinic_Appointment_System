<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DoctorClinic extends Model
{
    protected $fillable = [
        'doctor_profile_id',
        'clinic_id',
        'role',
        'is_active',
    ];

    public function doctor()
    {
        return $this->belongsTo(DoctorProfile::class, 'doctor_profile_id');
    }

    public function clinic()
    {
        return $this->belongsTo(Clinic::class, 'clinic_id');
    }
}
