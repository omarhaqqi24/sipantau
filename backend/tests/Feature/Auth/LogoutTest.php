<?php

use App\Models\User;

const LOGOUT_URL = '/api/logout';

test('verified user can logout', function () {
    $user = User::factory()->create();
    $token = $user->createToken('api-token')->plainTextToken;

    expect(
        $user->fresh()->tokens()->count()
    )->toBe(1);

    $this->withHeader(
        'Authorization',
        'Bearer '.$token
    )->postJson(LOGOUT_URL)
        ->assertOk()
        ->assertJson([
            'success' => true,
            'message' => 'Logged out successfully',
        ]);

    expect(
        $user->fresh()->tokens()->count()
    )->toBe(0);
});

test('guest cannot logout', function () {
    $this->postJson(LOGOUT_URL)
        ->assertUnauthorized()
        ->assertJson([
            'message' => 'Unauthenticated.',
        ]);
});

test('invalid token cannot logout', function () {
    $this->withHeader(
        'Authorization',
        'Bearer p4sswordc1huyyy123'
    )->postJson(LOGOUT_URL)
        ->assertUnauthorized()
        ->assertJson([
            'message' => 'Unauthenticated.',
        ]);
});
