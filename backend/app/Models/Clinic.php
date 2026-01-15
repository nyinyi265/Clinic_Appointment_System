<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Clinic extends Model
{
    //
    protected $fillable = [
        'name',
        'address',
        'phone_number',
    ];

    public function doctors()
    {
        return $this->belongsToMany(
            DoctorProfile::class,
            'doctor_clinics',
            'clinic_id',
            'doctor_profile_id'

        )
            ->using(DoctorClinic::class)
            ->withPivot(['role', 'is_active'])
            ->withTimestamps();
    }

    public function appointments()
    {
        return $this->hasMany(Appointment::class);
    }

    public function doctorSchedules()
    {
        return $this->hasMany(DoctorSchedule::class, 'clinic_id');
    }
}
