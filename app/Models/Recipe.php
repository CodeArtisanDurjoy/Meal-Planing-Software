<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Recipe extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'ingredients',
        'instructions',
    ];

    public function nutritionFact()
    {
        return $this->hasOne(NutritionFact::class);
    }

    public function carbonFootprint()
    {
        return $this->hasOne(CarbonFootprint::class);
    }

    public function calendarEntries()
    {
        return $this->hasMany(CalendarEntry::class);
    }
}
