'use client';
import { useEffect, useState } from 'react';
import { Container, AppBar, Toolbar, Typography, Button, Box } from '@mui/material';   
import Link from 'next/link';
import { SignIn, SignedIn, SignedOut } from '@clerk/nextjs';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';

export default function SignInPage() {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const theme = createTheme({
        palette: {
            mode: 'dark',
            primary: {
                main: '#1976d2',
            },
            secondary: {
                main: '#dc004e',
            },
            background: {
                default: '#121212',
                paper: '#1e1e1e',
            },
            text: {
                primary: '#ffffff',
                secondary: '#b0b0b0',
            },
        },
        typography: {
            fontFamily: 'Roboto, sans-serif',
        },
    });

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Container maxWidth="md" sx={{ mt: 4, bgcolor: 'background.default', color: 'text.primary' }}>
                <AppBar position="static" color="transparent" elevation={0}>
                    <Toolbar>
                        <Link href="/" passHref>
                            <Typography
                                variant='h6'
                                sx={{
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    color: 'white',
                                    textDecoration: 'none',
                                    '&:hover': {
                                        color: 'white',
                                    }
                                }}
                            >
                                Flashcard SaaS
                            </Typography>
                        </Link>
                        <Box sx={{ flexGrow: 1 }} />
                        {isMounted && (
                            <>
                                <SignedOut>
                                    <Button color="inherit" sx={{ color: 'white', textTransform: 'none' }}>
                                        <Link href="/sign-in" passHref>
                                            <Typography sx={{ color: 'white', textDecoration: 'none', '&:hover': { color: 'white' } }}>
                                                Login
                                            </Typography>
                                        </Link>
                                    </Button>
                                </SignedOut>
                                <SignedIn>
                                    <Button color="inherit" sx={{ color: 'white', textTransform: 'none' }}>
                                        <Link href="/sign-up" passHref>
                                            <Typography sx={{ color: 'white', textDecoration: 'none', '&:hover': { color: 'white' } }}>
                                                Sign Up
                                            </Typography>
                                        </Link>
                                    </Button>
                                </SignedIn>
                            </>
                        )}
                    </Toolbar>
                </AppBar>

                <Box display='flex' flexDirection='column' alignItems='center' justifyContent='center' sx={{ mt: 6 }}>
                    <Typography variant='h4' gutterBottom sx={{ fontWeight: 700 }}>
                        Sign In
                    </Typography>
                    {isMounted && <SignIn />}
                </Box>
            </Container>
        </ThemeProvider>
    );
}
