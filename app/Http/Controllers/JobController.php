<?php

namespace App\Http\Controllers;

use App\Models\Job;
use App\Models\Application;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class JobController extends Controller
{
    // Show all jobs (for company admin view)
    public function index()
    {
        return Job::all();
    }

    // Show single job
    public function show($uuid)
    {
        return Job::where('uuid', $uuid)->firstOrFail();
    }

    // Create job
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required',
            'company_uuid' => 'required|uuid',
            'salary_from' => 'required|numeric',
            'salary_to' => 'required|numeric',
            'status' => 'in:active,inactive',
        ]);

        $validated['uuid'] = Str::uuid();

        $job = Job::create($validated);

        return response()->json([
            'message' => 'Job created successfully',
            'data' => $job
        ], 201);
    }

    // Update job
    public function update(Request $request, $uuid)
    {
        $job = Job::where('uuid', $uuid)->firstOrFail();

        $job->update($request->only([
            'title',
            'description',
            'company_uuid',
            'salary_from',
            'salary_to',
            'status'
        ]));

        return response()->json([
            'message' => 'Job updated successfully',
            'data' => $job
        ]);
    }

    // Delete job
    public function destroy($uuid)
    {
        $job = Job::where('uuid', $uuid)->firstOrFail();
        $job->delete();

        return response()->json([
            'message' => 'Job deleted successfully'
        ]);
    }

    // Active jobs for candidates (includes "applied" status)
    public function activeJobs(Request $request)
    {
        $candidate = $request->user(); // logged-in candidate
        $jobs = Job::where('status', 'active')->get();

        // Add applied status for each job
        $jobs->transform(function ($job) use ($candidate) {
            $job->applied = Application::where('job_uuid', $job->uuid)
                                       ->where('candidate_uuid', $candidate->uuid)
                                       ->exists();
            return $job;
        });

        return response()->json($jobs);
    }
}
