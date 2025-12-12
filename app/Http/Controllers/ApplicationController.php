<?php

namespace App\Http\Controllers;

use App\Models\Application;
use App\Models\Job;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ApplicationController extends Controller
{

    public function index()
    {
        return Application::with(['job', 'candidate'])->get();
    }


    public function show($uuid)
    {
        return Application::with(['job', 'candidate'])
            ->where('uuid', $uuid)
            ->firstOrFail();
    }

   
    public function store(Request $request)
    {
        $validated = $request->validate([
            'job_uuid' => 'required|uuid',
            'candidate_uuid' => 'required|uuid',
            'status' => 'in:applied,selected,rejected',
        ]);

        $validated['uuid'] = Str::uuid();

        $application = Application::create($validated);

        return response()->json([
            'message' => 'Application submitted successfully',
            'data' => $application
        ], 201);
    }

    // Update application status
    public function update(Request $request, $uuid)
    {
        $application = Application::where('uuid', $uuid)->firstOrFail();

        $request->validate([
            'status' => 'required|in:applied,selected,rejected'
        ]);

        $application->update([
            'status' => $request->status,
        ]);

        return response()->json([
            'message' => 'Application updated successfully',
            'data' => $application
        ]);
    }

    // Delete application
    public function destroy($uuid)
    {
        $application = Application::where('uuid', $uuid)->firstOrFail();
        $application->delete();

        return response()->json([
            'message' => 'Application deleted successfully'
        ]);
    }

    // Candidate applies for a job
    public function apply(Request $request, $uuid)
    {
        $job = Job::where('uuid', $uuid)->firstOrFail();
        $candidate = $request->user();

        // Prevent duplicate application
        $existing = Application::where('job_uuid', $job->uuid)
            ->where('candidate_uuid', $candidate->uuid)
            ->first();

        if ($existing) {
            return response()->json(['message' => 'You have already applied for this job.'], 400);
        }

        $application = Application::create([
            'uuid' => Str::uuid(),
            'job_uuid' => $job->uuid,
            'candidate_uuid' => $candidate->uuid,
            'status' => 'applied',
        ]);

        return response()->json([
            'message' => 'Applied successfully!',
            'data' => $application
        ], 201);
    }


    public function myApplications(Request $request)
    {
        $candidate = $request->user();

        $applications = Application::with('job')
            ->where('candidate_uuid', $candidate->uuid)
            ->get();

        return response()->json($applications);
    }


    public function jobApplications($job_uuid)
    {
        $applications = Application::with([
            'job:id,uuid,title',
            'candidate:id,uuid,name,email'
        ])
        ->where('job_uuid', $job_uuid)
        ->get();

        return response()->json($applications);
    }

    public function receivedApplications(Request $request)
{
    $company = $request->user(); // Logged-in company

    $applications = Application::with(['job', 'candidate'])
        ->whereIn('job_uuid', Job::where('company_uuid', $company->uuid)->pluck('uuid'))
        ->get();

    return response()->json($applications);
}


    // Select a candidate
    public function selectCandidate($uuid)
    {
        $application = Application::where('uuid', $uuid)->firstOrFail();
        $application->update(['status' => 'selected']);

        return response()->json([
            'message' => 'Candidate selected successfully',
            'data' => $application
        ]);
    }

    // Reject a candidate
    public function rejectCandidate($uuid)
    {
        $application = Application::where('uuid', $uuid)->firstOrFail();
        $application->update(['status' => 'rejected']);

        return response()->json([
            'message' => 'Candidate rejected successfully',
            'data' => $application
        ]);
    }
}
