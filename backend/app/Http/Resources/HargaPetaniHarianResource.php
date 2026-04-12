<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class HargaPetaniHarianResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'harga_petani' => $this->harga_petani,
            'tanggal' => $this->tanggal,

            'komoditas' => $this->whenLoaded('komoditas', function () {
                return [
                    'id'=> $this->komoditas->id,
                    'nama'=> $this->komoditas->nama_komoditas,
                ];
            }),

            'user' => $this->whenLoaded('user', function () {
                return [
                    'id'=> $this->user->id,
                    'name'=> $this->user->name,
                ];
            })
        ];
    }
}
