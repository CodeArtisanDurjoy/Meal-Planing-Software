<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
class CarbonFootprint extends Model
{
    use HasFactory;

    protected $fillable = [
        'recipe_id',
        'co2_emissions',
        'measurement_unit',
        'calculation_notes',
    ];

    protected $casts = [
        'co2_emissions' => 'decimal:2',
    ];

    public function recipe()
    {
        return $this->belongsTo(Recipe::class);
    }
}
