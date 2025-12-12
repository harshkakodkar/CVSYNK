<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    // Company registration
    public function registerCompany(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:6',
            'address' => 'required|string|max:255',
        ], [
            'email.unique' => 'This email is already registered.',
            'password.min' => 'Password must be at least 6 characters long.',
        ]);

        $data['password'] = bcrypt($data['password']);
        $data['role'] = 'company';

        $user = User::create($data);

        return response()->json($user, 201);
    }

    // Candidate registration
    public function registerCandidate(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:6',
            'skills' => 'required|string',
        ], [
            'email.unique' => 'This email is already registered.',
            'password.min' => 'Password must be at least 6 characters long.',
        ]);

        $data['password'] = bcrypt($data['password']);
        $data['role'] = 'candidate';

        $user = User::create($data);

        return response()->json($user, 201);
    }

    // Login
    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');

        if (!auth()->attempt($credentials)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        $token = $request->user()->createToken('token')->plainTextToken;

        return response()->json([
            'token' => $token,
            'user' => $request->user()
        ]);
    }

    // Logout
    public function logout(Request $request)
    {
        $request->user()->tokens()->delete();

        return response()->json(['message' => 'Logged out successfully']);
    }
}
