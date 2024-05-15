<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class ChangePriceColumnTypeToTextInServicesTable extends Migration
{
    public function up()
    {
        Schema::table('services', function (Blueprint $table) {
            $table->text('price')->nullable()->change();
        });
    }

    public function down()
    {
        Schema::table('services', function (Blueprint $table) {
            $table->decimal('price', 8, 2)->nullable()->change(); // Change back to decimal if necessary
        });
    }
}
