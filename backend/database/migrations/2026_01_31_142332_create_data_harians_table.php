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
        Schema::create('data_harians', function (Blueprint $table) {
            $table->id();
            $table->unsignedInteger('harga_pasar');
            $table->unsignedInteger('harga_petani');
            $table->unsignedInteger('ketersediaan_harian');
            $table->unsignedInteger('kebutuhan_harian');
            $table->integer('neraca_harian');
            $table->foreignId('komoditas_id')->constrained()->cascadeOnDelete();
            $table->foreignId('pasar_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('data_harians');
    }
};
