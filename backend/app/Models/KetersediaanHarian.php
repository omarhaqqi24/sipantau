<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use App\Models\Komoditas;

class KetersediaanHarian extends Model
{
    protected $fillable = [
        'ketersediaan_harian',
        'kebutuhan_harian',
        'neraca_harian',
        'tanggal',
        'komoditas_id',
        'user_id'
    ];

    protected $casts = [
        'tanggal'=> 'date'
    ];

    public function komoditas()
    {
        return $this->belongsTo(Komoditas::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
