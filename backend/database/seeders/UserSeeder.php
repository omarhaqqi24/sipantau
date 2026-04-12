<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // DB::table("user2s")->insert([
        //     [
        //         'nama'=>'admin',
        //         'email'=> 'admin@admin.com',
        //         'password'=> bcrypt('admin'),
        //         'role'=> 'admin',
        //     ],
        //     [
        //         'nama'=> 'guest',
        //         'email'=> 'guest@guest.com',
        //         'password'=> bcrypt('guest'),
        //         'role'=> 'guest',
        //     ]
        // ]);
    }
}
