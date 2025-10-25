<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Recipe;

class RecipeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
       $recipes = [
            [
                'name' => 'Vegetable Stir Fry',
                'description' => 'Healthy vegetable stir fry with tofu',
                'ingredients' => 'Tofu, Broccoli, Carrots, Bell Peppers, Soy Sauce',
                'instructions' => 'Stir fry vegetables and tofu with soy sauce',
                'nutrition' => [
                    'calories' => 250.00,
                    'protein' => 15.00,
                    'carbohydrates' => 20.00,
                    'fat' => 12.00,
                    'fiber' => 8.00,
                    'sugar' => 10.00,
                    'sodium' => 600.00,
                    'vitamin_a' => 500.00,
                    'vitamin_c' => 120.00,
                    'calcium' => 150.00,
                    'iron' => 3.50,
                ],
                'carbon_footprint' => [
                    'co2_emissions' => 0.85,
                    'measurement_unit' => 'kg',
                    'calculation_notes' => 'Based on plant-based ingredients'
                ]
            ],
            [
                'name' => 'Grilled Chicken Salad',
                'description' => 'Fresh salad with grilled chicken',
                'ingredients' => 'Chicken Breast, Mixed Greens, Tomatoes, Cucumber, Olive Oil',
                'instructions' => 'Grill chicken and mix with fresh vegetables',
                'nutrition' => [
                    'calories' => 320.00,
                    'protein' => 30.00,
                    'carbohydrates' => 12.00,
                    'fat' => 18.00,
                    'fiber' => 5.00,
                    'sugar' => 8.00,
                    'sodium' => 450.00,
                    'vitamin_a' => 300.00,
                    'vitamin_c' => 80.00,
                    'calcium' => 80.00,
                    'iron' => 2.80,
                ],
                'carbon_footprint' => [
                    'co2_emissions' => 2.10,
                    'measurement_unit' => 'kg',
                    'calculation_notes' => 'Higher due to chicken content'
                ]
            ],
            [
                'name' => 'Quinoa Bowl',
                'description' => 'Protein-rich quinoa with vegetables',
                'ingredients' => 'Quinoa, Black Beans, Avocado, Corn, Lime',
                'instructions' => 'Cook quinoa and mix with beans and vegetables',
                'nutrition' => [
                    'calories' => 400.00,
                    'protein' => 18.00,
                    'carbohydrates' => 55.00,
                    'fat' => 15.00,
                    'fiber' => 12.00,
                    'sugar' => 6.00,
                    'sodium' => 300.00,
                    'vitamin_a' => 200.00,
                    'vitamin_c' => 45.00,
                    'calcium' => 100.00,
                    'iron' => 4.20,
                ],
                'carbon_footprint' => [
                    'co2_emissions' => 1.20,
                    'measurement_unit' => 'kg',
                    'calculation_notes' => 'Moderate carbon footprint'
                ]
            ]
        ];

        foreach ($recipes as $recipeData) {
            $recipe = Recipe::create([
                'name' => $recipeData['name'],
                'description' => $recipeData['description'],
                'ingredients' => $recipeData['ingredients'],
                'instructions' => $recipeData['instructions'],
            ]);

            $recipe->nutritionFact()->create($recipeData['nutrition']);
            $recipe->carbonFootprint()->create($recipeData['carbon_footprint']);
        }
    }
    
}
