<?php

use App\Models\User;
use Laravel\Sanctum\Sanctum;

const REGISTER_URL = '/api/register';

test('admin can register user', function () {
    $user = User::factory()->create();
    $user->assignRole('admin');
    Sanctum::actingAs($user);

    $this->postJson(REGISTER_URL, [
        'name' => 'usertes',
        'email' => 'email@tes.com',
        'password' => 'password',
    ])
        ->assertCreated()
        ->assertJson([
            'success' => true,
            'message' => 'User registered successfully',
        ])
        ->assertJsonStructure([
            'success',
            'message',
            'data' => [
                'token',
            ],
        ]);
});

test('tpid role user cannot register user', function () {
    $user = User::factory()->create();
    $user->assignRole('tpid');
    Sanctum::actingAs($user);

    $this->postJson(REGISTER_URL, [
        'name' => 'usertes1',
        'email' => 'email1@tes.com',
        'password' => 'password',
    ])
        ->assertForbidden()
        ->assertJson([
            'message' => 'User does not have the right roles.',
        ]);
});

test('dinas_pertanian role user cannot register user', function () {
    $user = User::factory()->create();
    $user->assignRole('dinas_pertanian');
    Sanctum::actingAs($user);

    $this->postJson(REGISTER_URL, [
        'name' => 'usertes1',
        'email' => 'email1@tes.com',
        'password' => 'password',
    ])
        ->assertForbidden()
        ->assertJson([
            'message' => 'User does not have the right roles.',
        ]);
});

test('dinas_perdagangan role user cannot register user', function () {
    $user = User::factory()->create();
    $user->assignRole('dinas_perdagangan');
    Sanctum::actingAs($user);

    $this->postJson(REGISTER_URL, [
        'name' => 'usertes1',
        'email' => 'email1@tes.com',
        'password' => 'password',
    ])
        ->assertForbidden()
        ->assertJson([
            'message' => 'User does not have the right roles.',
        ]);
});

test('dinas_ketahanan_pangan role user cannot register user', function () {
    $user = User::factory()->create();
    $user->assignRole('dinas_ketahanan_pangan');
    Sanctum::actingAs($user);

    $this->postJson(REGISTER_URL, [
        'name' => 'usertes1',
        'email' => 'email1@tes.com',
        'password' => 'password',
    ])
        ->assertForbidden()
        ->assertJson([
            'message' => 'User does not have the right roles.',
        ]);
});

test('unsigned role user cannot register user', function () {
    $user = User::factory()->create();
    Sanctum::actingAs($user);

    $this->postJson(REGISTER_URL, [
        'name' => 'usertes1',
        'email' => 'email1@tes.com',
        'password' => 'password',
    ])
        ->assertForbidden()
        ->assertJson([
            'message' => 'User does not have the right roles.',
        ]);
});

test('unaunthicated user cannot register user', function () {
    $this->postJson(REGISTER_URL, [
        'name' => 'usertes2',
        'email' => 'email2@tes.com',
        'password' => 'password',
    ])
        ->assertUnauthorized()
        ->assertJson([
            'message' => 'Unauthenticated.',
        ]);
});
