<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;

class DoctorClinic extends Pivot
{
    protected $table = 'doctor_clinics';

    public $incrementing = true;
    public $timestamps = true;

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
