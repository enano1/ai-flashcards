'use client'
import { useUser } from '@clerk/nextjs'
import { useEffect, useState } from 'react'
import { Container, Grid, Card, CardActionArea, CardContent, Typography } from '@mui/material'
import { collection, doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '@/firebase'
import { useRouter } from 'next/navigation'

export default function Flashcards() {
    const { isLoaded, isSignedIn, user } = useUser()
    const [flashcards, setFlashcards] = useState([])
    const router = useRouter()

    useEffect(() => {
        async function getFlashcards() {
            if (!user) return
            const docRef = doc(collection(db, 'users'), user.id)

            const docSnap = await getDoc(docRef)
            if (docSnap.exists()) {
                const collections = docSnap.data().flashcards || []
                setFlashcards(collections)
            } else {
                await setDoc(docRef, { flashcards: [] })
            }
        }
        getFlashcards()
    }, [user])

    if (!isLoaded || !isSignedIn) {
        return <></>
    }

    const handleCardClick = (id) => {
        router.push(`/flashcard?id=${id}`)
    }

    return (
        <Container maxWidth='lg' sx={{ mt: 4 }}>
            <Grid container spacing={3} justifyContent="center" alignItems="center">
                {flashcards.map((flashcard, index) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                        <Card 
                            sx={{ 
                                p: 2, 
                                height: '150px',
                                display: 'flex', 
                                flexDirection: 'column', 
                                justifyContent: 'center', 
                                alignItems: 'center',
                                boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                                borderRadius: '12px',
                                transition: 'transform 0.2s ease-in-out',
                                '&:hover': {
                                    transform: 'scale(1.05)',
                                }
                            }}
                        >
                            <CardActionArea 
                                onClick={() => handleCardClick(flashcard.name)} 
                                sx={{ height: '100%', width: '100%', textAlign: 'center' }}
                            >
                                <CardContent>
                                    <Typography variant='h6' sx={{ color: '#333', fontWeight: 'bold' }}>
                                        {flashcard.name}
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    )
}
