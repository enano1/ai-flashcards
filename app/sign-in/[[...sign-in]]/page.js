'use client';
import { useEffect, useState } from 'react';
import { Container, AppBar, Toolbar, Typography, Button, Box } from '@mui/material';   
import Link from 'next/link';
import { SignIn, SignedIn, SignedOut } from '@clerk/nextjs';

export default function SignInPage() {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <AppBar position="static" color="transparent" elevation={0}>
                <Toolbar>
                    <Typography variant='h6' sx={{ flexGrow: 1, fontWeight: 700 }}>
                        Flashcard SaaS
                    </Typography>
                    {isMounted && (
                        <>
                            <SignedOut>
                                <Button color="inherit">
                                    <Link href="/sign-in" passHref>
                                        Login
                                    </Link>
                                </Button>
                            </SignedOut>
                            <SignedIn>
                                <Button color="inherit">
                                    <Link href="/sign-up" passHref>
                                        Sign Up
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
    );
}
