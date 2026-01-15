<?php

namespace App\Http\Controllers\DoctorClinic;

use App\Http\Controllers\Controller;
use App\Http\Requests\DoctorClinic\StoreDoctorClinicRequest;
use App\Http\Requests\DoctorClinic\UpdateDoctorClinicRequest;
use App\Http\Resources\DoctorClinic\DoctorClinicResource;
use App\Services\DoctorClinic\DoctorClinicService;
use App\Trait\HttpResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class DoctorClinicController extends Controller
{
    use HttpResponse;

    protected $doctorClinicService;

    public function __construct(DoctorClinicService $doctorClinicService)
    {
        $this->doctorClinicService = $doctorClinicService;
    }

    public function getAllDoctorClinics()
    {
        try {
            $doctorClinics = $this->doctorClinicService->getAllDoctorClinics();
            if (!$doctorClinics) {
                return $this->fail('fail', null, 'No doctor-clinic associations found', 404);
            }

            return $this->success('success', [
                'data' => DoctorClinicResource::collection($doctorClinics),
            ], 'Doctor-clinic associations retrieved successfully', 200);
        } catch (\Exception $e) {
            return $this->fail('fail', null, 'Internal server error', 500);
        }
    }

    public function getDoctorClinicById($id)
    {
        $doctorClinic = $this->doctorClinicService->getDoctorClinicById($id);
        if (!$doctorClinic) {
            return $this->fail('fail', null, 'Doctor-clinic association not found', 404);
        }

        return $this->success('success', [
            'data' => DoctorClinicResource::make($doctorClinic),
        ], 'Doctor-clinic association retrieved successfully', 200);
    }

    public function createDoctorClinic(StoreDoctorClinicRequest $request)
    {
        DB::beginTransaction();
        try {
            $validated = $request->validated();
            $createdDoctorClinic = $this->doctorClinicService->createDoctorClinic($validated);

            if (!$createdDoctorClinic) {
                return $this->fail('fail', null, 'Doctor-clinic association creation failed', 400);
            }

            DB::commit();

            return $this->success('success', [
                'data' => DoctorClinicResource::make($createdDoctorClinic),
            ], 'Doctor-clinic association created successfully', 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->fail('fail', null, $e->getMessage(), 500);
        }
    }

    public function updateDoctorClinic($id, UpdateDoctorClinicRequest $request)
    {
        DB::beginTransaction();
        try {
            $validated = $request->validated();

            $updatedDoctorClinic = $this->doctorClinicService->updateDoctorClinic($id, $validated);

            if (!$updatedDoctorClinic) {
                return $this->fail('fail', null, 'Doctor-clinic association not found', 404);
            }

            DB::commit();

            return $this->success('success', [
                'data' => DoctorClinicResource::make($updatedDoctorClinic),
            ], 'Doctor-clinic association updated successfully', 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->fail('fail', null, 'Unable to update doctor-clinic association', 500);
        }
    }

    public function deleteDoctorClinic($id)
    {
        $deletedDoctorClinic = $this->doctorClinicService->deleteDoctorClinic($id);

        if (!$deletedDoctorClinic) {
            return $this->fail('fail', null, 'Doctor-clinic association not found', 404);
        }

        return $this->success('success', null, 'Doctor-clinic association deleted successfully', 200);
    }

    public function getClinicsByDoctor($doctorId)
    {
        try {
            $clinics = $this->doctorClinicService->getClinicsByDoctor($doctorId);
            if (!$clinics) {
                return $this->fail('fail', null, 'No clinics found for this doctor', 404);
            }

            return $this->success('success', [
                'data' => DoctorClinicResource::collection($clinics),
            ], 'Clinics retrieved successfully', 200);
        } catch (\Exception $e) {
            return $this->fail('fail', null, 'Internal server error', 500);
        }
    }

    public function getDoctorsByClinic($clinicId)
    {
        try {
            $doctors = $this->doctorClinicService->getDoctorsByClinic($clinicId);
            if (!$doctors) {
                return $this->fail('fail', null, 'No doctors found for this clinic', 404);
            }

            return $this->success('success', [
                'data' => DoctorClinicResource::collection($doctors),
            ], 'Doctors retrieved successfully', 200);
        } catch (\Exception $e) {
            return $this->fail('fail', null, $e->getMessage(), 500);
        }
    }

    public function getPendingClinicRequests()
    {
        try {
            $requests = $this->doctorClinicService->getPendingClinicRequests();
            if (!$requests) {
                return $this->fail('fail', null, 'No pending requests found', 404);
            }

            return $this->success('success', [
                'data' => DoctorClinicResource::collection($requests),
            ], 'Pending requests retrieved successfully', 200);
        } catch (\Exception $e) {
            return $this->fail('fail', null, 'Internal server error', 500);
        }
    }

    public function assignDoctor(Request $request)
    {
        $validated = $request->validate([
            'doctor_id' => 'required|exists:users,id',
            'clinic_id' => 'required|exists:clinics,id',
        ]);

        try {
            $assignment = $this->doctorClinicService->assignDoctor($validated['doctor_id'], $validated['clinic_id']);

            return $this->success('success', [
                'data' => DoctorClinicResource::make($assignment),
            ], 'Doctor assigned to clinic successfully', 201);
        } catch (\Exception $e) {
            return $this->fail('fail', null, $e->getMessage(), 500);
        }
    }

    public function getAssignments()
    {
        try {
            $assignments = $this->doctorClinicService->getAssignments();

            return $this->success('success', [
                'data' => $assignments,
            ], 'Assignments retrieved successfully', 200);
        } catch (\Exception $e) {
            return $this->fail('fail', null, $e->getMessage(), 500);
        }
    }
}
