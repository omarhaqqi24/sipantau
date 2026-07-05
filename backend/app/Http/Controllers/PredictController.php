<?php

namespace App\Http\Controllers;

use App\Models\HargaPasarHarian;
use App\Services\ActivityLogger;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Throwable;

class PredictController extends Controller
{
    use ApiResponse;

    public function __construct(
        private ActivityLogger $activityLogger
    ) {}

    public function index(Request $request)
    {
        try {
            $validated = $request->validate([
                'pasar_id' => 'required|exists:pasars,id',
                'komoditas_id' => 'required|exists:komoditas,id',
            ]);

            $rows = HargaPasarHarian::query()
                ->join(
                    'ketersediaan_harians',
                    function ($join) {
                        $join->on(
                            'harga_pasar_harians.tanggal',
                            '=',
                            'ketersediaan_harians.tanggal'
                        )
                            ->on(
                                'harga_pasar_harians.komoditas_id',
                                '=',
                                'harga_pasar_harians.komoditas_id'
                            );
                    }
                )
                ->where(
                    'harga_pasar_harians.komoditas_id',
                    $validated['komoditas_id']
                )
                ->where(
                    'harga_pasar_harians.pasar_id',
                    $validated['pasar_id']
                )
                ->orderBy('harga_pasar_harians.tanggal', 'desc')
                ->take(10)
                ->get([
                    'harga_pasar',
                    'ketersediaan_harian',
                    'kebutuhan_harian',
                    'neraca_harian',
                    'harga_pasar_harians.tanggal',
                ]);

            $rows = $rows->reverse()->values();

            $data = [];
            foreach ($rows as $row) {
                $data[] = [
                    (float) $row->harga_pasar,
                    (float) $row->ketersediaan_harian,
                    (float) $row->kebutuhan_harian,
                    (float) $row->neraca_harian,
                ];
            }

            $response = Http::post('http://ml-service:8001/predict',
                [
                    'data' => $data,
                ]
            );

            // $result = [
            //     "tanggal" => [
            //         $rows[0]->tanggal,
            //         $rows[1]->tanggal,
            //         $rows[2]->tanggal,
            //         $rows[3]->tanggal,
            //         $rows[4]->tanggal,
            //         $rows[5]->tanggal,
            //         $rows[6]->tanggal,
            //         $rows[7]->tanggal,
            //         $rows[8]->tanggal,
            //         $rows[9]->tanggal,
            //     ],
            //     "data_request" => $data,
            //     "response" => $response->json()
            // ];

            $result = [
                'tanggal' => [
                    $rows[9]->tanggal,
                    $rows[8]->tanggal,
                    $rows[7]->tanggal,
                    $rows[6]->tanggal,
                ],
                'harga_pasar' => [
                    'harga_pasar_h_min_0' => $rows[9]->harga_pasar,
                    'harga_pasar_h_min_1' => $rows[8]->harga_pasar,
                    'harga_pasar_h_min_2' => $rows[7]->harga_pasar,
                    'harga_pasar_h_min_3' => $rows[6]->harga_pasar,
                ],
                'prediksi' => [
                    'hari_1' => $response->json()['prediksi'][0],
                    'hari_2' => $response->json()['prediksi'][1],
                    'hari_3' => $response->json()['prediksi'][2],
                    'today' => $rows[9]->tanggal,
                ],
            ];

            $this->activityLogger->log(
                $request->user()->id,
                'view_prediksi'
            );

            return $this->success($result, 'Prediksi Harga Berhasil');
        } catch (Throwable $e) {
            return $this->error($e->getMessage());
        }
    }
}
