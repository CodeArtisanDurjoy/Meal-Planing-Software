<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\CalendarEntry;
use Illuminate\Support\Facades\Auth;
class CalendarController extends Controller
{
     public function index()
    {
        $entries = CalendarEntry::with(['recipe', 'recipe.nutritionFact', 'recipe.carbonFootprint'])
            ->where('user_id', Auth::id())
            ->orderBy('date')
            ->get();
        return response()->json($entries);
    }

    public function store(Request $request)
    {
        $request->validate([
            'recipe_id' => 'required|exists:recipes,id',
            'date' => 'required|date',
            'meal_type' => 'required|in:breakfast,lunch,dinner,snack',
            'servings' => 'required|integer|min:1',
        ]);

        $entry = CalendarEntry::create([
            'user_id' => Auth::id(),
            'recipe_id' => $request->recipe_id,
            'date' => $request->date,
            'meal_type' => $request->meal_type,
            'servings' => $request->servings,
        ]);

        return response()->json($entry->load(['recipe', 'recipe.nutritionFact', 'recipe.carbonFootprint']), 201);
    }

    public function show($id)
    {
        $entry = CalendarEntry::with(['recipe', 'recipe.nutritionFact', 'recipe.carbonFootprint'])
            ->where('id', $id)
            ->where('user_id', Auth::id())
            ->firstOrFail();
        return response()->json($entry);
    }

    public function update(Request $request, CalendarEntry $calendarEntry)
    {
        if ($calendarEntry->user_id !== Auth::id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $request->validate([
            'recipe_id' => 'sometimes|exists:recipes,id',
            'date' => 'sometimes|date',
            'meal_type' => 'sometimes|in:breakfast,lunch,dinner,snack',
            'servings' => 'sometimes|integer|min:1',
        ]);

        $calendarEntry->update($request->all());
        return response()->json($calendarEntry->load(['recipe', 'recipe.nutritionFact', 'recipe.carbonFootprint']));
    }

    public function destroy(CalendarEntry $calendarEntry)
    {
        if ($calendarEntry->user_id !== Auth::id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $calendarEntry->delete();
        return response()->json(['message' => 'Calendar entry deleted successfully']);
    }

    public function getDailySummary(Request $request)
    {
        $date = $request->date ?? now()->format('Y-m-d');
        
        $entries = CalendarEntry::with(['recipe', 'recipe.nutritionFact', 'recipe.carbonFootprint'])
            ->where('user_id', Auth::id())
            ->whereDate('date', $date)
            ->get();

        $totalNutrition = [
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

        $totalCarbonFootprint = 0;

        foreach ($entries as $entry) {
            $nutrition = $entry->recipe->nutritionFact;
            $carbonFootprint = $entry->recipe->carbonFootprint;
            
            foreach ($totalNutrition as $key => $value) {
                $totalNutrition[$key] += ($nutrition->$key ?? 0) * $entry->servings;
            }
            
            $totalCarbonFootprint += ($carbonFootprint->co2_emissions ?? 0) * $entry->servings;
        }

        return response()->json([
            'date' => $date,
            'entries' => $entries,
            'daily_totals' => $totalNutrition,
            'total_carbon_footprint' => $totalCarbonFootprint,
        ]);
    }
}
