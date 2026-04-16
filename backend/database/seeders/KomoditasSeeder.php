<?php

namespace Database\Seeders;

use App\Models\Komoditas;
use Illuminate\Database\Seeder;

class KomoditasSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $komoditas = [
            'Cabai Rawit Merah',
            'Cabai Merah Besar',
            'Bawang Merah',
            'Beras'
        ];

        foreach ($komoditas as $kom) {
            Komoditas::firstOrCreate(['nama_komoditas'=>$kom]);
        }
    }
}
