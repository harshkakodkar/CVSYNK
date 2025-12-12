<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\JobController;
use App\Http\Controllers\ApplicationController;

// Test route
Route::get('/test', function () {
    return response()->json(['message' => 'Hello, Laravel API is working!']);
});

// Authentication
Route::post('/register/company', [AuthController::class, 'registerCompany']);
Route::post('/register/candidate', [AuthController::class, 'registerCandidate']);
Route::post('/login', [AuthController::class, 'login']);
Route::middleware('auth:sanctum')->post('/logout', [AuthController::class, 'logout']);

// Routes for Company
Route::middleware(['auth:sanctum', 'role:company'])->group(function () {
    Route::post('/company/jobs', [JobController::class,'store']);
    Route::get('/company/jobs', [JobController::class,'index']);
    Route::get('/company/jobs/{uuid}', [JobController::class,'show']);
    Route::put('/company/jobs/{uuid}', [JobController::class,'update']);
    Route::delete('/company/jobs/{uuid}', [JobController::class,'destroy']);



    // Job applications management
    Route::get('/jobs/{job_uuid}/applications',[ApplicationController::class,'jobApplications']);
    Route::put('/applications/{uuid}/select',[ApplicationController::class,'selectCandidate']);
    Route::put('/applications/{uuid}/reject',[ApplicationController::class,'rejectCandidate']);
    Route::get('/applications/received', [ApplicationController::class, 'receivedApplications']);
});



// Routes for Candidate
Route::middleware(['auth:sanctum', 'role:candidate'])->group(function () {
    Route::post('/jobs/{uuid}/apply',[ApplicationController::class,'apply']);
    Route::get('/my-applications',[ApplicationController::class,'myApplications']);
});

// Routes accessible by any authenticated user
Route::middleware('auth:sanctum')->get('/candidate/jobs',[JobController::class,'activeJobs']);
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
