import React, { useState } from 'react';
import { getMatches } from '../api/api';
import { Link } from 'react-router-dom';
import { 
  Container, 
  TextField, 
  Button, 
  Typography, 
  Grid, 
  Paper,
  Card,
  CardContent,
  Avatar,
  Box,
  Chip,
  LinearProgress
} from '@mui/material';
import { Person, Stars, Favorite } from '@mui/icons-material';

// Enhanced MatchCard component with cute, compact styling
function MatchCard({ name, score }) {
  const getScoreColor = (score) => {
    if (score >= 80) return '#ff6b9d'; // Soft pink
    if (score >= 60) return '#ffa726'; // Warm orange
    return '#42a5f5'; // Sky blue
  };

  const getScoreEmoji = (score) => {
    if (score >= 90) return '💖';
    if (score >= 80) return '💕';
    if (score >= 60) return '💛';
    return '💙';
  };

  return (
    <Card 
      sx={{ 
        height: 'auto',
        maxWidth: 220,
        mx: 'auto',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          transform: 'scale(1.05)',
          boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
        },
        background: 'linear-gradient(135deg, #fff5f8 0%, #f0f8ff 100%)',
        borderRadius: 3,
        border: '2px solid',
        borderColor: getScoreColor(score),
      }}
    >
      <CardContent sx={{ textAlign: 'center', p: 2 }}>
        <Avatar
          sx={{
            width: 48,
            height: 48,
            mx: 'auto',
            mb: 1,
            bgcolor: getScoreColor(score),
            fontSize: '1.2rem',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}
        >
          {name.charAt(0).toUpperCase()}
        </Avatar>
        
        <Typography variant="subtitle1" component="h3" sx={{ 
          fontWeight: 600, 
          mb: 1,
          fontSize: '0.95rem',
          color: '#333'
        }}>
          {name}
        </Typography>
        
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          bgcolor: 'rgba(255,255,255,0.7)',
          borderRadius: 2,
          py: 0.5,
          px: 1,
          mb: 1
        }}>
          <Typography variant="h6" sx={{ 
            fontWeight: 'bold', 
            color: getScoreColor(score),
            mr: 0.5,
            fontSize: '1.1rem'
          }}>
            {score}%
          </Typography>
          <Typography sx={{ fontSize: '1.2rem' }}>
            {getScoreEmoji(score)}
          </Typography>
        </Box>
        
        <LinearProgress
          variant="determinate"
          value={score}
          sx={{
            height: 6,
            borderRadius: 3,
            backgroundColor: 'rgba(0,0,0,0.08)',
            '& .MuiLinearProgress-bar': {
              backgroundColor: getScoreColor(score),
              borderRadius: 3,
            },
          }}
        />
      </CardContent>
    </Card>
  );
}

export default function MatchesPage() {
  const [name, setName] = useState('');
  const [matches, setMatches] = useState([]);
  const [error, setError] = useState('');

  const handleFetch = async () => {
    setError('');
    try {
      const res = await getMatches(name);
      setMatches(res.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to fetch matches');
    }
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Paper 
        sx={{ 
          p: 4, 
          mb: 4,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          borderRadius: 2
        }}
      >
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, textAlign: 'center' }}>
          💕 Find Your Perfect Match
        </Typography>
        <Typography variant="subtitle1" sx={{ textAlign: 'center', mb: 3, opacity: 0.9 }}>
          Discover your compatibility with others
        </Typography>

        <Grid container spacing={2} alignItems="center" justifyContent="center">
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              label="Your Username"
              value={name}
              onChange={e => setName(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  '& fieldset': {
                    borderColor: 'rgba(255,255,255,0.3)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(255,255,255,0.5)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'white',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: 'rgba(255,255,255,0.8)',
                },
                '& .MuiOutlinedInput-input': {
                  color: 'white',
                },
              }}
            />
          </Grid>
          <Grid item>
            <Button 
              variant="contained" 
              onClick={handleFetch}
              size="large"
              sx={{
                backgroundColor: 'rgba(255,255,255,0.2)',
                color: 'white',
                fontWeight: 600,
                px: 4,
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.3)',
                },
              }}
            >
              Search Matches
            </Button>
          </Grid>
        </Grid>

        {error && (
          <Typography 
            sx={{ 
              mt: 2, 
              textAlign: 'center',
              backgroundColor: 'rgba(255,255,255,0.1)',
              p: 2,
              borderRadius: 1,
              border: '1px solid rgba(255,255,255,0.2)'
            }}
          >
            ⚠️ {error}
          </Typography>
        )}
      </Paper>

      {matches.length > 0 ? (
        <>
          <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
            Your Matches ({matches.length})
          </Typography>
          <Grid container spacing={2} justifyContent="center">
            {matches.map(m => (
              <Grid item key={m.name}>
                <MatchCard name={m.name} score={m.score} />
                <Button
                  component={Link}
                  to={`/chat/${encodeURIComponent(m.name)}`}
                  variant="outlined"
                  size="small"
                  sx={{ mt: 1 }}
                >
                  Chat
                </Button>
              </Grid>
            ))}
          </Grid>
        </>
      ) : (
        <Paper sx={{ p: 6, textAlign: 'center', mt: 4 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            🔍 Ready to find your matches?
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Enter your username above to discover your compatibility scores!
          </Typography>
        </Paper>
      )}
    </Container>
  );
}