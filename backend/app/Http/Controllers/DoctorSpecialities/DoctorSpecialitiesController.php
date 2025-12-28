<?php

namespace App\Http\Controllers\DoctorSpecialities;

use App\Http\Controllers\Controller;
use App\Http\Requests\DoctorSpecialities\StoreDoctorSpecialitiesRequest;
use App\Http\Requests\DoctorSpecialities\UpdateDoctorSpecialitiesRequest;
use App\Http\Resources\DoctorSpecialities\DoctorSpecialitiesResource;
use App\Services\DoctorSpecialities\DoctorSpecialitiesService;
use App\Trait\HttpResponse;
use Illuminate\Support\Facades\DB;

class DoctorSpecialitiesController extends Controller
{
    use HttpResponse;

    protected $doctorSpecialitiesService;

    public function __construct(DoctorSpecialitiesService $doctorSpecialitiesService)
    {
        $this->doctorSpecialitiesService = $doctorSpecialitiesService;
    }

    public function getAllDoctorSpecialities()
    {
        try {
            $doctorSpecialities = $this->doctorSpecialitiesService->getAllDoctorSpecialities();
            if (!$doctorSpecialities) {
                return $this->fail('fail', null, 'No doctor-speciality associations found', 404);
            }

            return $this->success('success', [
                'data' => DoctorSpecialitiesResource::collection($doctorSpecialities),
            ], 'Doctor-speciality associations retrieved successfully', 200);
        } catch (\Exception $e) {
            return $this->fail('fail', null, 'Internal server error', 500);
        }
    }

    public function getDoctorSpecialityById($id)
    {
        $doctorSpeciality = $this->doctorSpecialitiesService->getDoctorSpecialityById($id);
        if (!$doctorSpeciality) {
            return $this->fail('fail', null, 'Doctor-speciality association not found', 404);
        }

        return $this->success('success', [
            'data' => DoctorSpecialitiesResource::make($doctorSpeciality),
        ], 'Doctor-speciality association retrieved successfully', 200);
    }

    public function createDoctorSpeciality(StoreDoctorSpecialitiesRequest $request)
    {
        DB::beginTransaction();
        try {
            $validated = $request->validated();
            $createdDoctorSpeciality = $this->doctorSpecialitiesService->createDoctorSpeciality($validated);

            if (!$createdDoctorSpeciality) {
                return $this->fail('fail', null, 'Doctor-speciality association creation failed', 400);
            }

            DB::commit();

            return $this->success('success', [
                'data' => DoctorSpecialitiesResource::make($createdDoctorSpeciality),
            ], 'Doctor-speciality association created successfully', 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->fail('fail', null, $e->getMessage(), 500);
        }
    }

    public function updateDoctorSpeciality($id, UpdateDoctorSpecialitiesRequest $request)
    {
        DB::beginTransaction();
        try {
            $validated = $request->validated();

            $updatedDoctorSpeciality = $this->doctorSpecialitiesService->updateDoctorSpeciality($id, $validated);

            if (!$updatedDoctorSpeciality) {
                return $this->fail('fail', null, 'Doctor-speciality association not found', 404);
            }

            DB::commit();

            return $this->success('success', [
                'data' => DoctorSpecialitiesResource::make($updatedDoctorSpeciality),
            ], 'Doctor-speciality association updated successfully', 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->fail('fail', null, 'Unable to update doctor-speciality association', 500);
        }
    }

    public function deleteDoctorSpeciality($id)
    {
        $deletedDoctorSpeciality = $this->doctorSpecialitiesService->deleteDoctorSpeciality($id);

        if (!$deletedDoctorSpeciality) {
            return $this->fail('fail', null, 'Doctor-speciality association not found', 404);
        }

        return $this->success('success', null, 'Doctor-speciality association deleted successfully', 200);
    }

    public function getSpecialitiesByDoctor($doctorId)
    {
        try {
            $specialities = $this->doctorSpecialitiesService->getSpecialitiesByDoctor($doctorId);
            if (!$specialities) {
                return $this->fail('fail', null, 'No specialities found for this doctor', 404);
            }

            return $this->success('success', [
                'data' => DoctorSpecialitiesResource::collection($specialities),
            ], 'Specialities retrieved successfully', 200);
        } catch (\Exception $e) {
            return $this->fail('fail', null, 'Internal server error', 500);
        }
    }

    public function getDoctorsBySpeciality($specialityId)
    {
        try {
            $doctors = $this->doctorSpecialitiesService->getDoctorsBySpeciality($specialityId);
            if (!$doctors) {
                return $this->fail('fail', null, 'No doctors found for this speciality', 404);
            }

            return $this->success('success', [
                'data' => DoctorSpecialitiesResource::collection($doctors),
            ], 'Doctors retrieved successfully', 200);
        } catch (\Exception $e) {
            return $this->fail('fail', null, 'Internal server error', 500);
        }
    }
}
