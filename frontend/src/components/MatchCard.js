import React from 'react';
import { Card, CardHeader, Avatar, CardContent, Typography, Rating } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';

export default function MatchCard({ name, score }) {
  return (
    <Card sx={{ maxWidth: 345, m: 1 }}>
      <CardHeader
        avatar={
          <Avatar>
            <PersonIcon />
          </Avatar>
        }
        title={name}
        subheader={`Score: ${score.toFixed(2)}%`}
      />
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {score >= 75
            ? 'High compatibility!'
            : score >= 50
            ? 'Moderate compatibility'
            : 'Low compatibility'}
        </Typography>
        <Rating
          value={Math.round(score / 20)}  // convert 0–100 to 0–5 stars
          readOnly
          size="small"
        />
      </CardContent>
    </Card>
  );
}
