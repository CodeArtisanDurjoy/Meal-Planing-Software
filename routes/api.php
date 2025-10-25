<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\RecipeController;
use App\Http\Controllers\GoalController;
use App\Http\Controllers\CalendarController;
use App\Http\Controllers\BiometricController;
use App\Http\Controllers\SuggestionController;

// Public routes (no authentication required)
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Protected routes (authentication required)
Route::middleware('auth:sanctum')->group(function () {
    // Auth routes
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/refresh', [AuthController::class, 'refresh']);
    Route::put('/profile', [AuthController::class, 'updateProfile']);
    Route::put('/password', [AuthController::class, 'changePassword']);
    Route::delete('/account', [AuthController::class, 'deleteAccount']);

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