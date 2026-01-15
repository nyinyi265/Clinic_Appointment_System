<?php

use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Route;

Route::prefix('auth')->group(function () {
    Route::prefix('patient')->group(function () {
        Route::post('/register', [\App\Http\Controllers\Api\AuthController::class, 'patientRegister']);
        // Route::post('/login', [\App\Http\Controllers\Api\AuthController::class, 'patientLogin']);
    });

    Route::prefix('doctor')->group(function () {
        Route::post('/register', [\App\Http\Controllers\DoctorProfile\DoctorProfileController::class, 'registerDoctor']);
        // Route::post('/login', [\App\Http\Controllers\DoctorProfile\DoctorProfileController::class, 'loginDoctor']);
    });

    Route::post('/login', [\App\Http\Controllers\Api\AuthController::class, 'login']);

    // Route::get('/login', function () {
    //     return response()->json([
    //         'status' => 'fail',
    //         'statusCode' => 401,
    //         'data' => null,
    //         'message' => 'Unauthenticated. Please login first.',
    //     ], 401);
    // })->name('login');
});

Route::post('/message', [\App\Http\Controllers\Message\MessageController::class, 'store']);

Route::prefix('v1')->group(function () {
    Route::middleware(['auth:sanctum', 'role:patient|doctor|admin,sanctum'])->group(function () {
        Route::get('/all-clinics', [\App\Http\Controllers\Clinic\ClinicController::class, 'getAllClinics']);
        Route::get('/all-specialities', [\App\Http\Controllers\Speciality\SpecialityController::class, 'getAllSpecialities']);
        Route::get('/clinic/{clinic_id}', [\App\Http\Controllers\Clinic\ClinicController::class, 'getClinicById']);
        Route::get('/clinic/{clinic_id}/doctors', [\App\Http\Controllers\DoctorClinic\DoctorClinicController::class, 'getDoctorsByClinic']);

        Route::get('/doctor-schedule/{id}', [\App\Http\Controllers\DoctorSchedule\DoctorScheduleController::class, 'getDoctorScheduleById']);
    });

    Route::middleware(['auth:sanctum', 'role:patient|admin,sanctum'])->group(function () {
        Route::get('/all-doctors', [\App\Http\Controllers\DoctorProfile\DoctorProfileController::class, 'getAllDoctors']);
        Route::get('/doctor/{doctor_id}', [\App\Http\Controllers\DoctorProfile\DoctorProfileController::class, 'getDoctorById']);
        Route::post('/appointment', [\App\Http\Controllers\Appointment\AppointmentController::class, 'createAppointment']);
    });

    Route::middleware(['auth:sanctum', 'role:doctor|admin,sanctum'])->group(function () {
        Route::put('/doctor/{doctor_id}', [\App\Http\Controllers\DoctorProfile\DoctorProfileController::class, 'updateDoctor']);

        Route::get('/all-doctor-schedules', [\App\Http\Controllers\DoctorSchedule\DoctorScheduleController::class, 'getAllDoctorSchedules']);
        Route::put('/doctor-clinic/{id}', [\App\Http\Controllers\DoctorClinic\DoctorClinicController::class, 'updateDoctorClinic']);
    });

    Route::middleware(['auth:sanctum', 'role:doctor|patient,sanctum'])->group(function () {
        Route::get('/doctor/{doctor_id}/clinics', action: [\App\Http\Controllers\DoctorClinic\DoctorClinicController::class, 'getClinicsByDoctor']);
        Route::get('/doctor/{doctor_id}/schedules', [\App\Http\Controllers\DoctorSchedule\DoctorScheduleController::class, 'getSchedulesByDoctor']);
    });

    Route::middleware(['auth:sanctum', 'role:patient,sanctum'])->group(function () {
        Route::get('/patient/{patient_id}', [\App\Http\Controllers\PatientProfile\PatientProfileController::class, 'getPatientById']);
        Route::put('/patient/{patient_id}', [\App\Http\Controllers\PatientProfile\PatientProfileController::class, 'updatePatient']);

        // Route::get('/appointment/{id}', [\App\Http\Controllers\Appointment\AppointmentController::class, 'getAppointmentById']);
        Route::get('/patient/{patient_id}/appointments', [\App\Http\Controllers\Appointment\AppointmentController::class, 'getAppointmentsByPatient']);
        // Route::put('/appointment/{id}', [\App\Http\Controllers\Appointment\AppointmentController::class, 'updateAppointment']);
        Route::put('/patient/appointment/{id}/status', [\App\Http\Controllers\Appointment\AppointmentController::class, 'updateAppointmentStatusForPatient']);



        Route::get('/all-doctor-clinics', [\App\Http\Controllers\DoctorClinic\DoctorClinicController::class, 'getAllDoctorClinics']);
        Route::get('/pending-clinic-requests', [\App\Http\Controllers\DoctorClinic\DoctorClinicController::class, 'getPendingClinicRequests']);
        Route::get('/doctor-clinic/{id}', [\App\Http\Controllers\DoctorClinic\DoctorClinicController::class, 'getDoctorClinicById']);

    });

    Route::middleware(['auth:sanctum', 'role:doctor,sanctum'])->group(function () {
        Route::put('/doctor/appointment/{id}/status', [\App\Http\Controllers\Appointment\AppointmentController::class, 'updateAppointmentStatusForDoctor']);
        // Route::get('/appointment/{id}', [\App\Http\Controllers\Appointment\AppointmentController::class, 'getAppointmentById']);
        Route::get('/doctor/{doctor_id}/appointments', [\App\Http\Controllers\Appointment\AppointmentController::class, 'getAppointmentsByDoctor']);
        Route::get('/doctor/{doctor_id}/patients', [\App\Http\Controllers\DoctorProfile\DoctorProfileController::class, 'getPatientsByDoctor']);
        Route::get('/doctor/{doctor_id}/all-clinics', [\App\Http\Controllers\Clinic\ClinicController::class, 'getAllClinicsForDoctor']);

        Route::post('/speciality', [\App\Http\Controllers\Speciality\SpecialityController::class, 'createSpeciality']);

        Route::get('/doctor-speciality/{id}', [\App\Http\Controllers\DoctorSpecialities\DoctorSpecialitiesController::class, 'getDoctorSpecialityById']);
        Route::post('/doctor-speciality', [\App\Http\Controllers\DoctorSpecialities\DoctorSpecialitiesController::class, 'createDoctorSpeciality']);
        Route::put('/doctor-speciality/{id}', [\App\Http\Controllers\DoctorSpecialities\DoctorSpecialitiesController::class, 'updateDoctorSpeciality']);
        Route::get('/doctor/{doctor_id}/specialities', [\App\Http\Controllers\DoctorSpecialities\DoctorSpecialitiesController::class, 'getSpecialitiesByDoctor']);

        Route::post('/doctor-schedule', [\App\Http\Controllers\DoctorSchedule\DoctorScheduleController::class, 'createDoctorSchedule']);
        Route::put('/doctor-schedule/{id}', [\App\Http\Controllers\DoctorSchedule\DoctorScheduleController::class, 'updateDoctorSchedule']);
        Route::delete('/doctor-schedule/{id}', [\App\Http\Controllers\DoctorSchedule\DoctorScheduleController::class, 'deleteDoctorSchedule']);
    });


    Route::middleware(['auth:sanctum', 'role:admin'])->group(function () {
        Route::get('/all-patients', [\App\Http\Controllers\PatientProfile\PatientProfileController::class, 'getAllPatients']);
        Route::get('/patient/{patient_id}', [\App\Http\Controllers\PatientProfile\PatientProfileController::class, 'getPatientById']);
        Route::delete('/patient/{patient_id}', [\App\Http\Controllers\PatientProfile\PatientProfileController::class, 'deletePatient']);

        Route::post('/clinic', [\App\Http\Controllers\Clinic\ClinicController::class, 'createClinic']);
        Route::put('/clinic/{clinic_id}', [\App\Http\Controllers\Clinic\ClinicController::class, 'updateClinic']);
        Route::delete('/clinic/{clinic_id}', [\App\Http\Controllers\Clinic\ClinicController::class, 'deleteClinic']);

        Route::post('/doctor-clinic', [\App\Http\Controllers\DoctorClinic\DoctorClinicController::class, 'createDoctorClinic']);
        Route::post('/doctor', [\App\Http\Controllers\DoctorProfile\DoctorProfileController::class, 'registerDoctor']);
        Route::delete('/doctor/{doctor_id}', [\App\Http\Controllers\DoctorProfile\DoctorProfileController::class, 'deleteDoctor']);
        Route::delete('/doctor-clinic/{id}', [\App\Http\Controllers\DoctorClinic\DoctorClinicController::class, 'deleteDoctorClinic']);

        Route::get('/speciality/{id}', [\App\Http\Controllers\Speciality\SpecialityController::class, 'getSpecialityById']);
        Route::post('/speciality', [\App\Http\Controllers\Speciality\SpecialityController::class, 'createSpeciality']);
        Route::put('/speciality/{id}', [\App\Http\Controllers\Speciality\SpecialityController::class, 'updateSpeciality']);
        Route::delete('/speciality/{id}', [\App\Http\Controllers\Speciality\SpecialityController::class, 'deleteSpeciality']);

        Route::get('/all-doctor-specialities', [\App\Http\Controllers\DoctorSpecialities\DoctorSpecialitiesController::class, 'getAllDoctorSpecialities']);
        Route::get('/doctor-speciality/{id}', [\App\Http\Controllers\DoctorSpecialities\DoctorSpecialitiesController::class, 'getDoctorSpecialityById']);
        Route::post('/doctor-speciality', [\App\Http\Controllers\DoctorSpecialities\DoctorSpecialitiesController::class, 'createDoctorSpeciality']);
        Route::put('/doctor-speciality/{id}', [\App\Http\Controllers\DoctorSpecialities\DoctorSpecialitiesController::class, 'updateDoctorSpeciality']);
        Route::delete('/doctor-speciality/{id}', [\App\Http\Controllers\DoctorSpecialities\DoctorSpecialitiesController::class, 'deleteDoctorSpeciality']);
        Route::get('/doctor/{doctor_id}/specialities', [\App\Http\Controllers\DoctorSpecialities\DoctorSpecialitiesController::class, 'getSpecialitiesByDoctor']);
        Route::get('/speciality/{speciality_id}/doctors', [\App\Http\Controllers\DoctorSpecialities\DoctorSpecialitiesController::class, 'getDoctorsBySpeciality']);

        Route::get('/all-appointments', [\App\Http\Controllers\Appointment\AppointmentController::class, 'getAllAppointments']);
        Route::get('/appointment/{id}', [\App\Http\Controllers\Appointment\AppointmentController::class, 'getAppointmentById']);
        Route::put('/appointment/{id}', [\App\Http\Controllers\Appointment\AppointmentController::class, 'updateAppointment']);
        Route::delete('/appointment/{id}', [\App\Http\Controllers\Appointment\AppointmentController::class, 'deleteAppointment']);
        Route::get('/clinic/{clinic_id}/appointments', [\App\Http\Controllers\Appointment\AppointmentController::class, 'getAppointmentsByClinic']);
        Route::get('/appointments/date/{date}', [\App\Http\Controllers\Appointment\AppointmentController::class, 'getAppointmentsByDate']);
        Route::get('/appointments/status/{status}', [\App\Http\Controllers\Appointment\AppointmentController::class, 'getAppointmentsByStatus']);

        Route::get('/messages', [\App\Http\Controllers\Message\MessageController::class, 'index']);
        Route::delete('/message/{id}', [\App\Http\Controllers\Message\MessageController::class, 'delete']);

        Route::post('/assign-doctor', [\App\Http\Controllers\DoctorClinic\DoctorClinicController::class, 'assignDoctor']);
        Route::get('/doctor-clinic-assignments', [\App\Http\Controllers\DoctorClinic\DoctorClinicController::class, 'getAssignments']);
    });
});
