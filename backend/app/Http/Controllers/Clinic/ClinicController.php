<?php

namespace App\Http\Controllers\Clinic;

use App\Http\Controllers\Controller;
use App\Http\Requests\Clinic\StoreClinicRequest;
use App\Http\Requests\Clinic\UpdateClinicRequest;
use App\Http\Resources\Clinic\ClinicResource;
use App\Services\Clinic\ClinicService;
use App\Trait\HttpResponse;
use Illuminate\Support\Facades\DB;

class ClinicController extends Controller
{
    use HttpResponse;

    protected $clinicService;

    public function __construct(ClinicService $clinicService)
    {
        $this->clinicService = $clinicService;
    }

    public function getAllClinics()
    {
        try {
            $clinics = $this->clinicService->getAllClinics();
            if (!$clinics) {
                return $this->fail('fail', null, 'No clinics found', 404);
            }

            return $this->success('success', [
                'data' => ClinicResource::collection($clinics),
            ], 'Clinics retrieved successfully', 200);
        } catch (\Exception $e) {
            return $this->fail('fail', null, 'Internal server error', 500);
        }
    }

    public function getClinicById($id)
    {
        $clinic = $this->clinicService->getClinicById($id);
        if (!$clinic) {
            return $this->fail('fail', null, 'Clinic not found', 404);
        }

        return $this->success('success', [
            'data' => ClinicResource::make($clinic),
        ], 'Clinic retrieved successfully', 200);
    }

    public function createClinic(StoreClinicRequest $request)
    {
        DB::beginTransaction();
        try {
            $validated = $request->validated();
            $createdClinic = $this->clinicService->createClinic($validated);

            if (!$createdClinic) {
                return $this->fail('fail', null, 'Clinic creation failed', 400);
            }

            DB::commit();

            return $this->success('success', [
                'data' => ClinicResource::make($createdClinic),
            ], 'Clinic created successfully', 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->fail('fail', null, $e->getMessage(), 500);
        }
    }

    public function updateClinic($id, UpdateClinicRequest $request)
    {
        DB::beginTransaction();
        try {
            $validated = $request->validated();

            $updatedClinic = $this->clinicService->updateClinic($id, $validated);

            if (!$updatedClinic) {
                return $this->fail('fail', null, 'Clinic not found', 404);
            }

            DB::commit();

            return $this->success('success', [
                'data' => ClinicResource::make($updatedClinic),
            ], 'Clinic updated successfully', 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->fail('fail', null, 'Unable to update clinic', 500);
        }
    }

    public function deleteClinic($id)
    {
        $deletedClinic = $this->clinicService->deleteClinic($id);

        if (!$deletedClinic) {
            return $this->fail('fail', null, 'Clinic not found', 404);
        }

        return $this->success('success', null, 'Clinic deleted successfully', 200);
    }
}
