<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Panen;
use App\Models\KetersediaanHarian;
use App\Models\Pasar;

class Komoditas extends Model
{
    protected $fillable = ['nama_komoditas'];

    public function panens()
    {
        return $this->hasMany(Panen::class);
    }

    public function ketersediaanHarians()
    {
        return $this->hasMany(KetersediaanHarian::class);
    }

    public function pasars()
    {
        return $this->belongsToMany(Pasar::class, 'komoditas_pasar');
    }
}
