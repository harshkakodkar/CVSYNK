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
       Schema::create('jobs', function (Blueprint $table) {
    $table->id();
    $table->uuid('uuid')->unique()->default(DB::raw('(UUID())'));
    $table->string('title');
    $table->text('description');
    $table->uuid('company_uuid');
    $table->decimal('salary_from', 10, 2);
    $table->decimal('salary_to', 10, 2);
    $table->enum('status',['active','inactive'])->default('active');
    $table->timestamps();
});

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('jobs');
    }
};
