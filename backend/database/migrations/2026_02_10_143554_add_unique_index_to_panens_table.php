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
        Schema::table('panens', function (Blueprint $table) {
            $table->unique(
                ['komoditas_id','tanggal_prakiraan_panen'],
                'panens_komoditas_tanggal_unique'
            );
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('panens', function (Blueprint $table) {
            $table->dropUnique('panens_komoditas_tanggal_unique');
        });
    }
};
