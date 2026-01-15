<?php

namespace App\Http\Controllers\DoctorSchedule;

use App\Http\Controllers\Controller;
use App\Http\Requests\DoctorSchedule\StoreDoctorScheduleRequest;
use App\Http\Requests\DoctorSchedule\UpdateDoctorScheduleRequest;
use App\Http\Resources\DoctorSchedule\DoctorScheduleResource;
use App\Models\DoctorClinic;
use App\Models\DoctorSchedule;
use App\Services\DoctorSchedule\DoctorScheduleService;
use App\Trait\HttpResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class DoctorScheduleController extends Controller
{
    use HttpResponse;

    protected $doctorScheduleService;

    public function __construct(DoctorScheduleService $doctorScheduleService)
    {
        $this->doctorScheduleService = $doctorScheduleService;
    }

    public function getAllDoctorSchedules()
    {
        try {
            $doctorSchedules = $this->doctorScheduleService->getAllDoctorSchedules();
            if (!$doctorSchedules) {
                return $this->fail('fail', null, 'No doctor schedules found', 404);
            }

            return $this->success('success', [
                'data' => DoctorScheduleResource::collection($doctorSchedules),
            ], 'Doctor schedules retrieved successfully', 200);
        } catch (\Exception $e) {
            return $this->fail('fail', null, 'Internal server error', 500);
        }
    }

    public function getSchedulesByDoctor($doctorId)
    {
        if (!Auth::check()) {
            return $this->fail('fail', null, 'Unauthenticated', 401);
        }

        $schedules = $this->doctorScheduleService->getSchedulesByDoctor($doctorId);

        if ($schedules->isEmpty()) {
            return $this->success('success', ['data' => []], 'No schedules found for this doctor', 200);
        }

        return $this->success(
            'success',
            ['data' => DoctorScheduleResource::collection($schedules)],
            'Doctor schedules retrieved successfully',
            200
        );
    }

    public function getDoctorScheduleById($id)
    {
        $doctorSchedule = $this->doctorScheduleService->getDoctorScheduleById($id);
        if (!$doctorSchedule) {
            return $this->fail('fail', null, 'Doctor schedule not found', 404);
        }

        return $this->success('success', [
            'data' => DoctorScheduleResource::make($doctorSchedule),
        ], 'Doctor schedule retrieved successfully', 200);
    }

    public function createDoctorSchedule(StoreDoctorScheduleRequest $request)
    {
        DB::beginTransaction();
        try {
            if (!Auth::check()) {
                return $this->fail('fail', null, 'Unauthenticated', 401);
            }
            $user = Auth::user();
            $doctorProfile = $user->doctor_profile;
            if (!$doctorProfile) {
                return $this->fail('fail', null, 'Doctor profile not found', 404);
            }
            $validated = $request->validated();
            if (!DoctorClinic::where('doctor_profile_id', $doctorProfile->id)->where('clinic_id', $validated['clinic_id'])->exists()) {
                return $this->fail('fail', null, 'You are not assigned to this clinic', 403);
            }
            $validated['doctor_profile_id'] = $doctorProfile->id;
            $createdDoctorSchedule = $this->doctorScheduleService->createDoctorSchedule($validated);

            if (!$createdDoctorSchedule) {
                return $this->fail('fail', null, 'Doctor schedule creation failed', 400);
            }

            DB::commit();

            return $this->success('success', [
                'data' => DoctorScheduleResource::make($createdDoctorSchedule),
            ], 'Doctor schedule created successfully', 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->fail('fail', null, $e->getMessage(), 500);
        }
    }

    public function updateDoctorSchedule($id, UpdateDoctorScheduleRequest $request)
    {
        DB::beginTransaction();
        try {
            if (!Auth::check()) {
                return $this->fail('fail', null, 'Unauthenticated', 401);
            }
            $user = Auth::user();
            $doctorProfile = $user->doctor_profile;
            if (!$doctorProfile) {
                return $this->fail('fail', null, 'Doctor profile not found', 404);
            }
            $validated = $request->validated();

            $doctorSchedule = DoctorSchedule::find($id);
            if (!$doctorSchedule) {
                return $this->fail('fail', null, 'Doctor schedule not found', 404);
            }

            if ($doctorSchedule->doctor_profile_id != $doctorProfile->id) {
                return $this->fail('fail', null, 'Unauthorized', 403);
            }

            if (isset($validated['clinic_id']) && !DoctorClinic::where('doctor_profile_id', $doctorSchedule->doctor_profile_id)->where('clinic_id', $validated['clinic_id'])->exists()) {
                return $this->fail('fail', null, 'You are not assigned to this clinic', 403);
            }

            $updatedDoctorSchedule = $this->doctorScheduleService->updateDoctorSchedule($id, $validated);

            if (!$updatedDoctorSchedule) {
                return $this->fail('fail', null, 'Doctor schedule not found', 404);
            }

            DB::commit();

            return $this->success('success', [
                'data' => DoctorScheduleResource::make($updatedDoctorSchedule),
            ], 'Doctor schedule updated successfully', 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->fail('fail', null, 'Unable to update doctor schedule', 500);
        }
    }

    public function deleteDoctorSchedule($id)
    {
        if (!Auth::check()) {
            return $this->fail('fail', null, 'Unauthenticated', 401);
        }
        $user = Auth::user();
        $doctorProfile = $user->doctor_profile;
        if (!$doctorProfile) {
            return $this->fail('fail', null, 'Doctor profile not found', 404);
        }
        $doctorSchedule = DoctorSchedule::find($id);
        if (!$doctorSchedule) {
            return $this->fail('fail', null, 'Doctor schedule not found', 404);
        }
        if ($doctorSchedule->doctor_profile_id != $doctorProfile->id) {
            return $this->fail('fail', null, 'Unauthorized', 403);
        }
        $deletedDoctorSchedule = $this->doctorScheduleService->deleteDoctorSchedule($id);
        if (!$deletedDoctorSchedule) {
            return $this->fail('fail', null, 'Doctor schedule not found', 404);
        }
        return $this->success('success', null, 'Doctor schedule deleted successfully', 200);
    }
}
