<?php

use App\Models\User;

const LOGIN_URL = '/api/login';

test('user can login with valid credentials', function () {
    $user = User::factory()->create();

    $this->postJson(LOGIN_URL, [
        'email' => $user->email,
        'password' => 'password',
    ])
        ->assertOk()
        ->assertJson([
            'success' => true,
            'message' => 'Login successful',
        ])
        ->assertJsonStructure([
            'success',
            'message',
            'data' => [
                'token',
            ],
        ]);
});

test('login fails with wrong email', function () {

    $this->postJson(LOGIN_URL, [
        'email' => 'test@test.sipantau',
        'password' => 'password',
    ])
        ->assertUnprocessable()
        ->assertJsonValidationErrors([
            'email',
        ])
        ->assertJson([
            'message' => 'The provided credentials are incorrect.',
        ]);
});

test('login fails with wrong password', function () {
    $user = User::factory()->create();

    $this->postJson(LOGIN_URL, [
        'email' => $user->email,
        'password' => 'apakek',
    ])
        ->assertUnprocessable()
        ->assertJsonValidationErrors([
            'email',
        ])
        ->assertJson([
            'message' => 'The provided credentials are incorrect.',
        ]);
});

test('login fails with invalid email', function () {

    $this->postJson(LOGIN_URL, [
        'email' => 'testemail',
        'password' => 'password',
    ])
        ->assertUnprocessable()
        ->assertJsonValidationErrors([
            'email',
        ])
        ->assertJson([
            'message' => 'The email field must be a valid email address.',
        ]);
});

test('login fails with empty email', function () {
    $this->postJson(LOGIN_URL, [
        'email' => '',
        'password' => 'password',
    ])
        ->assertUnprocessable()
        ->assertJsonValidationErrors([
            'email',
        ])
        ->assertJson([
            'message' => 'The email field is required.',
        ]);
});

test('login fails with empty password', function () {
    $user = User::factory()->create();

    $this->postJson(LOGIN_URL, [
        'email' => $user->email,
        'password' => '',
    ])
        ->assertUnprocessable()
        ->assertJsonValidationErrors([
            'password',
        ])
        ->assertJson([
            'message' => 'The password field is required.',
        ]);
});
