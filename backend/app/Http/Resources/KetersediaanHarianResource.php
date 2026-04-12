<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class KetersediaanHarianResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            "id"=> $this->id,
            "ketersediaan_harian" => $this->ketersediaan_harian,
            'kebutuhan_harian' => $this->kebutuhan_harian,
            'neraca_harian' => $this->neraca_harian,
            'tanggal' => $this->tanggal,

            'komoditas' => $this->whenLoaded('komoditas', function () {
                return [
                    'id' => $this->komoditas->id,
                    'nama' => $this->komoditas->nama_komoditas
                ];
            }),

            'user' => $this->whenLoaded('user', function () {
                return [
                    'id' => $this->user->id,
                    'name' => $this->user->name
                ];
            })
        ];
    }
}
