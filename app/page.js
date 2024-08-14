'use client'

import { Box, Button, TextField, Typography, Container, Paper } from '@mui/material';
import pantryProLogo from './pantry.png'
import { auth } from '@/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState} from "react";
import '@fontsource/poppins'
import InventoryUI from './inventoryUI';

export default function Home() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isSignUp, setIsSignUp] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setEmail('');
      setPassword('');
      setError(null)
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setEmail('');
      setPassword('');
      setIsSignUp(false); // Switch back to sign-in form
    } catch (err) {
      setError(err.message);
    }
  };

  const style = {
    container: {
      width: '100vw',
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      flexDirection: 'column',
      alignItems: 'center',
      backgroundImage: 'url("https://dri.es/files/cache/blog/interests-cabinet-1280w.jpg")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      color: '#fff', 
    },
    formContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: '2',
      alignItems: 'center',
      padding: '32px',
    },
  }

  return (
    <Box sx={style.container}>
      {user ? (
        <>
        <InventoryUI />
        </>
      ) : (
        <Container maxWidth="sm" sx={{ mt: 4}}>
          <Paper elevation={6} sx={style.formContainer}>
            <img
              src={pantryProLogo.src}
              alt="Pantry Pro Logo"
            />
            <Typography variant='h4' component="h1" sx={{ pt:2}} gutterBottom>
            {isSignUp ? 'Sign-Up' : 'Sign In'}
            </Typography>
            <Box component="form" onSubmit={isSignUp ? handleSignUp : handleSignIn}
              sx={{display:'flex', flexDirection:'column', gap: 2, width: '100%'}} >
                <TextField
                  type="email"
                  label="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  fullWidth
                  required
                />
                <TextField
                  type="password"
                  label="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  fullWidth
                  required
                />
                <Button
                  type="submit"
                  variant='contained'
                  color='primary'
                  fullWidth
                  sx={style.button}
                >
                  {isSignUp ? 'Sign Up' : 'Sign In'}
                </Button>
              </Box>
              <Button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError(null);
              }}
              color="primary"
              >
                {isSignUp ? 'Already have an account? Sign-In' : 'Don\'t have an account? Sign Up'}
              </Button>
              {error && (
                <Typography color="error" variant="body2">
                  {error}
                </Typography>
              )}
          </Paper>
        </Container>
      )}
    </Box>
  );
}