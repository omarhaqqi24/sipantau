<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class UserActivityPermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        Permission::firstOrCreate(['name' => 'view_user_activity', 'guard_name' => 'web']);
        
        $role = Role::findByName('tpid');

        if (!$role->hasPermissionTo('view_user_activity')) {
            $role->givePermissionTo('view_user_activity');
        }
    }
}
