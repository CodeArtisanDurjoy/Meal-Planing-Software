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
  Paper,
  Alert,
} from '@mui/material';
import { calendarAPI } from '../services/api';

const CalendarView = ({ open, onClose, date }) => {
  const [calendarData, setCalendarData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open && date) {
      loadCalendarData();
    }
  }, [open, date]);

  const loadCalendarData = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await calendarAPI.getDailySummary(date);
      setCalendarData(response.data);
    } catch (error) {
      setError('Failed to load calendar data');
      console.error('Calendar data error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!calendarData) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Calendar for {calendarData.date}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h6">Daily Totals</Typography>
            <Box sx={{ mt: 1 }}>
              <Typography>Calories: {calendarData.daily_totals.calories}</Typography>
              <Typography>Protein: {calendarData.daily_totals.protein}g</Typography>
              <Typography>Carbs: {calendarData.daily_totals.carbohydrates}g</Typography>
              <Typography>Fat: {calendarData.daily_totals.fat}g</Typography>
              <Typography>Fiber: {calendarData.daily_totals.fiber}g</Typography>
              <Typography>CO2 Footprint: {calendarData.total_carbon_footprint} kg</Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12}>
            <Typography variant="h6">Meals</Typography>
            {calendarData.entries.map((entry) => (
              <Paper key={entry.id} sx={{ p: 2, mb: 2 }}>
                <Typography variant="subtitle1">
                  {entry.meal_type.charAt(0).toUpperCase() + entry.meal_type.slice(1)} - {entry.recipe.name}
                </Typography>
                <Typography variant="body2">
                  {entry.servings} serving(s)
                </Typography>
                <Typography variant="body2">
                  Calories: {entry.recipe.nutritionFact?.calories} | CO2: {entry.recipe.carbonFootprint?.co2_emissions}kg
                </Typography>
              </Paper>
            ))}
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default CalendarView;