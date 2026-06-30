<?php

namespace Tests;

use Database\Seeders\RolePermissionSeeder;
use Database\Seeders\PredictPermissionSeeder;
use Illuminate\Foundation\Testing\TestCase as BaseTestCase;

abstract class TestCase extends BaseTestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolePermissionSeeder::class);
        $this->seed(PredictPermissionSeeder::class);
    }
}
