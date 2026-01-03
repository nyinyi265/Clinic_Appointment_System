<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PatientProfile extends Model
{
    //
    protected $fillable = [
        'user_id',
        'age',
        'dob',
        'gender',
        'address',
        'profile_picture',
    ];

    public function user(){
        return $this->belongsTo(User::class);
    }
    public function appointments(){
        return $this->hasMany(Appointment::class);
    }
}
