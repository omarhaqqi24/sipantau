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
        Schema::create('ketersediaan_harians', function (Blueprint $table) {
            $table->id();
            $table->unsignedInteger('ketersediaan_harian');
            $table->unsignedInteger('kebutuhan_harian');
            $table->integer('neraca_harian');
            $table->date('tanggal');
            $table->foreignId('komoditas_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->timestamps();

            $table->unique(['komoditas_id','tanggal']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ketersediaan_harians');
    }
};
