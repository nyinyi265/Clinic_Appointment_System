<?php

namespace App\Http\Controllers\DoctorProfile;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\DoctorProfile\StoreDoctorProfileRequest;
use App\Http\Requests\DoctorProfile\UpdateDoctorProfileRequest;
use App\Http\Resources\DoctorProfile\DoctorProfileResource;
use App\Services\DoctorProfile\DoctorProfileService;
use App\Trait\HttpResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class DoctorProfileController extends Controller
{
    use HttpResponse;
    //
    protected $doctorProfileService;
    public function __construct(DoctorProfileService $doctorProfileService)
    {
        $this->doctorProfileService = $doctorProfileService;
    }
    public function getAllDoctors()
    {
        try {
            $doctors = $this->doctorProfileService->getAllDoctors();
            if (!$doctors) {
                return $this->fail('fail', null, 'No doctors found', 404);
            }

            return $this->success('success', [
                'data' => DoctorProfileResource::collection($doctors),
            ], 'Doctors retrieved successfully', 200);
        } catch (\Exception $e) {
            return $this->fail('fail', 'null', $e->getMessage(), 500);
        }
    }

    public function getDoctorById($id)
    {
        $doctor = $this->doctorProfileService->getDoctorById($id);
        if (!$doctor) {
            return $this->fail('fail', null, 'Doctor not found', 404);
        }

        return $this->success('success', [
            'data' => DoctorProfileResource::make($doctor),
            'role' => $doctor->getRoleNames(),
        ], 'Doctor retrieved successfully', 200);
    }

    public function registerDoctor(StoreDoctorProfileRequest $request)
    {
        DB::beginTransaction();
        try {
            $validated = $request->validated();
            $createdDoctor = $this->doctorProfileService->registerDoctor($validated);

            if (!$createdDoctor) {
                return $this->fail('fail', null, 'Doctor registration failed', 404);
            }

            DB::commit();

            $token = $createdDoctor->createToken('auth_token')->plainTextToken;

            return $this->success('success', [
                'data' => DoctorProfileResource::make($createdDoctor),
                'token' => $token,
                'role' => $createdDoctor->getRoleNames(),
            ], 'Doctor registered successfully', 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->fail('fail', null, $e->getMessage(), 500);
        }
    }

    // public function loginDoctor(LoginRequest $request)
    // {
    //     $credentials = $request->only(['email', 'password']);

    //     if (!Auth::attempt($credentials)) {
    //         return response()->json(['message' => 'Invalid Credentials'], 401);
    //     }

    //     $credentials = $request->validated();
    //     $doctor = $this->doctorProfileService->doctorLogin($credentials);

    //     if (!$doctor) {
    //         return $this->fail('fail', null, 'Doctor login failed', 404);
    //     }

    //     $token = $doctor->createToken('auth_token')->plainTextToken;
    //     return $this->success('success', [
    //         'data' => DoctorProfileResource::make($doctor),
    //         'token' => $token,
    //         'role' => $doctor->getRoleNames(),
    //     ], 'Doctor login successfully', 200);
    // }

    public function deleteDoctor($id)
    {
        $deletedDoctor = $this->doctorProfileService->deleteDoctor($id);

        if (!$deletedDoctor) {
            return $this->fail('fail', null, 'Failed to delete doctor', 404);
        }

        return $this->success('success', null, [
            'message' => 'Doctor deleted successfully',
        ], 200);
    }

    public function updateDoctor($id, UpdateDoctorProfileRequest $request)
    {
        DB::beginTransaction();
        try {
            $validated = $request->validated();

            if ($request->hasFile('profile_picture')) {
                $file = $request->file('profile_picture');
                $filename = time() . '_' . $file->getClientOriginalName();
                $file->move(public_path('images'), $filename);
                $validated['profile_picture'] = 'images/' . $filename;
            }

            $updatedDoctor = $this->doctorProfileService->updateDoctor($id, $validated);

            if (!$updatedDoctor) {
                return $this->fail('fail', null, 'Failed to update doctor profile', 404);
            }

            DB::commit();

            return $this->success('success', [
                'data' => DoctorProfileResource::make($updatedDoctor),
            ], 'Doctor profile updated successfully', 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->fail('fail', null, 'Unable to update doctor profile', 500);
        }
    }
}
