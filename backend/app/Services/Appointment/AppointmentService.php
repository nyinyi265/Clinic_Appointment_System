<?php

namespace App\Services\Appointment;

use App\Models\Appointment;

class AppointmentService
{
    public function getAllAppointments()
    {
        return Appointment::with(['patientProfile.user', 'doctorProfile.user', 'clinic'])->get();
    }

    public function getAppointmentById($id)
    {
        return Appointment::with(['patientProfile.user', 'doctorProfile.user', 'clinic'])->find($id);
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

    public function updateAppointmentStatusForPatient(
        int $appointmentId,
        string $status,
        int $patientProfileId
    ): Appointment {

        $appointment = Appointment::where('id', $appointmentId)
            ->where('patient_profile_id', $patientProfileId)
            ->first();

        if (!$appointment) {
            throw new \Exception('Appointment not found');
        }

        if (!in_array($status, ['confirmed', 'cancelled'])) {
            throw new \InvalidArgumentException('Invalid status');
        }

        if (in_array($appointment->status, ['completed', 'cancelled'])) {
            throw new \Exception('Appointment cannot be updated');
        }

        $appointment->update(['status' => $status]);

        return $appointment;
    }

    public function updateAppointmentStatusForDoctor(
        int $appointmentId,
        string $status,
        int $doctorProfileId
    ): Appointment {
        $appointment = Appointment::where('id', $appointmentId)
            ->where('doctor_profile_id', $doctorProfileId)
            ->first();

        if (!$appointment) {
            throw new \Exception('Appointment not found');
        }

        if (!in_array($status, ['confirmed', 'completed', 'rejected'])) {
            throw new \InvalidArgumentException('Invalid status');
        }

        if ($appointment->status === 'completed') {
            throw new \Exception('Completed appointment cannot be updated');
        }

        $appointment->update(['status' => $status]);

        return $appointment;
    }

}
