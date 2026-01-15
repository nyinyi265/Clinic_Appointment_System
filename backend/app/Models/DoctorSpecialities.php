<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DoctorSpecialities extends Model
{
    protected $fillable = [
        'doctor_profile_id',
        'speciality_id',
    ];

    public function doctor()
    {
        return $this->belongsTo(DoctorProfile::class, 'doctor_profile_id');
    }

    public function speciality()
    {
        return $this->belongsTo(Speciality::class, 'speciality_id');
    }
}
