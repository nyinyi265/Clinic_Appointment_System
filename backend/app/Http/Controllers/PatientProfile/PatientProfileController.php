<?php

namespace App\Http\Controllers\PatientProfile;

use App\Http\Controllers\Controller;
use App\Http\Requests\Patient\UpdatePatientProfileRequest;
use App\Http\Resources\Auth\RegisterResource;
use App\Http\Resources\Patient\PatientProfileResource;
use App\Services\PatientProfile\PatientProfileService;
use App\Trait\HttpResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PatientProfileController extends Controller
{
    use HttpResponse;
    //
    protected $patientProfileService;
    public function __construct(PatientProfileService $patientProfileService)
    {
        $this->patientProfileService = $patientProfileService;
    }
    public function getAllPatients()
    {
        $patients = $this->patientProfileService->getAllPatients();

        if ($patients->isEmpty()) {
            return $this->fail('fail', null, 'No patients found', 404);
        }

        return $this->success('success', [
            'data' => RegisterResource::collection($patients),
        ], 'Patients retrieved successfully', 200);
    }

    public function getPatientById($id){
        $patient = $this->patientProfileService->getPatientById($id);

        if(!$patient){
            return $this->fail('fail', null, 'Patient not found', 404);
        }

        return $this->success('success',[
            'data' => RegisterResource::make($patient),
        ], 'Patient retrieved successfully', 200);
    }

    public function deletePatient($id){
        $deletedPatient = $this->patientProfileService->deletePatient($id);
        if(!$deletedPatient){
            return $this->fail('fail', null, 'Fail to delete patient', 404);
        }
        return $this->success('success', null, 'Patient deleted successfully', 200);
    }

    public function updatePatient($id, UpdatePatientProfileRequest $request){
        DB::beginTransaction();
        try {
            $validated = $request->validated();
            $updatedPatient = $this->patientProfileService->updatePatient($id, $validated);
            if(!$updatedPatient){
                return $this->fail('fail', null, 'Fail to update patient', 404);
            }

            DB::commit();

            return $this->success('success', [
                'data' => PatientProfileResource::make($updatedPatient),
            ], 'Patient updated successfully', 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->fail('fail', null, $e->getMessage(), 500);
        }
    }
}
