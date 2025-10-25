<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Recipe;


class RecipeController extends Controller
{
     public function index()
    {
        $recipes = Recipe::with(['nutritionFact', 'carbonFootprint'])->get();
        return response()->json($recipes);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'ingredients' => 'nullable|string',
            'instructions' => 'nullable|string',
            'nutrition' => 'required|array',
            'carbon_footprint' => 'required|array',
        ]);

        $recipe = Recipe::create([
            'name' => $request->name,
            'description' => $request->description,
            'ingredients' => $request->ingredients,
            'instructions' => $request->instructions,
        ]);

        // Create nutrition fact
        $recipe->nutritionFact()->create($request->nutrition);

        // Create carbon footprint
        $recipe->carbonFootprint()->create($request->carbon_footprint);

        return response()->json($recipe->fresh(['nutritionFact', 'carbonFootprint']), 201);
    }

    public function show(Recipe $recipe)
    {
        return response()->json($recipe->load(['nutritionFact', 'carbonFootprint']));
    }

    public function update(Request $request, Recipe $recipe)
    {
        $request->validate([
            'name' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'ingredients' => 'nullable|string',
            'instructions' => 'nullable|string',
        ]);

        $recipe->update($request->only(['name', 'description', 'ingredients', 'instructions']));

        if ($request->has('nutrition')) {
            $recipe->nutritionFact()->updateOrCreate(
                ['recipe_id' => $recipe->id],
                $request->nutrition
            );
        }

        if ($request->has('carbon_footprint')) {
            $recipe->carbonFootprint()->updateOrCreate(
                ['recipe_id' => $recipe->id],
                $request->carbon_footprint
            );
        }

        return response()->json($recipe->fresh(['nutritionFact', 'carbonFootprint']));
    }

    public function destroy(Recipe $recipe)
    {
        $recipe->delete();
        return response()->json(['message' => 'Recipe deleted successfully']);
    }
}
