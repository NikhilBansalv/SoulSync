import React, { useState } from 'react';
import { getUsernameCompatibility } from '../api/api';
import { Card, Typography, Button, Box } from '@mui/material';

export default function UsernameMessageCard({ user1, user2 }) {
  const [message, setMessage] = useState(null);

  const checkCompatibility = async () => {
    const res = await getUsernameCompatibility(user1, user2);
    setMessage(res.data.message);
  };

  return (
    <Box sx={{ my: 3, textAlign: 'center' }}>
      <Button 
        onClick={checkCompatibility} 
        variant="contained" 
        color="secondary"
        sx={{ mb: 2 }}
      >
        🌟 Check Username Compatibility
      </Button>

      {message && (
        <Card 
          sx={{ p: 3, background: '#fff3e0', borderRadius: 3, maxWidth: 400, mx: 'auto' }}
          elevation={3}
        >
          <Typography variant="h6" gutterBottom>
            ✨ Compatibility Message ✨
          </Typography>
          <Typography>{message}</Typography>
        </Card>
      )}
    </Box>
  );
}
