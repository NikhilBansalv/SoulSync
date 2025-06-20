// src/pages/RegisterPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../api/api';
import {
  Container, Box, TextField, Button, Typography, Grid, Paper,
  Stepper, Step, StepLabel, Fade, Chip, Avatar, LinearProgress,
  InputAdornment, IconButton, Alert, Snackbar
} from '@mui/material';
import {
  Person, Cake, Psychology, Favorite, Sports, SmokingRooms,
  LocalBar, Visibility, VisibilityOff, CheckCircle
} from '@mui/icons-material';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '', age: '', sex: '', openness: '', conscientiousness: '', 
    extraversion: '', agreeableness: '', neuroticism: '', hobbies: '',
    smoking: '', drinking: '', password: ''
  });
  
  const [activeStep, setActiveStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
  
  const steps = ['Personal Info', 'Personality Traits', 'Lifestyle'];
  
  const getStepProgress = () => {
    const stepFields = [
      ['name', 'age', 'sex', 'password'],
      ['openness', 'conscientiousness', 'extraversion', 'agreeableness', 'neuroticism'],
      ['hobbies', 'smoking', 'drinking']
    ];
    
    const currentFields = stepFields[activeStep];
    const filledFields = currentFields.filter(field => form[field]);
    return (filledFields.length / currentFields.length) * 100;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Validate personality trait fields (1-5 range)
    const personalityFields = ['openness', 'conscientiousness', 'extraversion', 'agreeableness', 'neuroticism'];
    
    if (personalityFields.includes(name)) {
      // Only allow numbers between 1-5
      const numValue = parseInt(value);
      if (value === '' || (numValue >= 1 && numValue <= 5)) {
        setForm({ ...form, [name]: value });
      }
      // If invalid, don't update the field
      return;
    }
    
    // Validate age field (reasonable range)
    if (name === 'age') {
      const numValue = parseInt(value);
      if (value === '' || (numValue >= 1 && numValue <= 120)) {
        setForm({ ...form, [name]: value });
      }
      return;
    }
    
    // For all other fields, update normally
    setForm({ ...form, [name]: value });
  };

  const handleNext = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1);
    }
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  };
  
  const validateForm = () => {
    const errors = [];
    
    // Check required fields
    if (!form.name.trim()) errors.push('Name is required');
    if (!form.age || form.age < 1 || form.age > 120) errors.push('Valid age (1-120) is required');
    if (!form.sex.trim()) errors.push('Gender is required');
    if (!form.password.trim()) errors.push('Password is required');
    if (!form.hobbies.trim()) errors.push('At least one hobby is required');
    if (!form.smoking.trim()) errors.push('Smoking preference is required');
    if (!form.drinking.trim()) errors.push('Drinking preference is required');
    
    // Check personality traits
    const personalityFields = [
      { key: 'openness', name: 'Openness' },
      { key: 'conscientiousness', name: 'Conscientiousness' },
      { key: 'extraversion', name: 'Extraversion' },
      { key: 'agreeableness', name: 'Agreeableness' },
      { key: 'neuroticism', name: 'Neuroticism' }
    ];
    
    personalityFields.forEach(field => {
      const value = parseInt(form[field.key]);
      if (!form[field.key] || value < 1 || value > 5) {
        errors.push(`${field.name} must be between 1-5`);
      }
    });
    
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if(submitting) return;
    
    // Validate form before submitting
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setNotification({
        open: true,
        message: `Please fix the following errors: ${validationErrors.join(', ')}`,
        severity: 'error'
      });
      return;
    }
    
    setSubmitting(true);
    
    try {
      // Process hobbies - filter out empty strings and trim whitespace
      const processedHobbies = form.hobbies
        ? form.hobbies.split(',')
            .map(h => h.trim())
            .filter(h => h.length > 0)
        : [];

      const profile = {
        ...form,
        age: parseInt(form.age) || 0,
        openness: parseInt(form.openness) || 0,
        conscientiousness: parseInt(form.conscientiousness) || 0,
        extraversion: parseInt(form.extraversion) || 0,
        agreeableness: parseInt(form.agreeableness) || 0,
        neuroticism: parseInt(form.neuroticism) || 0,
        hobbies: processedHobbies,
        smoking: form.smoking.trim() || '',
        drinking: form.drinking.trim() || ''
      };

      console.log('Submitting profile:', profile); // Debug log

      await registerUser(profile);
      
      setNotification({
        open: true,
        message: "Registration successful! Welcome aboard! 🎉",
        severity: 'success'
      });

      // Redirect to login page after 2 seconds
      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (err) {
      console.error('Registration error:', err); // Debug log
      setNotification({
        open: true,
        message: err.response?.data?.detail || err.message || "Something went wrong. Please try again.",
        severity: 'error'
      });
    } finally {
      setSubmitting(false); // This was missing!
    }
  };

  const renderPersonalInfo = () => (
    <Fade in timeout={500}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            name="name"
            label="Full Name"
            value={form.name}
            onChange={handleChange}
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Person color="primary" />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2 }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            name="age"
            label="Age"
            type="number"
            value={form.age}
            onChange={handleChange}
            required
            inputProps={{ min: 1, max: 120 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Cake color="primary" />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            name="sex"
            label="Gender"
            value={form.sex}
            onChange={handleChange}
            required
            placeholder="e.g., Male, Female, Other"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            name="password"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            value={form.password}
            onChange={handleChange}
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Grid>
      </Grid>
    </Fade>
  );

  const renderPersonalityTraits = () => (
    <Fade in timeout={500}>
      <Box>
        <Typography variant="h6" gutterBottom color="primary" sx={{ mb: 3 }}>
          <Psychology sx={{ mr: 1, verticalAlign: 'middle' }} />
          Rate yourself on these personality traits (1-5 scale)
        </Typography>
        <Grid container spacing={3}>
          {[
            ['openness', 'Openness to Experience', '🌟'],
            ['conscientiousness', 'Conscientiousness', '📋'],
            ['extraversion', 'Extraversion', '🎉'],
            ['agreeableness', 'Agreeableness', '🤝'],
            ['neuroticism', 'Neuroticism', '😥']
          ].map(([key, label, emoji]) => (
            <Grid item xs={12} sm={6} key={key}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Chip 
                  label={emoji} 
                  size="small" 
                  sx={{ mr: 1, minWidth: 40 }}
                />
                <Typography variant="body2" color="textSecondary">
                  {label}
                </Typography>
              </Box>
              <TextField
                fullWidth
                name={key}
                type="number"
                inputProps={{ min: 1, max: 5 }}
                value={form[key]}
                onChange={handleChange}
                placeholder="1-5"
                required
                helperText={form[key] && (parseInt(form[key]) < 1 || parseInt(form[key]) > 5) 
                  ? "Value must be between 1-5" 
                  : ""}
                error={form[key] && (parseInt(form[key]) < 1 || parseInt(form[key]) > 5)}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Fade>
  );

  const renderLifestyle = () => (
    <Fade in timeout={500}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            name="hobbies"
            label="Hobbies & Interests"
            value={form.hobbies}
            onChange={handleChange}
            placeholder="e.g., Reading, Swimming, Cooking, Gaming"
            multiline
            rows={3}
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Sports color="primary" />
                </InputAdornment>
              ),
            }}
            helperText="Separate multiple hobbies with commas"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            name="smoking"
            label="Smoking"
            value={form.smoking}
            onChange={handleChange}
            placeholder="yes/no"
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SmokingRooms color="primary" />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            name="drinking"
            label="Drinking"
            value={form.drinking}
            onChange={handleChange}
            placeholder="yes/occasionally/no"
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LocalBar color="primary" />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
      </Grid>
    </Fade>
  );

  const renderStepContent = () => {
    switch (activeStep) {
      case 0: return renderPersonalInfo();
      case 1: return renderPersonalityTraits();
      case 2: return renderLifestyle();
      default: return null;
    }
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={6} sx={{ padding: 4, marginTop: 4, borderRadius: 3 }}>
        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
          {steps.map((label, index) => (
            <Step key={label}>
              <StepLabel 
                StepIconComponent={({ active, completed }) => (
                  <Avatar 
                    sx={{ 
                      bgcolor: completed ? 'success.main' : active ? 'primary.main' : 'grey.300',
                      width: 32, 
                      height: 32,
                      fontSize: '0.875rem'
                    }}
                  >
                    {completed ? <CheckCircle /> : index + 1}
                  </Avatar>
                )}
              >
                {label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>

        <LinearProgress 
          variant="determinate" 
          value={getStepProgress()} 
          sx={{ mb: 3, height: 8, borderRadius: 4 }}
        />

        <Box component="form" onSubmit={handleSubmit}>
          {renderStepContent()}

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
              variant="outlined"
              size="large"
            >
              Back
            </Button>
            
            <Box sx={{ flex: '1 1 auto' }} />
            
            {activeStep === steps.length - 1 ? (
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={submitting}
                sx={{
                  background: submitting 
                    ? 'linear-gradient(45deg, #ccc 30%, #999 90%)' 
                    : 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
                  boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
                  px: 4
                }}
              >
                {submitting ? 'Registering...' : 'Complete Registration'}
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                variant="contained"
                size="large"
                sx={{ px: 4 }}
              >
                Next
              </Button>
            )}
          </Box>
        </Box>
      </Paper>

      <Snackbar
        open={notification.open}
        autoHideDuration={2000}
        onClose={() => setNotification({ ...notification, open: false })}
      >
        <Alert 
          severity={notification.severity} 
          sx={{ width: '100%' }}
          onClose={() => setNotification({ ...notification, open: false })}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default RegisterPage;