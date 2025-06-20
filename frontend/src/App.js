import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import MatchesPage from './pages/MatchesPage';
import ComparePage from './pages/ComparePage';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box, 
  ThemeProvider, 
  Avatar,
  Chip,
  Fade,
  Slide
} from '@mui/material';
import { 
  Favorite, 
  ExitToApp, 
  PersonAdd, 
  Login, 
  Search, 
  Compare,
  Sparkle
} from '@mui/icons-material';
import { theme } from './theme';

// Navigation component that uses auth context
function Navigation() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Slide direction="down" in timeout={800}>
      <AppBar 
        position="static" 
        sx={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
          backdropFilter: 'blur(8px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.18)'
        }}
      >
        <Toolbar sx={{ py: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <Avatar 
              sx={{ 
                bgcolor: 'rgba(255, 255, 255, 0.2)', 
                mr: 2,
                background: 'linear-gradient(45deg, #FF6B6B, #FF8E8E)',
                animation: 'pulse 2s infinite'
              }}
            >
              💘
            </Avatar>
            <Typography 
              variant="h5" 
              sx={{ 
                fontWeight: 'bold',
                background: 'linear-gradient(45deg, #FFE66D, #FF6B6B)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
              }}
            >
              SoulSync
            </Typography>
          </Box>
          
          {user ? (
            // Show these buttons when user is logged in
            <Fade in timeout={1000}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Chip
                  avatar={<Avatar sx={{ bgcolor: '#4CAF50' }}>👋</Avatar>}
                  label={`Hey, ${user}!`}
                  clickable={false}
                  sx={{
                    background: 'linear-gradient(45deg, #4CAF50, #8BC34A)',
                    color: 'white',
                    fontWeight: 'bold',
                    mr: 2,
                    pointerEvents: 'none',
                    '& .MuiChip-avatar': { color: 'white' }
                  }}
                />
                <Button 
                  color="inherit" 
                  component={Link} 
                  to="/matches"
                  startIcon={<Search />}
                  sx={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '25px',
                    px: 3,
                    mx: 0.5,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.2)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
                    }
                  }}
                >
                  Find Matches
                </Button>
                <Button 
                  color="inherit" 
                  component={Link} 
                  to="/compare"
                  startIcon={<Compare />}
                  sx={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '25px',
                    px: 3,
                    mx: 0.5,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.2)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
                    }
                  }}
                >
                  Compare
                </Button>
                <Button 
                  color="inherit" 
                  onClick={handleLogout}
                  startIcon={<ExitToApp />}
                  sx={{
                    background: 'linear-gradient(45deg, #FF6B6B, #FF8E8E)',
                    borderRadius: '25px',
                    px: 3,
                    ml: 1,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #FF5252, #FF7676)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 15px rgba(255,107,107,0.4)'
                    }
                  }}
                >
                  Logout
                </Button>
              </Box>
            </Fade>
          ) : (
            // Show these buttons when user is not logged in
            <Fade in timeout={1000}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button 
                  color="inherit" 
                  component={Link} 
                  to="/register"
                  startIcon={<PersonAdd />}
                  sx={{
                    background: 'linear-gradient(45deg, #4CAF50, #8BC34A)',
                    borderRadius: '25px',
                    px: 3,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #66BB6A, #9CCC65)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 15px rgba(76,175,80,0.4)'
                    }
                  }}
                >
                  Join Now
                </Button>
                <Button 
                  color="inherit" 
                  component={Link} 
                  to="/login"
                  startIcon={<Login />}
                  sx={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '25px',
                    px: 3,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.2)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
                    }
                  }}
                >
                  Sign In
                </Button>
              </Box>
            </Fade>
          )}
        </Toolbar>
      </AppBar>
    </Slide>
  );
}

// Protected Route component
function ProtectedRoute({ children }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  return user ? children : null;
}

// Main App component
function AppContent() {
  return (
    <Router>
      <Box 
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(to bottom, #f5f7ff, #e6e9ff)',
          backgroundAttachment: 'fixed',
        }}
      >
        <Navigation />
        <Box sx={{ p: 3 }}>
          <Routes>
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route 
              path="/matches" 
              element={
                <ProtectedRoute>
                  <MatchesPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/compare" 
              element={
                <ProtectedRoute>
                  <ComparePage />
                </ProtectedRoute>
              } 
            />
            <Route path="/" element={<RegisterPage />} />
          </Routes>
        </Box>
      </Box>
      
      {/* Global Styles */}
      <style jsx global>{`
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        body {
          margin: 0;
          font-family: 'Roboto', sans-serif;
          overflow-x: hidden;
        }
        
        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(45deg, #667eea, #764ba2);
          border-radius: 10px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(45deg, #5a6fd8, #6a4190);
        }
      `}</style>
    </Router>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;