<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PanenResource extends JsonResource
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
            "perkiraan_tonase"=> $this->perkiraan_tonase,
            "tanggal_prakiraan_panen" => $this->tanggal_prakiraan_panen,

            "komoditas" => $this->whenLoaded('komoditas', function () {
                return [
                    "id" => $this->komoditas->id,
                    "nama_komoditas" => $this->komoditas->nama_komoditas,
                ];
            }),

            "user" => $this->whenLoaded('komoditas', function () {
                return [
                    "id" => $this->user->id,
                    "name" => $this->user->name,
                ];
            })
        ];
    }
}
