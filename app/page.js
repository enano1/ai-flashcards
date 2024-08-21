'use client';
import Image from "next/image";
import getStripe from "@/utils/get-stripe";
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import { AppBar, Container, Toolbar, Typography, Button,Box,Grid } from "@mui/material";
import Head from "next/head";
import Link from "next/link";

export default function Home() {
    const handleSubmit = async()=>{
                const checkoutSession = await fetch('/api/checkout_session',
                    {
                        method: 'POST',
                        headers: {
                            'origin':'http://localhost:3000',
                            'Content-Type': 'application/json'
                        },
                    })

                    const checkoutSessionJson = await checkoutSession.json()
                    if (checkoutSession.statusCode === 500)
                    {
                        console.error(checkoutSessionJson.message)
                        return
                    }
                    const stripe = new Stripe(`${process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY}`);
               
                    const {error} = await stripe.redirectToCheckout({
                        sessionId: checkoutSessionJson.id
                    })

                    if (error){
                        console.warn(error.message)
                    }
                }
    return (
        <Container
        maxWidth="lg"
        >
            <Head>
                <title>Flashcard Creator</title>
                <meta name="description" content="Create flashcard from your text" />

                
            </Head>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" style={{flexGrow:1}}> Flashcard SaaS</Typography>
                    <SignedOut>
                        <Button color="inherit" href="/sign-in">Login</Button>
                        <Button color="inherit" href="/sign-up">Sign Up</Button>
                    </SignedOut>

                    <SignedIn>
                        <UserButton />
                    </SignedIn>
                </Toolbar>

            </AppBar>

            <Box 

            sx={{
                textAlign: 'center',
                marginTop: 10,
            }}>
                <Typography variant="h2" gutterBottom>Welcome To  Flashcard SaaS</Typography>
                <Typography variant="h5"> The easiest way to make Flashcards from your text</Typography>
                <Link href="/generate" passHref>
                    <Button variant="contained" color="primary" sx={{ mt: 2 }}>
                             Get Started
                    </Button>
                </Link>
            </Box>
            

            <Box sx={{my:6}}>
                <Typography variant="h4" align="center" components="h2" gutterBottom>
                    Features
                </Typography>
                <Grid container spacing={4}>
                    <Grid item xs={4} md={4}>
                        <Typography variant = "h6">Easy Text Input</Typography>
                      
                        <Typography gutterBottom> 
                            {' '}
                            Simply input your text and let our software do the rest. Creating flashcards has never been easier.</Typography>

                    </Grid>
                    <Grid item xs={4} md={4}>
                        <Typography variant = "h6">Smart Flashcards</Typography>
                       
                        <Typography gutterBottom> 
                            {' '}
                            Our Ai intelligently breaks down your text into concise flashcards, perfect for studying</Typography>

                    </Grid>
                    <Grid item xs={4} md={4}>
                        <Typography variant = "h6">Accessible Anywhere</Typography>
                        
                        <Typography gutterBottom> 
                            {' '}
                            Access your flashcards from any device, at any time. study on the ease.</Typography>

                    </Grid>

                </Grid>

            </Box>

            <Box id="pricing">
                <Typography variant="h4" align="center" component="h2" gutterBottom>Pricing</Typography>
                <Grid container spacing={4}>
                    <Grid item xs={12} md={6}>
                        <Box sx={{
                            textAlign: 'center', 
                            my:2,
                            p:3,
                            border: '1px solid',
                            borderColor: 'grey.300',
                            }}>

                            <Typography variant="h5" gutterBottom>Basic</Typography>
                            <Typography variant="h6" gutterBottom>Free</Typography>
                            <Typography> 
                                {' '} 
                                Access to basic flashcard features and limited Storage.
                            </Typography>
                            <Button variant="contained" color="primary" sx={{mt:2}} href="/generate">Choose Basic</Button>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Box sx={{
                            textAlign: 'center', 
                            my:2,
                            p:3,
                            border: '1px solid',
                            borderColor: 'grey.300'
                            }}>
                            <Typography variant="h5" gutterBottom>Pro</Typography>
                            <Typography variant="h6" gutterBottom>$1 / month</Typography>
                            <Typography>Unlimited flashcard and storage.</Typography>
                            <Button variant="contained" color="primary" sx={{mt:2}} onClick={handleSubmit}>Choose Pro</Button>
                        </Box>
                    </Grid>
                    
                </Grid>

            </Box>

        </Container>
    )


}