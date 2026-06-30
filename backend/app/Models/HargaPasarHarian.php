<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HargaPasarHarian extends Model
{
    protected $fillable = [
        'harga_pasar',
        'tanggal',
        'komoditas_id',
        'user_id',
        'pasar_id',
    ];

    protected $casts = [
        'tanggal' => 'date',
    ];

    public function komoditas()
    {
        return $this->belongsTo(Komoditas::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function pasar()
    {
        return $this->belongsTo(Pasar::class);
    }
}
