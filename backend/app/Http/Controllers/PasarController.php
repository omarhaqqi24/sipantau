<?php

namespace App\Http\Controllers;

use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use App\Models\Pasar;
use Throwable;

class PasarController extends Controller
{
    use ApiResponse;

    public function index()
    {
        try {
            $pasar = Pasar::select('id', 'daerah', 'nama_pasar')->get();

            return $this->success($pasar, 'Pasar fetched successfully');
        } catch (Throwable $e) {
            return $this->error($e->getMessage());
        }
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'daerah' => 'required|string|max:255',
            'nama_pasar'=> 'required|string|max:255'
        ]);

        try {
            $pasar = Pasar::create($validated);

            return $this->success([
                'id'=> $pasar->id,
                'daerah' => $validated['daerah'],
                'nama_pasar'=> $validated['nama_pasar'],
            ],'Pasar created successfully', 201);
        } catch (Throwable $e) {
            return $this->error($e->getMessage());
        }
    }
}
