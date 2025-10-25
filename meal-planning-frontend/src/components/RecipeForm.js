import React, { useState } from 'react';
import {
  TextField,
  Button,
  Box,
  Typography,
  Grid,
  Paper,
  MenuItem,
} from '@mui/material';
import { recipeAPI } from '../services/api';

const RecipeForm = ({ onRecipeCreated, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    ingredients: '',
    instructions: '',
    nutrition: {
      calories: '',
      protein: '',
      carbohydrates: '',
      fat: '',
      fiber: '',
      sugar: '',
      sodium: '',
      vitamin_a: '',
      vitamin_c: '',
      calcium: '',
      iron: '',
    },
    carbon_footprint: {
      co2_emissions: '',
      measurement_unit: 'kg',
      calculation_notes: '',
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNutritionChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      nutrition: {
        ...prev.nutrition,
        [field]: value
      }
    }));
  };

  const handleCarbonChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      carbon_footprint: {
        ...prev.carbon_footprint,
        [field]: value
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await recipeAPI.create(formData);
      onRecipeCreated();
    } catch (error) {
      console.error('Error creating recipe:', error);
    }
  };

  return (
    <Paper sx={{ p: 3, mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        Add New Recipe
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Recipe Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              multiline
              rows={2}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Ingredients"
              name="ingredients"
              value={formData.ingredients}
              onChange={handleChange}
              multiline
              rows={3}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Instructions"
              name="instructions"
              value={formData.instructions}
              onChange={handleChange}
              multiline
              rows={3}
            />
          </Grid>
          
          {/* Nutrition Fields */}
          <Grid item xs={12}>
            <Typography variant="subtitle1">Nutrition Facts</Typography>
          </Grid>
          <Grid item xs={6} sm={4}>
            <TextField
              fullWidth
              label="Calories"
              type="number"
              value={formData.nutrition.calories}
              onChange={(e) => handleNutritionChange('calories', e.target.value)}
              inputProps={{ step: 0.01 }}
            />
          </Grid>
          <Grid item xs={6} sm={4}>
            <TextField
              fullWidth
              label="Protein (g)"
              type="number"
              value={formData.nutrition.protein}
              onChange={(e) => handleNutritionChange('protein', e.target.value)}
              inputProps={{ step: 0.01 }}
            />
          </Grid>
          <Grid item xs={6} sm={4}>
            <TextField
              fullWidth
              label="Carbs (g)"
              type="number"
              value={formData.nutrition.carbohydrates}
              onChange={(e) => handleNutritionChange('carbohydrates', e.target.value)}
              inputProps={{ step: 0.01 }}
            />
          </Grid>
          <Grid item xs={6} sm={4}>
            <TextField
              fullWidth
              label="Fat (g)"
              type="number"
              value={formData.nutrition.fat}
              onChange={(e) => handleNutritionChange('fat', e.target.value)}
              inputProps={{ step: 0.01 }}
            />
          </Grid>
          <Grid item xs={6} sm={4}>
            <TextField
              fullWidth
              label="Fiber (g)"
              type="number"
              value={formData.nutrition.fiber}
              onChange={(e) => handleNutritionChange('fiber', e.target.value)}
              inputProps={{ step: 0.01 }}
            />
          </Grid>
          <Grid item xs={6} sm={4}>
            <TextField
              fullWidth
              label="Carbon Footprint (kg CO2)"
              type="number"
              value={formData.carbon_footprint.co2_emissions}
              onChange={(e) => handleCarbonChange('co2_emissions', e.target.value)}
              inputProps={{ step: 0.01 }}
            />
          </Grid>
        </Grid>
        
        <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
          <Button type="submit" variant="contained" color="primary">
            Save Recipe
          </Button>
          <Button variant="outlined" onClick={onCancel}>
            Cancel
          </Button>
        </Box>
      </form>
    </Paper>
  );
};

export default RecipeForm;