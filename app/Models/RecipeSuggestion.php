<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
class RecipeSuggestion extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'recipe_id',
        'reason',
        'goal_improvements',
        'is_applied',
        'suggested_at',
    ];

    protected $casts = [
        'goal_improvements' => 'array',
        'is_applied' => 'boolean',
        'suggested_at' => 'datetime',
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
