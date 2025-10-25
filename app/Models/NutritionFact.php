<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
class NutritionFact extends Model
{
    use HasFactory;

    protected $fillable = [
        'recipe_id',
        'calories',
        'protein',
        'carbohydrates',
        'fat',
        'fiber',
        'sugar',
        'sodium',
        'vitamin_a',
        'vitamin_c',
        'calcium',
        'iron',
    ];

    protected $casts = [
        'calories' => 'decimal:2',
        'protein' => 'decimal:2',
        'carbohydrates' => 'decimal:2',
        'fat' => 'decimal:2',
        'fiber' => 'decimal:2',
        'sugar' => 'decimal:2',
        'sodium' => 'decimal:2',
        'vitamin_a' => 'decimal:2',
        'vitamin_c' => 'decimal:2',
        'calcium' => 'decimal:2',
        'iron' => 'decimal:2',
    ];

    public function recipe()
    {
        return $this->belongsTo(Recipe::class);
    }
}
