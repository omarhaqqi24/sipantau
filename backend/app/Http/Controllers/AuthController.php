<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Services\ActivityLogger;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    use ApiResponse;

    public function __construct(
        private ActivityLogger $activityLogger
    ) {}

    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'role' => 'nullable|string|exists:roles,name',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
        ]);

        $user->assignRole($validated['role'] ?? 'user');

        $this->activityLogger->log(
            $user->id,
            'register'
        );

        return $this->success([
            'token' => $user->createToken('api-token')->plainTextToken,
        ], 'User registered successfully', 201);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        $this->activityLogger->log(
            $user->id,
            'login'
        );

        return $this->success([
            'token' => $user->createToken('api-token')->plainTextToken,
        ], 'Login successful');
    }

    public function logout(Request $request)
    {
        $userId = $request->user()->id;

        $this->activityLogger->log(
            $userId,
            'logout'
        );

        $request->user()->tokens()->delete();

        return $this->success(null, 'Logged out successfully');
    }
}
