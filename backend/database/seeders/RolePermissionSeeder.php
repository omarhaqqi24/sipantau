<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RolePermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reset CACHE
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        $permissions = [
            'create_ketersediaan_harian',
            'view_komoditas',
            'create_harga_pasar',
            'create_harga_petani',
            'create_panen'
        ];

        $roles = [
            'dinas_pertanian',
            'dinas_perdagangan',
            'dinas_ketahanan_pangan',
            'admin',
            'user'
        ];

        foreach ($permissions as $perm) {
            Permission::firstOrCreate(['name'=>$perm, 'guard_name'=>'web']);
        }

        foreach ($roles as $role) {
            Role::firstOrCreate(['name'=>$role, 'guard_name'=>'web']);
        }

        // Assign permissions
        Role::findByName('dinas_pertanian')->syncPermissions(['view_komoditas', 'create_harga_petani','create_panen']);
        Role::findByName('dinas_perdagangan')->syncPermissions(['view_komoditas', 'create_harga_pasar']);
        Role::findByName('dinas_ketahanan_pangan')->syncPermissions(['create_ketersediaan_harian','view_komoditas']);
    }
}
