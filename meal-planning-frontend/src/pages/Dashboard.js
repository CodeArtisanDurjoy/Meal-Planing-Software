import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Box,
  Alert,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { recipeAPI, goalAPI, calendarAPI, suggestionAPI } from '../services/api';
import RecipeDetails from '../components/RecipeDetails';
import CalendarView from '../components/CalendarView';

const Dashboard = () => {
  const [recipes, setRecipes] = useState([]);
  const [goals, setGoals] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showRecipeDetails, setShowRecipeDetails] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      const [recipesRes, goalsRes, suggestionsRes] = await Promise.all([
        recipeAPI.getAll(),
        goalAPI.getAll(),
        suggestionAPI.getSuggestions(),
      ]);
      
      setRecipes(recipesRes.data);
      setGoals(goalsRes.data);
      setSuggestions(suggestionsRes.data.suggestions || []);
    } catch (error) {
      setError('Failed to load dashboard data');
      console.error('Dashboard load error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewRecipe = (recipeId) => {
    setSelectedRecipe(recipeId);
    setShowRecipeDetails(true);
  };

  const handleAddToCalendar = async (recipeId, mealType) => {
    try {
      await calendarAPI.create({
        recipe_id: recipeId,
        date: new Date().toISOString().split('T')[0],
        meal_type: mealType,
        servings: 1,
      });
      alert('Recipe added to calendar successfully!');
      loadDashboardData(); // Refresh data
    } catch (error) {
      alert('Failed to add recipe to calendar');
    }
  };

  const handleViewCalendar = (date) => {
    setSelectedDate(date);
    setShowCalendar(true);
  };

  const getGoalStatus = (goal) => {
    // This would be implemented with actual calculation based on user's intake
    return 'On Track'; // Placeholder
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Meal Planning Dashboard
      </Typography>

      {error && <Alert severity="error">{error}</Alert>}

      {loading ? (
        <Typography>Loading...</Typography>
      ) : (
        <>
          {/* Goals Section */}
          <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
            Your Goals
          </Typography>
          <Grid container spacing={2}>
            {goals.map((goal) => (
              <Grid item xs={12} sm={6} md={4} key={goal.id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">{goal.goal_type}</Typography>
                    <Typography>
                      Target: {goal.target_value} {goal.unit} ({goal.direction})
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {goal.start_date} to {goal.end_date || 'Ongoing'}
                    </Typography>
                    <Chip 
                      label={getGoalStatus(goal)} 
                      color={getGoalStatus(goal) === 'On Track' ? 'success' : 'warning'} 
                      size="small" 
                      sx={{ mt: 1 }}
                    />
                  </CardContent>
                  <CardActions>
                    <Button size="small">Edit Goal</Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Recipe Suggestions */}
          <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
            Recipe Suggestions
          </Typography>
          <Grid container spacing={2}>
            {suggestions.map((suggestion) => (
              <Grid item xs={12} sm={6} md={4} key={suggestion.id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">{suggestion.recipe.name}</Typography>
                    <Typography variant="body2">
                      {suggestion.reason}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      CO2: {suggestion.recipe.carbon_footprint.co2_emissions} kg
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button 
                      size="small" 
                      onClick={() => handleViewRecipe(suggestion.recipe.id)}
                    >
                      View Recipe
                    </Button>
                    <Button 
                      size="small" 
                      onClick={() => handleAddToCalendar(suggestion.recipe.id, 'lunch')}
                    >
                      Add to Calendar
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Recent Recipes */}
          <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
            Recent Recipes
          </Typography>
          <Grid container spacing={2}>
            {recipes.slice(0, 6).map((recipe) => (
              <Grid item xs={12} sm={6} md={4} key={recipe.id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">{recipe.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {recipe.description}
                    </Typography>
                    {recipe.nutritionFact && (
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="body2">
                          Calories: {recipe.nutritionFact.calories}
                        </Typography>
                        <Typography variant="body2">
                          CO2: {recipe.carbon_footprint?.co2_emissions} kg
                        </Typography>
                      </Box>
                    )}
                  </CardContent>
                  <CardActions>
                    <Button 
                      size="small" 
                      onClick={() => handleViewRecipe(recipe.id)}
                    >
                      View Details
                    </Button>
                    <Button 
                      size="small" 
                      onClick={() => handleViewCalendar(new Date().toISOString().split('T')[0])}
                    >
                      Add to Calendar
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </>
      )}

      {/* Recipe Details Dialog */}
      <RecipeDetails
        open={showRecipeDetails}
        onClose={() => setShowRecipeDetails(false)}
        recipeId={selectedRecipe}
      />

      {/* Calendar View Dialog */}
      <CalendarView
        open={showCalendar}
        onClose={() => setShowCalendar(false)}
        date={selectedDate}
      />
    </Container>
  );
};

export default Dashboard;