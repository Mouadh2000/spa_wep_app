<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Category;
use App\Models\User;

class Service extends Model
{
    protected $table = 'services';

    protected $fillable = ['service_name', 'description', 'price', 'category_id', 'staff_id'];

    // Define relationships
    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function staff()
    {
        return $this->belongsTo(User::class);
    }
}
