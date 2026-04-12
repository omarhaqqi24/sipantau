<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use App\Models\Komoditas;

class HargaPetaniHarian extends Model
{
    protected $fillable = [
        'harga_petani',
        'tanggal',
        'komoditas_id',
        'user_id',
    ];

    protected $casts = [
        'tanggal'=> 'date',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function komoditas()
    {
        return $this->belongsTo(Komoditas::class);
    }
}
