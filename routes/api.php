<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\RecipeController;
use App\Http\Controllers\GoalController;
use App\Http\Controllers\CalendarController;
use App\Http\Controllers\BiometricController;
use App\Http\Controllers\SuggestionController;

Route::middleware('auth:sanctum')->group(function () {
    // Recipe routes
    Route::apiResource('recipes', RecipeController::class);

    // Goal routes
    Route::apiResource('goals', GoalController::class);

    // Calendar routes
    Route::apiResource('calendar', CalendarController::class);
    Route::get('/calendar/daily-summary', [CalendarController::class, 'getDailySummary']);

    // Biometric routes
    Route::apiResource('biometric', BiometricController::class);
    Route::get('/biometric/trends', [BiometricController::class, 'getTrendData']);

    // Suggestion routes
    Route::get('/suggestions', [SuggestionController::class, 'suggestRecipes']);
    Route::get('/suggestions/history', [SuggestionController::class, 'getHistory']);
    Route::post('/suggestions/{id}/apply', [SuggestionController::class, 'markApplied']);
});