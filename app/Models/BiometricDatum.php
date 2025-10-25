<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
class BiometricDatum extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'weight',
        'systolic_bp',
        'diastolic_bp',
        'bmi',
        'measurement_date',
        'notes',
    ];

    protected $casts = [
        'weight' => 'decimal:2',
        'systolic_bp' => 'integer',
        'diastolic_bp' => 'integer',
        'bmi' => 'decimal:2',
        'measurement_date' => 'date',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
