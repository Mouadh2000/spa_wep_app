<?php

// database/migrations/xxxx_xx_xx_add_verified_email_to_clients_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddVerifiedEmailToClientsTable extends Migration
{
    public function up()
    {
        Schema::table('clients', function (Blueprint $table) {
            $table->boolean('verified_email')->default(false);
            $table->string('verification_token')->nullable();
        });
    }

    public function down()
    {
        Schema::table('clients', function (Blueprint $table) {
            $table->dropColumn('verified_email');
            $table->dropColumn('verification_token');
        });
    }
}
