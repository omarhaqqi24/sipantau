<?php

namespace App\Http\Controllers;

use App\Http\Resources\HargaPetaniHarianResource;
use App\Models\HargaPetaniHarian;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Throwable;

class HargaPetaniHarianController extends Controller
{
    use ApiResponse;

    public function index()
    {
        try {
            $hargaPetani = HargaPetaniHarian::with([
                'komoditas:id,nama_komoditas',
                'user:id,name'
            ])->get();

            return $this->success(
                HargaPetaniHarianResource::collection($hargaPetani),
                'Harga Petani fetched successfully'
            );
        } catch (Throwable $e) {
            return $this->error($e->getMessage());
        }
    }

    public function store(Request $request)
    {
        try {
            $saveIds = [];

            $validated = $request->validate([
                'komoditas_id' => 'required|exists:komoditas,id',
                
                'items' => 'required|array|min:1',

                'items.*.tanggal' => 'required|date',
                'items.*.harga_petani' => 'required|integer|min:0'
            ]);

            DB::transaction(function () use ($request, $validated, &$saveIds) {
                foreach ($validated['items'] as $item) {
                    $record = HargaPetaniHarian::updateOrCreate([
                        'komoditas_id' => $validated['komoditas_id'],
                        'tanggal' => $item['tanggal']
                    ], [
                        'harga_petani' => $item['harga_petani'],
                        'user_id'=> $request->user()->id
                    ]);

                    $saveIds[] = $record->id;
                }
            });

            $records = HargaPetaniHarian::with([
                'komoditas',
                'user'
            ])->whereIn('id', $saveIds)->get();

            return $this->success(
                HargaPetaniHarianResource::collection($records),
                'Harga Petani Harian fetched successfully',
                201
            );
        } catch (Throwable $e) {
            return $this->error($e->getMessage());
        }
    }
}
