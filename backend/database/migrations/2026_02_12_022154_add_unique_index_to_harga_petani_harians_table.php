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
        Schema::table('harga_petani_harians', function (Blueprint $table) {
            $table->unique(['komoditas_id','tanggal'], 'harga_petani_harians_komoditas_tanggal_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('harga_petani_harians', function (Blueprint $table) {
            $table->dropUnique('harga_petani_harians_komoditas_tanggal_unique');
        });
    }
};
