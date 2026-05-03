<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\HargaPasarHarianController;
use App\Http\Controllers\HargaPetaniHarianController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\KomoditasController;
use App\Http\Controllers\KetersediaanHarianController;
use App\Http\Controllers\PanenController;
use App\Http\Controllers\PasarController;
use App\Http\Controllers\PredictController;

// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {

    // Authentication
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', function (Request $request) {
        return $request->user();
    });

    // Komoditas
    Route::get('/komoditas', [KomoditasController::class,'index'])
        ->middleware('permission:view_komoditas');

    // Ketersediaan Harian
    Route::post('/ketersediaan', [KetersediaanHarianController::class,'store'])
        ->middleware('permission:create_ketersediaan_harian');

    // Panen
    Route::post('/panen', [PanenController::class, 'store'])
        ->middleware('permission:create_panen');

    // Harga Pasar Harian
    Route::post('/harga-pasar', [HargaPasarHarianController::class, 'store'])
        ->middleware('permission:create_harga_pasar');

    // Harga Petani Harian
    Route::post('/harga-petani', [HargaPetaniHarianController::class, 'store'])
        ->middleware('permission:create_harga_petani');
    
    // Prediksi Harga Pasar
    Route::get('/predict', [PredictController::class, 'index'])
        ->middleware('permission:view_prediksi');
    
    Route::middleware('role:admin')->group(function () {
        // Register
        Route::post('/register', [AuthController::class, 'register']);

        // Komoditas
        Route::post('/komoditas', [KomoditasController::class,'store']);

        // Pasar
        Route::get('/pasar', [PasarController::class, 'index']);
        Route::post('/pasar', [PasarController::class, 'store']);

        // Ketersediaan Harian
        Route::get('/ketersediaan', [KetersediaanHarianController::class,'index']);

        // Panen
        Route::get('/panen', [PanenController::class, 'index']);

        // Harga Pasar Harian
        Route::get('/harga-pasar', [HargaPasarHarianController::class, 'index']);

        // Harga Petani Harian
        Route::get('/harga-petani', [HargaPetaniHarianController::class, 'index']);
    });
});