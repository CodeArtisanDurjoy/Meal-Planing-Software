import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Grid,
  Chip,
  Alert,
} from '@mui/material';
import { recipeAPI, calendarAPI } from '../services/api';

const RecipeDetails = ({ open, onClose, recipeId }) => {
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open && recipeId) {
      loadRecipeDetails();
    }
  }, [open, recipeId]);

  const loadRecipeDetails = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await recipeAPI.get(recipeId);
      setRecipe(response.data);
    } catch (error) {
      setError('Failed to load recipe details');
      console.error('Recipe details error:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCalendar = async (mealType, date = new Date().toISOString().split('T')[0]) => {
    try {
      await calendarAPI.create({
        recipe_id: recipe.id,
        date: date,
        meal_type: mealType,
        servings: 1,
      });
      alert('Recipe added to calendar successfully!');
    } catch (error) {
      alert('Failed to add recipe to calendar');
      console.error('Calendar add error:', error);
    }
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!recipe) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{recipe.name}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h6">Description</Typography>
            <Typography>{recipe.description}</Typography>
          </Grid>
          
          <Grid item xs={12}>
            <Typography variant="h6">Ingredients</Typography>
            <Typography>{recipe.ingredients}</Typography>
          </Grid>
          
          <Grid item xs={12}>
            <Typography variant="h6">Instructions</Typography>
            <Typography>{recipe.instructions}</Typography>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Typography variant="h6">Nutrition Facts</Typography>
            {recipe.nutritionFact && (
              <Box sx={{ mt: 1 }}>
                <Typography>Calories: {recipe.nutritionFact.calories}</Typography>
                <Typography>Protein: {recipe.nutritionFact.protein}g</Typography>
                <Typography>Carbs: {recipe.nutritionFact.carbohydrates}g</Typography>
                <Typography>Fat: {recipe.nutritionFact.fat}g</Typography>
                <Typography>Fiber: {recipe.nutritionFact.fiber}g</Typography>
                <Typography>Sodium: {recipe.nutritionFact.sodium}mg</Typography>
              </Box>
            )}
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Typography variant="h6">Environmental Impact</Typography>
            {recipe.carbonFootprint && (
              <Box sx={{ mt: 1 }}>
                <Typography>CO2 Emissions: {recipe.carbonFootprint.co2_emissions} kg</Typography>
                <Typography>Unit: {recipe.carbonFootprint.measurement_unit}</Typography>
                <Typography>Notes: {recipe.carbonFootprint.calculation_notes}</Typography>
              </Box>
            )}
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        <Button onClick={() => addToCalendar('breakfast')}>Add to Breakfast</Button>
        <Button onClick={() => addToCalendar('lunch')}>Add to Lunch</Button>
        <Button onClick={() => addToCalendar('dinner')}>Add to Dinner</Button>
        <Button onClick={() => addToCalendar('snack')}>Add to Snack</Button>
      </DialogActions>
    </Dialog>
  );
};

export default RecipeDetails;