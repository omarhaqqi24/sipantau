<?php

namespace App\Http\Controllers;

use App\Http\Resources\PanenResource;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use App\Models\Panen;
use Illuminate\Support\Facades\DB;
use Throwable;

class PanenController extends Controller
{
    use ApiResponse;

    public function index()
    {
        try {
            $panen = Panen::with([
                'komoditas:id,nama_komoditas',
                'user:id,name',
            ])->get();

            return $this->success(PanenResource::collection($panen), 'Panen fetched successfully');
        } catch (Throwable $e) {
            return $this->error($e->getMessage());
        }
    }

    public function store(Request $request)
    {
        
        $validated = $request->validate([
            'komoditas_id' => 'required|exists:komoditas,id',

            'items' => 'required|array|min:1',

            'items.*.perkiraan_tonase' => 'required|integer|min:0',
            'items.*.tanggal_prakiraan_panen' => 'required|date',
        ]);

        try {
            $saveIds = [];

            DB::transaction(function () use ($validated, &$saveIds, $request) {
                foreach ($validated['items'] as $item) {
                    $record = Panen::updateOrCreate(
                        [
                            'komoditas_id' => $validated['komoditas_id'],
                            'tanggal_prakiraan_panen' => $item['tanggal_prakiraan_panen']
                        ],

                        [
                            'perkiraan_tonase' => $item['perkiraan_tonase'],
                            'user_id' => $request->user()->id
                        ]
                    );

                    $saveIds[] = $record->id;
                }
            });

            $records = Panen::with([
                'komoditas:id,nama_komoditas',
                'user:id,name'
            ])->whereIn('id', $saveIds)->get();

            return $this->success(PanenResource::collection($records),'Panen created successfully',201);
        } catch (Throwable $e) {
            return $this->error($e->getMessage());
        }
    }
}
