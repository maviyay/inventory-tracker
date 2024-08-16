'use client'

import { Box, Button, Typography, Container, Paper } from '@mui/material';
import pantryProLogo from './pantry.png'
import { useAuth, SignIn, SignUp } from '@clerk/nextjs';
import { auth } from '@/firebase';
import { useState} from "react";
import '@fontsource/poppins'
import InventoryUI from './inventoryUI';

export default function Home() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isSignedIn, signOut] = useAuth();

  

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
      {isSignedIn ? (
        <>
        <InventoryUI />
        <Button onClick={() => signOut()}
          variant='contained'
          color='primary'
          sx={{ mt: 2}}>
          Sign Out
        </Button>
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
            {isSignUp ? (
              <SignUp />
            ) : (
              <SignIn />
            )}
              <Button
              onClick={() => setIsSignUp(!isSignUp)}
                color="primary"
                sx={{ mt:2 }}
              >
                {isSignUp ? 'Already have an account? Sign-In' : 'Don\'t have an account? Sign Up'}
              </Button>
          </Paper>
        </Container>
      )}
    </Box>
  );
}