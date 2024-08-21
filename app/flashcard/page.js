'use client'

import { useUser } from '@clerk/nextjs'
import { useEffect, useState } from 'react'
import { collection, doc, getDoc, getDocs } from 'firebase/firestore'
import { db } from '@/firebase'
import { Container, Grid, Card, CardActionArea, CardContent, Typography, Box } from "@mui/material";
import { useSearchParams } from 'next/navigation'

export default function Flashcard() {
    const { isLoaded, isSignedIn, user } = useUser();
    const [flashcards, setFlashcards] = useState([]);
    const [flipped, setFlipped] = useState([]);
    const [deckName, setDeckName] = useState('');

    const searchParams = useSearchParams();
    const search = searchParams.get('id');

    useEffect(() => {
        async function getFlashcard() {
            if (!search || !user) return
            const docRef = doc(collection(db, 'users'), user.id);
            const colRef = collection(docRef, search);

            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const deckData = docSnap.data();
                setDeckName(deckData.name || 'Flashcards');
            }

            const docs = await getDocs(colRef);
            const flashcards = [];

            docs.forEach((doc) => {
                flashcards.push({ id: doc.id, ...doc.data() });
            });

            setFlashcards(flashcards);
        }
        getFlashcard();
    }, [user, search]);

    const handleCardClick = (index) => {
        setFlipped((prev) => ({
            ...prev,
            [index]: !prev[index]
        }));
    };

    if (!isLoaded || !isSignedIn) {
        return <></>
    }

    return (
        <Container maxWidth='md'>
            <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 'bold', color: '#00796B' }}>
                {deckName} Preview
            </Typography>
            <Grid container spacing={4} sx={{ mt: 4, justifyContent: 'center', alignItems: 'center' }}>
                {flashcards.map((flashcard, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <Card sx={{ perspective: '1000px', height: '250px' }}>
                            <CardActionArea onClick={() => handleCardClick(index)} sx={{ height: '100%' }}>
                                <Box sx={{ 
                                    position: 'relative', 
                                    width: '100%', 
                                    height: '100%', 
                                    transformStyle: 'preserve-3d',
                                    transform: flipped[index] ? 'rotateY(180deg)' : 'rotateY(0deg)',
                                    transition: 'transform 0.6s',
                                }}>
                                    <CardContent
                                        sx={{
                                            position: 'absolute',
                                            width: '100%',
                                            height: '100%',
                                            backfaceVisibility: 'hidden',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            padding: 2,
                                            boxSizing: 'border-box',
                                            backgroundColor: '#ffffff',
                                            boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
                                            borderRadius: '8px',
                                        }}
                                    >
                                        <Typography variant='h5' component="div" sx={{ color: '#333' }}>
                                            {flashcard.front}
                                        </Typography>
                                    </CardContent>
                                    <CardContent
                                        sx={{
                                            position: 'absolute',
                                            width: '100%',
                                            height: '100%',
                                            backfaceVisibility: 'hidden',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            padding: 2,
                                            boxSizing: 'border-box',
                                            transform: 'rotateY(180deg)',
                                            backgroundColor: '#f8f9fa',
                                            boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
                                            borderRadius: '8px',
                                        }}
                                    >
                                        <Typography variant='h5' component="div" sx={{ color: '#333' }}>
                                            {flashcard.back}
                                        </Typography>
                                    </CardContent>
                                </Box>
                            </CardActionArea>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    )
}
