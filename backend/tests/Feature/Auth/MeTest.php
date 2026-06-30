<?php

use App\Models\User;
use Laravel\Sanctum\Sanctum;

const ME_URL = '/api/me';

test('authenticated user can view profile', function () {
    $user = User::factory()->create();
    Sanctum::actingAs($user);

    $this->getJson(ME_URL)
        ->assertOk()
        ->assertJson([
            'id'=>$user->id,
            'name'=>$user->name,
            'email'=>$user->email
        ])
        ->assertJsonStructure([
            'id',
            'name',
            'email',
            "email_verified_at",
            "created_at",
            "updated_at"
        ]);
});

test('unauthenticated user cannot view profile', function () {
    $this->getJson(ME_URL)
        ->assertUnauthorized()
        ->assertExactJson([
            'message'=>'Unauthenticated.'
        ]);
});
