<?php

namespace App\Http\Controllers\Speciality;

use App\Http\Controllers\Controller;
use App\Http\Requests\Speciality\StoreSpecialityRequest;
use App\Http\Requests\Speciality\UpdateSpecialityRequest;
use App\Http\Resources\Speciality\SpecialityResource;
use App\Services\Speciality\SpecialityService;
use App\Trait\HttpResponse;
use Illuminate\Support\Facades\DB;

class SpecialityController extends Controller
{
    use HttpResponse;

    protected $specialityService;

    public function __construct(SpecialityService $specialityService)
    {
        $this->specialityService = $specialityService;
    }

    public function getAllSpecialities()
    {
        try {
            $specialities = $this->specialityService->getAllSpecialities();
            if (!$specialities) {
                return $this->fail('fail', null, 'No specialities found', 404);
            }

            return $this->success('success', [
                'data' => SpecialityResource::collection($specialities),
            ], 'Specialities retrieved successfully', 200);
        } catch (\Exception $e) {
            return $this->fail('fail', null, 'Internal server error', 500);
        }
    }

    public function getSpecialityById($id)
    {
        $speciality = $this->specialityService->getSpecialityById($id);
        if (!$speciality) {
            return $this->fail('fail', null, 'Speciality not found', 404);
        }

        return $this->success('success', [
            'data' => SpecialityResource::make($speciality),
        ], 'Speciality retrieved successfully', 200);
    }

    public function createSpeciality(StoreSpecialityRequest $request)
    {
        DB::beginTransaction();
        try {
            $validated = $request->validated();
            $createdSpeciality = $this->specialityService->createSpeciality($validated);

            if (!$createdSpeciality) {
                return $this->fail('fail', null, 'Speciality creation failed', 400);
            }

            DB::commit();

            return $this->success('success', [
                'data' => SpecialityResource::make($createdSpeciality),
            ], 'Speciality created successfully', 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->fail('fail', null, $e->getMessage(), 500);
        }
    }

    public function updateSpeciality($id, UpdateSpecialityRequest $request)
    {
        DB::beginTransaction();
        try {
            $validated = $request->validated();

            $updatedSpeciality = $this->specialityService->updateSpeciality($id, $validated);

            if (!$updatedSpeciality) {
                return $this->fail('fail', null, 'Speciality not found', 404);
            }

            DB::commit();

            return $this->success('success', [
                'data' => SpecialityResource::make($updatedSpeciality),
            ], 'Speciality updated successfully', 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->fail('fail', null, 'Unable to update speciality', 500);
        }
    }

    public function deleteSpeciality($id)
    {
        $deletedSpeciality = $this->specialityService->deleteSpeciality($id);

        if (!$deletedSpeciality) {
            return $this->fail('fail', null, 'Speciality not found', 404);
        }

        return $this->success('success', null, 'Speciality deleted successfully', 200);
    }
}
