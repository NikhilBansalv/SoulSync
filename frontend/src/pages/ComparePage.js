import React, { useState } from 'react';
import {
  Container, Paper, Typography, TextField, Button,
  Grid, Box, Snackbar, Alert, Divider, Avatar, Card, CardContent
} from '@mui/material';
import { compareProfiles } from '../api/api';

const initialProfile = {
  name: '',
  age: '', openness: '', conscientiousness: '',
  extraversion: '', agreeableness: '', neuroticism: '',
  hobbies: '', smoking: '', drinking: ''
};

export default function ComparePage() {
  const [profile1, setProfile1] = useState(initialProfile);
  const [profile2, setProfile2] = useState(initialProfile);
  const [score, setScore] = useState(null);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'error' });

  const handleChange = (profileKey, field, value) => {
    const updater = profileKey === 'profile1' ? setProfile1 : setProfile2;
    updater(prev => ({ ...prev, [field]: value }));
  };

  const handleCompare = async () => {
    try {
      const formatted1 = formatProfile(profile1);
      const formatted2 = formatProfile(profile2);

      const res = await compareProfiles({ profile1: formatted1, profile2: formatted2 });
      setScore(res.data.score.toFixed(2));
    } catch (err) {
      setNotification({
        open: true,
        message: err.response?.data?.detail || 'Comparison failed',
        severity: 'error'
      });
    }
  };

  const formatProfile = (profile) => ({
    ...profile,
    age: parseInt(profile.age),
    openness: parseInt(profile.openness),
    conscientiousness: parseInt(profile.conscientiousness),
    extraversion: parseInt(profile.extraversion),
    agreeableness: parseInt(profile.agreeableness),
    neuroticism: parseInt(profile.neuroticism),
    hobbies: profile.hobbies.split(',').map(h => h.trim())
  });

  const getScoreColor = (score) => {
    const numScore = parseFloat(score);
    if (numScore >= 0.8) return '#ff6b9d';
    if (numScore >= 0.6) return '#ffa726';
    return '#42a5f5';
  };

  const getScoreMessage = (score) => {
    const numScore = parseFloat(score);
    if (numScore >= 0.9) return 'Perfect Match';
    if (numScore >= 0.8) return 'Great Match';
    if (numScore >= 0.6) return 'Good Match';
    return 'Potential Match';
  };

  const renderProfileCard = (profileKey, data, title, color) => (
    <Card 
      sx={{ 
        background: `linear-gradient(135deg, ${color}15 0%, ${color}08 100%)`,
        border: `2px solid ${color}30`,
        borderRadius: 3,
        height: '100%'
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Avatar
            sx={{
              bgcolor: color,
              color: 'white',
              mr: 2,
              width: 48,
              height: 48,
              fontSize: '1.2rem',
              fontWeight: 600
            }}
          >
            {data.name ? data.name.charAt(0).toUpperCase() : title.slice(-1)}
          </Avatar>
          <Typography variant="h6" sx={{ color: color, fontWeight: 600 }}>
            {title}
          </Typography>
        </Box>

        <Grid container spacing={2}>
          {Object.keys(initialProfile).map(field => (
            <Grid item xs={12} sm={6} key={field}>
              <TextField
                fullWidth
                size="small"
                label={field === 'name' ? 'Name' : field.charAt(0).toUpperCase() + field.slice(1)}
                value={data[field]}
                onChange={e => handleChange(profileKey, field, e.target.value)}
                placeholder={field === 'hobbies' ? 'Reading, Gaming, Music' : ''}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'rgba(255,255,255,0.7)',
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.9)',
                    },
                    '&.Mui-focused': {
                      backgroundColor: 'white',
                    }
                  }
                }}
              />
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );

  return (
    <Container sx={{ mt: 4, mb: 4 }}>
      <Paper 
        sx={{ 
          p: 4, 
          borderRadius: 4,
          background: 'linear-gradient(135deg, #f8f9ff 0%, #fff5f8 100%)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
        }} 
      >
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 600, color: '#333', mb: 1 }}>
            Compatibility Checker
          </Typography>
        </Box>

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            {renderProfileCard('profile1', profile1, 'Person 1', '#ff6b9d')}
          </Grid>
          
          <Grid item xs={12} md={6}>
            {renderProfileCard('profile2', profile2, 'Person 2', '#42a5f5')}
          </Grid>
        </Grid>

        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Button 
            variant="contained" 
            size="large"
            onClick={handleCompare}
            sx={{
              background: 'linear-gradient(45deg, #ff6b9d 30%, #42a5f5 90%)',
              color: 'white',
              fontWeight: 600,
              px: 4,
              py: 1.5,
              borderRadius: 3,
              boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
              '&:hover': {
                background: 'linear-gradient(45deg, #e91e63 30%, #2196f3 90%)',
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 20px rgba(0,0,0,0.3)',
              },
              transition: 'all 0.3s ease'
            }}
          >
            Check Compatibility
          </Button>
        </Box>

        {score !== null && (
          <Card 
            sx={{ 
              mt: 4, 
              textAlign: 'center',
              background: `linear-gradient(135deg, ${getScoreColor(score)}20 0%, ${getScoreColor(score)}10 100%)`,
              border: `2px solid ${getScoreColor(score)}40`,
              borderRadius: 3
            }}
          >
            <CardContent sx={{ py: 3 }}>
              <Typography variant="h3" sx={{ 
                fontWeight: 'bold', 
                color: getScoreColor(score),
                mb: 1
              }}>
                {(parseFloat(score)).toFixed(1)}%
              </Typography>
              <Typography variant="h6" sx={{ 
                color: getScoreColor(score), 
                fontWeight: 600,
                mb: 1
              }}>
                {getScoreMessage(score)}
              </Typography>
              {profile1.name && profile2.name && (
                <Typography variant="body1" color="text.secondary">
                  {profile1.name} & {profile2.name}
                </Typography>
              )}
            </CardContent>
          </Card>
        )}
      </Paper>

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={() => setNotification({ ...notification, open: false })}
      >
        <Alert
          severity={notification.severity}
          sx={{ 
            width: '100%',
            borderRadius: 2
          }}
          onClose={() => setNotification({ ...notification, open: false })}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}