<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\StoreRegisterRequest;
use App\Http\Resources\Auth\LoginResource;
use App\Http\Resources\Auth\RegisterResource;
use App\Services\Auth\AuthService;
use App\Trait\HttpResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class AuthController extends Controller
{
    use HttpResponse;
    //
    protected $authService;
    function __construct(AuthService $authService)
    {
        $this->authService = $authService;
    }
    public function patientRegister(StoreRegisterRequest $request)
    {
        DB::beginTransaction();
        try {
            $validated = $request->validated();

            // Handle profile picture upload
            if ($request->hasFile('profile_picture')) {
                $file = $request->file('profile_picture');
                $filename = time() . '_' . $file->getClientOriginalName();
                $file->move(public_path('images'), $filename);
                $validated['profile_picture'] = 'images/' . $filename;
            }

            $createdPatient = $this->authService->patientRegister($validated);
            if (!$createdPatient) {
                return $this->fail('fail', null, 'Patient registered fail', 404);
            }

            $createdPatient->assignRole('patient');
            $createdPatient->load('patient_profile');

            DB::commit();

            $token = $createdPatient->createToken('auth_token')->plainTextToken;

            return $this->success('success', [
                'data' => RegisterResource::make($createdPatient),
                'token' => $token,
                'role' => $createdPatient->getRoleNames(),
            ], 'Patient registered successfully', 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->fail('fail', null, $e->getMessage(), 500);
        }
    }

    public function login(LoginRequest $request)
    {
        $validated = $request->validated();
        $user = $this->authService->login($validated);

        if (!$user) {
            return response()->json(['message' => 'Invalid admin credentials'], 401);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        $role = $user->getRoleNames()->first();

        if (!$role) {
            if ($user->patient_profile) {
                $user->assignRole('patient');
                $role = 'patient';
            } elseif ($user->doctor_profile) {
                $user->assignRole('doctor');
                $role = 'doctor';
            } else {
                $user->assignRole('admin');
                $role = 'admin';
            }
        }

        if ($role === 'patient') {
            $user->load('patient_profile');
        } elseif ($role === 'doctor') {
            $user->load('doctor_profile');
        }

        return $this->success('success', [
            'data' => LoginResource::make($user),
            'token' => $token,
            'role' => $role,
        ], ucfirst($role) . ' login successfully', 200);
    }
}
