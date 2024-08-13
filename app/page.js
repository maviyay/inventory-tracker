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

  const handleSignOut = async () => {
    try {
      await signOut(auth);
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
      color: '#fff', // Change text color for better contrast
    },
    button: {
      backgroundColor: '#dc3545', // Primary color for buttons
      color: '#fff',
      '&:hover': {
        backgroundColor: '#c82333',
      },
      borderRadius: '8px',
    },
    formContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      alignItems: 'center',
      padding: '32px',
    },
  }

  return (
    <main className="flex min-h-screen bg-white">
      {user ? (
        <Box sx={style.container}>
        <InventoryUI />
        <Button vairant="contained" sx={style.button} onClick={handleSignOut}>
          Sign Out
        </Button>
        </Box>
      ) : (
        <div className='flex items-center justify-center p-20 position-relative'>
          <h1 className="font-[poppins] text-blue-500 font-extrabold text-3xl text-center pt-8">
        Hello!
        Welcome to PantryPro
        <br/>
        Sign up to get started!
        </h1>
        <div className="flex items-center justify-center w-full max-w-3xl max-h-screen bg-white"> 
        <img
          src={pantryProLogo.src}
          alt="Pantry Pro Logo"
          className="object-cover pr-20"
        />
        <div className={`flex items-center ${error == null ? "bg-gradient-to-b from-blue-100 to-green-100 p-2" : "bg-gradient-to-b from-red-600 to-pink-300 p-1"} rounded-lg shadow-lg w-full max-w-md`}>
          <div className="p-8 bg-white rounded-lg shadow-lg">
          <h1 className="font-[poppins] font-bold text-5xl text-blue-900 sm:text-5xl text-center mb-6">
            {isSignUp ? 'Sign-Up' : 'Sign In'}
          </h1>
          <form
            onSubmit={isSignUp ? handleSignUp : handleSignIn}
            className="flex flex-col items-center"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="p-3 font-[poppins] border border-gray-200 rounded mb-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-300"
              required
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="p-3 font-[poppins] border border-gray-200 rounded mb-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-300"
              required
            />
            <button
              type="submit"
              className="p-3 font-[poppins] w-full bg-slate-100 text-blue-900 font-bold rounded shadow-md hover:bg-blue-100 transition-all"
            >
              {isSignUp ? 'Sign Up' : 'Sign In'}
            </button>
          </form>
          <button
            onClick={() => {
              setIsSignUp(!isSignUp)
              setError(null)
            }}
            className="mt-4 font-[poppins] text-blue-500"
          >
            {isSignUp ? 'Already have an account? Sign-In' : 'Don\'t have an account? Sign Up'}
          </button>
          {error && <p className="text-red-500 font-[poppins] mt-1 text-sm">{error}</p>}
          </div>
          </div>
          </div>
          </div>
      )}
    </main>
  );
}
