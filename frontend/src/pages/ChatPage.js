// src/pages/ChatPage.js
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useChat } from '../hooks/useChat';
import { useParams } from 'react-router-dom';
import {Container, Paper, List, ListItem, ListItemText, TextField, Button, Box, Typography} from '@mui/material';

export default function ChatPage() {
  const { user } = useAuth();
  const { otherName } = useParams();             // get the :otherName from the URL
  const roomId = [user, otherName].sort().join('_');
  const { messages, sendMessage } = useChat(roomId, user);
  const [text, setText] = useState('');

  const handleSend = () => {
    if (!text.trim()) return;
    sendMessage(text);
    setText('');
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Chat with {otherName}
      </Typography>

      <Paper sx={{ p: 2, height: '70vh', display: 'flex', flexDirection: 'column' }}>
        <List sx={{ flexGrow: 1, overflowY: 'auto' }}>
          {messages.map((m, i) => (
            <ListItem
              key={i}
              sx={{ justifyContent: m.sender === user ? 'flex-end' : 'flex-start' }}
            >
              <ListItemText
                primary={m.text}
                secondary={`${m.sender} • ${new Date(m.timestamp).toLocaleTimeString()}`}
                sx={{
                  backgroundColor: m.sender === user ? 'primary.light' : 'grey.200',
                  borderRadius: 1,
                  p: 1,
                  maxWidth: '70%'
                }}
              />
            </ListItem>
          ))}
        </List>

        <Box sx={{ display: 'flex', mt: 1 }}>
          <TextField
            fullWidth
            placeholder="Type a message…"
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
          />
          <Button onClick={handleSend} variant="contained" sx={{ ml: 1 }}>
            Send
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
