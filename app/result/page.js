'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Box, Button, Container, CircularProgress, Typography } from '@mui/material';
import Image from 'next/image';

const ResultPage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const session_id = searchParams.get('session_id');
    const [loading, setLoading] = useState(true);
    const [session, setSession] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCheckoutSession = async () => {
            if (!session_id) return;

            try {
                const res = await fetch(`/api/checkout_session?session_id=${session_id}`);
                const sessionData = await res.json();
                if (res.ok) {
                    setSession(sessionData);
                } else {
                    setError(sessionData.error || 'Failed to retrieve session details.');
                }
            } catch (err) {
                console.error("Error fetching session:", err);
                setError("An error occurred while retrieving the session details.");
            } finally {
                setLoading(false);
            }
        };
        fetchCheckoutSession();
    }, [session_id]);

    if (loading) {
        return (
            <Container maxWidth="md" sx={{ textAlign: 'center', mt: 4 }}>
                <CircularProgress />
                <Typography variant='h6' sx={{ mt: 2 }}>Loading...</Typography>
            </Container>
        );
    }

    if (error) {
        return (
            <Container maxWidth="md" sx={{ textAlign: 'center', mt: 4 }}>
                <Typography variant='h6' sx={{ color: 'error.main' }}>{error}</Typography>
            </Container>
        );
    }

    return (
        <Box 
            sx={{ 
                height: '100vh', 
                width: '100vw', 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                flexDirection: 'column',
                textAlign: 'center',
                backgroundColor: '#f0f0f0',
            }}
        >
            {
                session && session.payment_status === 'paid' ? (
                    <>
                        <Image 
                            src="/party-popper.gif" 
                            alt="Party Popper Celebration" 
                            layout="fill" 
                            quality={100} 
                        />
                        <Box sx={{ position: 'relative', zIndex: 1, color: '#fff', textAlign: 'center' }}>
                            <Typography variant='h2' color="success.main" sx={{ fontWeight: 'bold', mt: 4 }}>Thank You for Your Purchase!</Typography>
                            <Typography variant='h6' color= "success.main" sx={{ fontWeight: 'bold', mt: 2 }}>
                                We have received your payment. You will receive an email confirming your order.
                            </Typography>
                            <Button variant="contained" color="primary" sx={{ mt: 4 }} onClick={() => router.push('/')}>
                                Go to Home
                            </Button>
                        </Box>
                    </>
                ) : (
                    <>
                        <Typography variant='h4' sx={{ fontWeight: 'bold', color: 'error.main' }}>Payment Failed</Typography>
                        <Box sx={{ mt: 2 }}>
                            <Typography variant='body1'>
                                Payment was not successful. Please try again.
                            </Typography>
                        </Box>
                        <Button variant="contained" color="secondary" sx={{ mt: 4 }} onClick={() => router.push('/pricing')}>
                            Go Back to Pricing
                        </Button>
                    </>
                )
            }
        </Box>
    );
};

export default ResultPage;

