<?php

namespace App\Http\Controllers;

use App\Http\Resources\HargaPasarHarianResource;
use App\Models\HargaPasarHarian;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Throwable;

class HargaPasarHarianController extends Controller
{
    use ApiResponse;

    public function index()
    {
        try {
            $hargaPasar = HargaPasarHarian::with([
                'komoditas:id,nama_komoditas',
                'user:id,name',
                'pasar:id,nama_pasar'
            ])->get();

            return $this->success(HargaPasarHarianResource::collection($hargaPasar), 'Harga Pasar Harian fetched successfully');
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

                'items.*.harga_pasar' => 'required|integer|min:0',
                'items.*.tanggal' => 'required|date',
                'items.*.pasar_id' => 'required|exists:pasars,id'
            ]);

            DB::transaction(function () use ($validated, &$saveIds, $request) {
                foreach ($validated['items'] as $item) {
                    $record = HargaPasarHarian::updateOrCreate(
                        [
                        'komoditas_id' => $validated['komoditas_id'],
                        'pasar_id' => $item['pasar_id'],
                        'tanggal'=> $item['tanggal'],
                    ], [
                        'harga_pasar' => $item['harga_pasar'],
                        'user_id' => $request->user()->id
                    ]);

                    $saveIds[] = $record->id;
                }
            });

            $records = HargaPasarHarian::with([
                'komoditas',
                'user',
                'pasar'
            ])->whereIn('id', $saveIds)->get();

            return $this->success(
                HargaPasarHarianResource::collection($records),
                'Harga Pasar Harian created successfully',
                201
            );

        } catch (Throwable $e) {
            return $this->error($e->getMessage());
        }
    }
}
