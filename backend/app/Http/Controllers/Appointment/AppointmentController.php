<?php

namespace App\Http\Controllers\Appointment;

use App\Http\Controllers\Controller;
use App\Http\Requests\Appointment\StoreAppointmentRequest;
use App\Http\Requests\Appointment\UpdateAppointmentRequest;
use App\Http\Resources\Appointment\AppointmentResource;
use App\Services\Appointment\AppointmentService;
use App\Trait\HttpResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class AppointmentController extends Controller
{
    use HttpResponse;

    protected $appointmentService;

    public function __construct(AppointmentService $appointmentService)
    {
        $this->appointmentService = $appointmentService;
    }

    public function getAllAppointments()
    {
        try {
            $appointments = $this->appointmentService->getAllAppointments();
            if (!$appointments) {
                return $this->fail('fail', null, 'No appointments found', 404);
            }

            return $this->success('success', [
                'data' => AppointmentResource::collection($appointments),
            ], 'Appointments retrieved successfully', 200);
        } catch (\Exception $e) {
            return $this->fail('fail', null, 'Internal server error', 500);
        }
    }

    public function getAppointmentById($id)
    {
        $appointment = $this->appointmentService->getAppointmentById($id);
        if (!$appointment) {
            return $this->fail('fail', null, 'Appointment not found', 404);
        }

        return $this->success('success', [
            'data' => AppointmentResource::make($appointment),
        ], 'Appointment retrieved successfully', 200);
    }

    public function createAppointment(StoreAppointmentRequest $request)
    {
        // \Log::info('Create appointment controller reached');
        DB::beginTransaction();
        try {
            $validated = $request->validated();

            $createdAppointment = $this->appointmentService->createAppointment($validated);

            if (!$createdAppointment) {
                return $this->fail('fail', null, 'Appointment creation failed', 400);
            }

            DB::commit();

            // \Log::info('Returning success with code 201');
            return $this->success('success', [
                'data' => AppointmentResource::make($createdAppointment),
            ], 'Appointment created successfully', 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->fail('fail', null, $e->getMessage(), 500);
        }
    }

    public function updateAppointment($id, UpdateAppointmentRequest $request)
    {
        DB::beginTransaction();
        try {
            $validated = $request->validated();

            $updatedAppointment = $this->appointmentService->updateAppointment($id, $validated);

            if (!$updatedAppointment) {
                return $this->fail('fail', null, 'Appointment not found', 404);
            }

            DB::commit();

            return $this->success('success', [
                'data' => AppointmentResource::make($updatedAppointment),
            ], 'Appointment updated successfully', 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->fail('fail', null, 'Unable to update appointment', 500);
        }
    }

    public function deleteAppointment($id)
    {
        $deletedAppointment = $this->appointmentService->deleteAppointment($id);

        if (!$deletedAppointment) {
            return $this->fail('fail', null, 'Appointment not found', 404);
        }

        return $this->success('success', null, 'Appointment deleted successfully', 200);
    }

    public function getAppointmentsByPatient($patientId)
    {
        try {
            $appointments = $this->appointmentService->getAppointmentsByPatient($patientId);
            if (!$appointments) {
                return $this->fail('fail', null, 'No appointments found for this patient', 404);
            }

            return $this->success('success', [
                'data' => AppointmentResource::collection($appointments),
            ], 'Appointments retrieved successfully', 200);
        } catch (\Exception $e) {
            return $this->fail('fail', null, 'Internal server error', 500);
        }
    }

    public function getAppointmentsByDoctor($doctorId)
    {
        try {
            $appointments = $this->appointmentService->getAppointmentsByDoctor($doctorId);
            if (!$appointments) {
                return $this->fail('fail', null, 'No appointments found for this doctor', 404);
            }

            return $this->success('success', [
                'data' => AppointmentResource::collection($appointments),
            ], 'Appointments retrieved successfully', 200);
        } catch (\Exception $e) {
            return $this->fail('fail', null, 'Internal server error', 500);
        }
    }

    public function getAppointmentsByClinic($clinicId)
    {
        try {
            $appointments = $this->appointmentService->getAppointmentsByClinic($clinicId);
            if (!$appointments) {
                return $this->fail('fail', null, 'No appointments found for this clinic', 404);
            }

            return $this->success('success', [
                'data' => AppointmentResource::collection($appointments),
            ], 'Appointments retrieved successfully', 200);
        } catch (\Exception $e) {
            return $this->fail('fail', null, 'Internal server error', 500);
        }
    }

    public function getAppointmentsByDate($date)
    {
        try {
            $appointments = $this->appointmentService->getAppointmentsByDate($date);
            if (!$appointments) {
                return $this->fail('fail', null, 'No appointments found for this date', 404);
            }

            return $this->success('success', [
                'data' => AppointmentResource::collection($appointments),
            ], 'Appointments retrieved successfully', 200);
        } catch (\Exception $e) {
            return $this->fail('fail', null, 'Internal server error', 500);
        }
    }

    public function getAppointmentsByStatus($status)
    {
        try {
            $appointments = $this->appointmentService->getAppointmentsByStatus($status);
            if (!$appointments) {
                return $this->fail('fail', null, 'No appointments found with this status', 404);
            }

            return $this->success('success', [
                'data' => AppointmentResource::collection($appointments),
            ], 'Appointments retrieved successfully', 200);
        } catch (\Exception $e) {
            return $this->fail('fail', null, 'Internal server error', 500);
        }
    }
}
