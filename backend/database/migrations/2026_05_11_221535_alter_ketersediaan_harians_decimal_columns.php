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
        Schema::table('ketersediaan_harians', function (Blueprint $table) {
            $table->decimal('ketersediaan_harian', 10, 2)->change();
            $table->decimal('kebutuhan_harian', 10, 2)->change();
            $table->decimal('neraca_harian', 10, 2)->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('ketersediaan_harians', function (Blueprint $table) {
            $table->unsignedInteger('ketersediaan_harian')->change();
            $table->unsignedInteger('kebutuhan_harian')->change();
            $table->integer('neraca_harian')->change();
        });
    }
};
