<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Speciality extends Model
{
    //
    protected $fillable = [
        'name',
        'description',
    ];

    public function doctors(){
        return $this->belongsToMany(DoctorProfile::class, 'doctor_specialities', 'speciality_id', 'doctor_profile_id');
    }
}
