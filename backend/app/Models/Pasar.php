<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\KetersediaanHarian;
use App\Models\Komoditas;

class Pasar extends Model
{
    protected $fillable = [
        'daerah',
        'nama_pasar'
    ];

    public function ketersediaanHarians()
    {
        return $this->hasMany(KetersediaanHarian::class);  
    }

    public function komoditas()
    {
        return $this->belongsToMany(Komoditas::class,'komoditas_pasar');
    }
}
