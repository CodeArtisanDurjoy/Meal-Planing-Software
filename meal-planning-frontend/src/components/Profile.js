import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  Grid,
  TextField,
  Button,
  Alert,
  Tabs,
  Tab,
  Card,
  CardContent,
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { biometricAPI } from '../services/api';

const Profile = () => {
  const { user, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [biometricData, setBiometricData] = useState([]);
  const [biometricForm, setBiometricForm] = useState({
    weight: '',
    systolic_bp: '',
    diastolic_bp: '',
    measurement_date: new Date().toISOString().split('T')[0],
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (user) {
      loadBiometricData();
    }
  }, [user]);

  const loadBiometricData = async () => {
    try {
      const response = await biometricAPI.getAll();
      setBiometricData(response.data);
    } catch (error) {
      setError('Failed to load biometric data');
    }
  };

  const handleBiometricSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await biometricAPI.create(biometricForm);
      setSuccess('Biometric data added successfully');
      setBiometricForm({
        weight: '',
        systolic_bp: '',
        diastolic_bp: '',
        measurement_date: new Date().toISOString().split('T')[0],
        notes: '',
      });
      loadBiometricData();
    } catch (error) {
      setError('Failed to add biometric data');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setBiometricForm({
      ...biometricForm,
      [e.target.name]: e.target.value,
    });
  };

  if (authLoading) return <Typography>Loading...</Typography>;

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        User Profile
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
          <Tab label="Personal Info" />
          <Tab label="Biometric Data" />
        </Tabs>
      </Box>

      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}

      {activeTab === 0 && (
        <Paper sx={{ p: 3, mt: 2 }}>
          <Typography variant="h5" gutterBottom>Personal Information</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Name"
                value={user?.name || ''}
                disabled
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                value={user?.email || ''}
                disabled
              />
            </Grid>
          </Grid>
        </Paper>
      )}

      {activeTab === 1 && (
        <Paper sx={{ p: 3, mt: 2 }}>
          <Typography variant="h5" gutterBottom>Biometric Data</Typography>
          
          <form onSubmit={handleBiometricSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Weight (kg)"
                  name="weight"
                  type="number"
                  value={biometricForm.weight}
                  onChange={handleInputChange}
                  inputProps={{ step: 0.1 }}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  fullWidth
                  label="Systolic BP"
                  name="systolic_bp"
                  type="number"
                  value={biometricForm.systolic_bp}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  fullWidth
                  label="Diastolic BP"
                  name="diastolic_bp"
                  type="number"
                  value={biometricForm.diastolic_bp}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Date"
                  name="measurement_date"
                  type="date"
                  value={biometricForm.measurement_date}
                  onChange={handleInputChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Notes"
                  name="notes"
                  multiline
                  rows={2}
                  value={biometricForm.notes}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <Button type="submit" variant="contained" disabled={loading}>
                  {loading ? 'Saving...' : 'Add Biometric Data'}
                </Button>
              </Grid>
            </Grid>
          </form>

          <Typography variant="h6" sx={{ mt: 3 }}>Recent Measurements</Typography>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {biometricData.slice(0, 5).map((data) => (
              <Grid item xs={12} sm={6} md={4} key={data.id}>
                <Card>
                  <CardContent>
                    <Typography variant="body2" color="text.secondary">
                      {data.measurement_date}
                    </Typography>
                    {data.weight && (
                      <Typography>Weight: {data.weight} kg</Typography>
                    )}
                    {data.systolic_bp && data.diastolic_bp && (
                      <Typography>BP: {data.systolic_bp}/{data.diastolic_bp}</Typography>
                    )}
                    {data.notes && (
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        {data.notes}
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>
      )}
    </Container>
  );
};

export default Profile;