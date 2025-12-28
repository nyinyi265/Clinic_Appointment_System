<?php

namespace App\Services\Appointment;

use App\Models\Appointment;

class AppointmentService
{
    public function getAllAppointments()
    {
        return Appointment::with(['patientProfile', 'doctorProfile', 'clinic'])->get();
    }

    public function getAppointmentById($id)
    {
        return Appointment::with(['patientProfile', 'doctorProfile', 'clinic'])->find($id);
    }

    public function createAppointment($data)
    {
        return Appointment::create($data);
    }

    public function updateAppointment($id, $data)
    {
        $appointment = Appointment::find($id);
        if ($appointment) {
            $appointment->update($data);
            return $appointment;
        }
        return null;
    }

    public function deleteAppointment($id)
    {
        $appointment = Appointment::find($id);
        if ($appointment) {
            $appointment->delete();
            return true;
        }
        return false;
    }

    public function getAppointmentsByPatient($patientId)
    {
        return Appointment::with(['doctorProfile', 'clinic'])
            ->where('patient_profile_id', $patientId)
            ->get();
    }

    public function getAppointmentsByDoctor($doctorId)
    {
        return Appointment::with(['patientProfile', 'clinic'])
            ->where('doctor_profile_id', $doctorId)
            ->get();
    }

    public function getAppointmentsByClinic($clinicId)
    {
        return Appointment::with(['patientProfile', 'doctorProfile'])
            ->where('clinic_id', $clinicId)
            ->get();
    }

    public function getAppointmentsByDate($date)
    {
        return Appointment::with(['patientProfile', 'doctorProfile', 'clinic'])
            ->where('appointment_date', $date)
            ->get();
    }

    public function getAppointmentsByStatus($status)
    {
        return Appointment::with(['patientProfile', 'doctorProfile', 'clinic'])
            ->where('status', $status)
            ->get();
    }
}
