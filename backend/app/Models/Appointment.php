<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Appointment extends Model
{
    //
    protected $fillable = [
        'patient_profile_id',
        'doctor_profile_id',
        'clinic_id',
        'appointment_date',
        'start_time',
        'end_time',
        'status',
        'notes',
    ];

    public function patientProfile(){
        return $this->belongsTo(PatientProfile::class);
    }

    public function doctorProfile(){
        return $this->belongsTo(DoctorProfile::class);
    }

    public function clinic(){
        return $this->belongsTo(Clinic::class);
    }
}
