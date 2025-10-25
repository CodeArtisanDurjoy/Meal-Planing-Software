<?php

namespace App\Http\Controllers;
use App\Models\Recipe;
use App\Models\RecipeSuggestion;
use App\Models\UserGoal;
use App\Models\CalendarEntry;
use App\Models\NutritionFact;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;


class SuggestionController extends Controller
{
    public function suggestRecipes()
    {
        $userId = Auth::id();
        
        // Get active user goals
        $activeGoals = UserGoal::where('user_id', $userId)
            ->where('is_active', true)
            ->where(function($query) {
                $query->whereNull('end_date')
                      ->orWhere('end_date', '>=', now());
            })
            ->get();

        if ($activeGoals->isEmpty()) {
            return response()->json(['message' => 'No active goals found. Set some goals first.']);
        }

        // Get today's nutrition intake
        $todayEntries = CalendarEntry::where('user_id', $userId)
            ->whereDate('date', now())
            ->with(['recipe.nutritionFact'])
            ->get();

        $dailyTotals = [
            'calories' => 0,
            'protein' => 0,
            'carbohydrates' => 0,
            'fat' => 0,
            'fiber' => 0,
            'sugar' => 0,
            'sodium' => 0,
            'vitamin_a' => 0,
            'vitamin_c' => 0,
            'calcium' => 0,
            'iron' => 0,
        ];

        foreach ($todayEntries as $entry) {
            $nutrition = $entry->recipe->nutritionFact;
            foreach ($dailyTotals as $key => $value) {
                $dailyTotals[$key] += ($nutrition->$key ?? 0) * $entry->servings;
            }
        }

        // Find recipes that can help achieve goals
        $suggestedRecipes = [];
        $goalImprovements = [];

        foreach ($activeGoals as $goal) {
            $currentValue = $dailyTotals[$goal->goal_type] ?? 0;
            
            if (($goal->direction === 'up' && $currentValue < $goal->target_value) ||
                ($goal->direction === 'down' && $currentValue > $goal->target_value)) {
                
                $recipes = Recipe::with(['nutritionFact', 'carbonFootprint'])
                    ->whereHas('nutritionFact', function($query) use ($goal, $currentValue) {
                        if ($goal->direction === 'up') {
                            $query->where($goal->goal_type, '>', $goal->target_value - $currentValue);
                        } else {
                            $query->where($goal->goal_type, '<', $currentValue - $goal->target_value);
                        }
                    })
                    ->limit(5)
                    ->get();

                foreach ($recipes as $recipe) {
                    $suggestedRecipes[] = $recipe;
                    $goalImprovements[$recipe->id][] = [
                        'goal' => $goal->goal_type,
                        'direction' => $goal->direction,
                        'current' => $currentValue,
                        'target' => $goal->target_value,
                        'improvement' => $recipe->nutritionFact->{$goal->goal_type}
                    ];
                }
            }
        }

        // Create suggestion records
        $suggestions = [];
        foreach ($suggestedRecipes as $recipe) {
            $suggestion = RecipeSuggestion::create([
                'user_id' => $userId,
                'recipe_id' => $recipe->id,
                'reason' => 'Suggested to help achieve your ' . collect($goalImprovements[$recipe->id])->pluck('goal')->unique()->join(', ') . ' goals',
                'goal_improvements' => $goalImprovements[$recipe->id] ?? [],
                'suggested_at' => now(),
            ]);

            $suggestions[] = $suggestion->load(['recipe', 'recipe.nutritionFact', 'recipe.carbonFootprint']);
        }

        return response()->json([
            'suggestions' => $suggestions,
            'message' => 'Recipes suggested based on your current goals and intake'
        ]);
    }

    public function getHistory()
    {
        $suggestions = RecipeSuggestion::where('user_id', Auth::id())
            ->with(['recipe', 'recipe.nutritionFact', 'recipe.carbonFootprint'])
            ->orderBy('suggested_at', 'desc')
            ->get();

        return response()->json($suggestions);
    }

    public function markApplied($id)
    {
        $suggestion = RecipeSuggestion::where('id', $id)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        $suggestion->update(['is_applied' => true]);

        return response()->json([
            'message' => 'Suggestion marked as applied',
            'suggestion' => $suggestion->load(['recipe', 'recipe.nutritionFact', 'recipe.carbonFootprint'])
        ]);
    }
}
