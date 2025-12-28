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
            $createdPatient = $this->authService->patientRegister($validated);
            if (!$createdPatient) {
                return $this->fail('fail', null, 'Patient registered fail', 404);
            }

            $createdPatient->assignRole('patient');

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

    public function patientLogin(LoginRequest $request)
    {
        $credentials = $request->only(['email', 'password']);

        if (!Auth::attempt($credentials)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        $credentials = $request->validated();
        $loginPatient = $this->authService->patientLogin($credentials);

        if (!$loginPatient) {
            return $this->fail('fail', null, 'Patient login fail', 404);
        }

        $token = $loginPatient->createToken('auth_token')->plainTextToken;
        return $this->success('success', [
            'data' => RegisterResource::make($loginPatient),
            'token' => $token,
            'role' => $loginPatient->getRoleNames(),
        ], 'Patient login successfully', 200);
    }

    public function adminLogin(LoginRequest $request)
    {
        $admin = $this->authService->adminLogin($request->validated());

        if (!$admin) {
            return response()->json(['message' => 'Invalid admin credentials'], 401);
        }

        // Optional: revoke old tokens
        $admin->tokens()->delete();

        $token = $admin->createToken('admin_token')->plainTextToken;

        return $this->success('success', [
            'data' => LoginResource::make($admin),
            'token' => $token,
            'role' => $admin->role,
        ], 'Admin login successfully', 200);
    }
}
