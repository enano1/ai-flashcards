'use client';
import Image from "next/image";
import { getStripe } from '@/utils/get-stripe';
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import { AppBar, Container, Toolbar, Typography, Button, Box, Grid, CssBaseline, Divider } from "@mui/material";
import Head from "next/head";
import Link from "next/link";
import { ThemeProvider, createTheme } from '@mui/material/styles';
//
export default function Home() {
    const theme = createTheme({
        palette: {
            mode: 'dark', // Set dark mode
            primary: {
                main: '#1976d2',
            },
            secondary: {
                main: '#dc004e',
            },
            background: {
                default: '#121212', // Dark background color
                paper: '#1e1e1e',   // Dark color for paper elements
            },
            text: {
                primary: '#ffffff', // White text
                secondary: '#b0b0b0', // Grey text for secondary content
            },
        },
        typography: {
            fontFamily: 'Roboto, sans-serif',
        },
    });

    const handleSubmit = async () => {
        const checkoutSession = await fetch('/api/checkout_session', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const checkoutSessionJson = await checkoutSession.json();
        if (checkoutSession.statusCode === 500) {
            console.error(checkoutSessionJson.message);
            return;
        }

        const stripe = await getStripe();
        const { error } = await stripe.redirectToCheckout({
            sessionId: checkoutSessionJson.id,
        });

        if (error) {
            console.warn(error.message);
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Container maxWidth="lg">
                <Head>
                    <title>Flashcard Creator</title>
                    <meta name="description" content="Create flashcards from your text" />
                </Head>
                <AppBar position="static" elevation={0} color="transparent">
                    <Toolbar>
                        <Link href="/" passHref>
                            <Typography variant="h6" sx={{ fontWeight: 700, cursor: 'pointer', color: 'white', textDecoration: 'none' }}>
                                Flashcard SaaS
                            </Typography>
                        </Link>
                        <Box sx={{ flexGrow: 1 }} />
                        <SignedIn>
                            <Link href="/flashcards" passHref>
                                <Button sx={{ textWeight: 700 ,color: 'white', textTransform: 'none', textDecoration: 'none', '&:hover': { color: 'white' } }}>
                                    View My Flashcards
                                </Button>
                            </Link>
                            <UserButton />
                        </SignedIn>
                        <SignedOut>
                            <Button color="primary" href="/sign-in">Login</Button>
                            <Button color="secondary" href="/sign-up" sx={{ ml: 2 }}>Sign Up</Button>
                        </SignedOut>
                    </Toolbar>
                </AppBar>

                <Box sx={{
                    textAlign: 'center',
                    mt: 8,
                    mb: 6,
                }}>
                    <Typography variant="h2" gutterBottom sx={{ fontWeight: 700 }}>
                        Welcome To Flashcard SaaS
                    </Typography>
                    <Typography variant="h5" sx={{ color: 'text.secondary', mb: 4 }}>
                        The easiest way to create flashcards from your text
                    </Typography>
                    <Link href="/generate" passHref>
                        <Button variant="contained" color="primary" size="large">
                            Get Started
                        </Button>
                    </Link>
                </Box>

                <Divider variant="middle" sx={{ my: 6 }} />

                <Box sx={{ my: 6 }}>
                    <Typography variant="h4" align="center" gutterBottom>
                        Features
                    </Typography>
                    <Grid container spacing={4}>
                        <Grid item xs={12} md={4}>
                            <Box sx={{ textAlign: 'center' }}>
                                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                    Easy Text Input
                                </Typography>
                                <Typography variant="body1" sx={{ color: 'text.secondary', mt: 1 }}>
                                    Simply input your text and let our software do the rest. Creating flashcards has never been easier.
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Box sx={{ textAlign: 'center' }}>
                                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                    Smart Flashcards
                                </Typography>
                                <Typography variant="body1" sx={{ color: 'text.secondary', mt: 1 }}>
                                    Our AI intelligently breaks down your text into concise flashcards, perfect for studying.
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Box sx={{ textAlign: 'center' }}>
                                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                    Accessible Anywhere
                                </Typography>
                                <Typography variant="body1" sx={{ color: 'text.secondary', mt: 1 }}>
                                    Access your flashcards from any device, at any time. Study on the go with ease.
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>

                <Divider variant="middle" sx={{ my: 6 }} />

                <Box id="pricing" sx={{ my: 6 }}>
                    <Typography variant="h4" align="center" gutterBottom>
                        Pricing
                    </Typography>
                    <Grid container spacing={4}>
                        <Grid item xs={12} md={6}>
                            <Box sx={{
                                textAlign: 'center',
                                my: 2,
                                p: 4,
                                border: '1px solid',
                                borderColor: 'grey.800', // Adjusted border color for dark theme
                                borderRadius: 2,
                                boxShadow: 2,
                            }}>
                                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                                    Basic
                                </Typography>
                                <Typography variant="h6" gutterBottom>
                                    Free
                                </Typography>
                                <Typography variant="body1" sx={{ color: 'text.secondary', mb: 2 }}>
                                    Access to basic flashcard features and limited storage.
                                </Typography>
                                <Button variant="contained" color="primary" href="/generate">
                                    Choose Basic
                                </Button>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Box sx={{
                                textAlign: 'center',
                                my: 2,
                                p: 4,
                                border: '1px solid',
                                borderColor: 'grey.800', // Adjusted border color for dark theme
                                borderRadius: 2,
                                boxShadow: 2,
                            }}>
                                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                                    Pro
                                </Typography>
                                <Typography variant="h6" gutterBottom>
                                    $10 / month
                                </Typography>
                                <Typography variant="body1" sx={{ color: 'text.secondary', mb: 2 }}>
                                    Unlimited flashcards and storage.
                                </Typography>
                                <Button variant="contained" color="primary" onClick={handleSubmit}>
                                    Choose Pro
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            </Container>
        </ThemeProvider>
    );
}
