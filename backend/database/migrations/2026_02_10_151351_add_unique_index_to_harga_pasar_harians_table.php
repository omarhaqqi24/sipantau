<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('harga_pasar_harians', function (Blueprint $table) {
            $table->unique(['komoditas_id','tanggal','pasar_id'], 'harga_pasar_harians_komoditas_tanggal_pasar_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('harga_pasar_harians', function (Blueprint $table) {
            $table->dropUnique('harga_pasar_harians_komoditas_tanggal_pasar_unique');
        });
    }
};
