<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use App\Models\Komoditas;


class Panen extends Model
{
    protected $fillable = [
        'perkiraan_tonase',
        'tanggal_prakiraan_panen',
        'komoditas_id',
        'user_id'
    ];

    protected $casts = [
        'tanggal_prakiraan_panen' => 'date'
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
