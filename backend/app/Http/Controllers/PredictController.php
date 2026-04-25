<?php

namespace App\Http\Controllers;

use App\Models\HargaPasarHarian;
use App\Models\HargaPetaniHarian;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Throwable;

class PredictController extends Controller
{
    use ApiResponse;

    public function index(Request $request)
    {
        try {
            $validated = $request->validate([
                'pasar_id' => 'required|exists:pasars,id',
                'komoditas_id' => 'required|exists:komoditas,id'
            ]);

            $pasar = HargaPasarHarian::where('komoditas_id', $validated['komoditas_id'])
                ->where('pasar_id', $validated['pasar_id'])
                ->orderBy('tanggal', 'desc')
                ->take(4)
                ->get();
            
            $petani = HargaPetaniHarian::where('komoditas_id', $validated['komoditas_id'])
                ->orderBy('tanggal', 'desc')
                ->take(4)
                ->get();
            
            if ($petani->count() < 4 || $pasar->count() < 3) {
                return $this->error('Data yang dibutuhkan tidak cukup');
            }

            $data = [
                "harga_petani_h_min_0" => $petani[0]->harga_petani,
                "harga_petani_h_min_1" => $petani[1]->harga_petani,
                "harga_petani_h_min_2" => $petani[2]->harga_petani,
                "harga_petani_h_min_3" => $petani[3]->harga_petani,

                "harga_pasar_h_min_0" => $pasar[0]->harga_pasar,
                "harga_pasar_h_min_1" => $pasar[1]->harga_pasar,
                "harga_pasar_h_min_2" => $pasar[2]->harga_pasar,

                "tanggal" => $pasar[0]->tanggal
            ];

            $response = Http::post('http://ml-service:8001/predict', $data);

            if ($response->failed()) {
                return $this->error('Gagal tersambung ke layanan ML', 500);
            }

            $result = [
                "tanggal" => [
                    $pasar[0]->tanggal,
                    $pasar[1]->tanggal,
                    $pasar[2]->tanggal,
                    $pasar[3]->tanggal,
                ],
                "harga_pasar" => [
                    "harga_pasar_h_min_0" => $pasar[0]->harga_pasar,
                    "harga_pasar_h_min_1" => $pasar[1]->harga_pasar,
                    "harga_pasar_h_min_2" => $pasar[2]->harga_pasar,
                    "harga_pasar_h_min_3" => $pasar[3]->harga_pasar,
                ],
                "prediksi" => $response->json()
            ];

            return $this->success($result, 'Prediksi Harga Berhasil');
        } catch (Throwable $e) {
            return $this->error($e->getMessage());
        }
    }
}
