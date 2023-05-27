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
        Schema::table('table_customer', function(Blueprint $table) {
            $table->integer('rt')->after('phone')->nullable();
            $table->integer('rw')->after('rt')->nullable();
        });

        Schema::table('table_reports', function(Blueprint $table) {
            $table->bigInteger('total')->after('report_date')->default(0);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
