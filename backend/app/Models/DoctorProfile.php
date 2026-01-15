<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\Permission\Traits\HasRoles;

class DoctorProfile extends Model
{
    use HasRoles;
    //
    protected $fillable = [
        'user_id',
        'license_number',
        'is_active',
        'profile_picture',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function specialities()
    {
        return $this->belongsToMany(Speciality::class, 'doctor_specialities', 'doctor_profile_id', 'speciality_id');
    }
    public function clinics()
    {
        return $this->belongsToMany(
            Clinic::class,
            'doctor_clinics',
            'doctor_profile_id',
            'clinic_id'
        )
            ->using(DoctorClinic::class)
            ->withPivot(['role', 'is_active'])
            ->withTimestamps();
    }
    public function appointments()
    {
        return $this->hasMany(Appointment::class);
    }

    public function schedules()
    {
        return $this->hasMany(DoctorSchedule::class, 'doctor_profile_id');
    }

}
