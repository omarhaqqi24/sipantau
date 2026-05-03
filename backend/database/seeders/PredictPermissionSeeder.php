<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class PredictPermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        Permission::firstOrCreate(['name'=>'view_prediksi', 'guard_name'=>'web']);
        Role::firstOrCreate(['name'=>'tpid', 'guard_name'=>'web']);

        Role::findByName('tpid')->syncPermissions(['view_prediksi']);
    }
}
