<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
class CalendarEntry extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'recipe_id',
        'date',
        'meal_type',
        'servings',
    ];

    protected $casts = [
        'date' => 'date',
        'servings' => 'integer',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function recipe()
    {
        return $this->belongsTo(Recipe::class);
    }
}
