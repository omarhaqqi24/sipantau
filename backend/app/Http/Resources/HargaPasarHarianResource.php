<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class HargaPasarHarianResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'=> $this->id,
            'harga_pasar' => $this->harga_pasar,
            'tanggal' => $this->tanggal,

            'komoditas' => $this->whenLoaded('komoditas', function() {
                return [
                    'id' => $this->komoditas->id,
                    'nama' => $this->komoditas->nama_komoditas
                ];
            }),

            'user' => $this->whenLoaded('user', function() {
                return [
                    'id'=> $this->user->id,
                    'name'=> $this->user->name
                ];
            }),

            'pasar' => $this->whenLoaded('pasar', function() {
                return [
                    'id' => $this->pasar->id,
                    'nama' => $this->pasar->nama_pasar
                ];
            })
        ];
    }
}
