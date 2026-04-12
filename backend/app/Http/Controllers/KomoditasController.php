<?php

namespace App\Http\Controllers;

use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use App\Models\Komoditas;
use Throwable;

class KomoditasController extends Controller
{
    use ApiResponse;

    public function index()
    {
        try {
            $komoditas = Komoditas::select('id', 'nama_komoditas')->get();

            return $this->success($komoditas, 'Komoditas fetched successfull');
        } catch (Throwable $e) {
            return $this->error('Failed to fetch data');
        }
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama_komoditas' => 'required|string|max:255|unique:komoditas,nama_komoditas',
        ]);

        try {
            $komoditas = Komoditas::create($validated);

            return $this->success([
                'id'=> $komoditas->id,
                'nama'=> $komoditas->nama_komoditas,
            ], 'Komoditas created Successfully', 201);
        } catch (Throwable $e) {
            return $this->error('Failed to create Komoditas');
        }
    }
}
