'use client'
import { useUser } from '@clerk/nextjs'
import { useEffect, useState } from 'react'
import { Container, Grid, Card, CardActionArea, CardContent, Typography, IconButton, Box } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import { collection, doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore'
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

    const handleDelete = async (flashcardName) => {
        if (!user) return

        const userDocRef = doc(db, 'users', user.id)
        const docSnap = await getDoc(userDocRef)

        if (docSnap.exists()) {
            const collections = docSnap.data().flashcards || []
            const updatedCollections = collections.filter(flashcard => flashcard.name !== flashcardName)

            await setDoc(userDocRef, { flashcards: updatedCollections }, { merge: true })

            setFlashcards(updatedCollections)
        }
    }

    return (
        <Container maxWidth='lg' sx={{ mt: 6 }}>
            <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', fontWeight: 'bold', color: '#333' }}>
                My Flashcard Collections
            </Typography>
            <Grid container spacing={4} justifyContent="center" alignItems="center">
                {flashcards.map((flashcard, index) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                        <Card 
                            sx={{ 
                                p: 2, 
                                height: '180px',
                                display: 'flex', 
                                flexDirection: 'column', 
                                justifyContent: 'center', 
                                alignItems: 'center',
                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                                borderRadius: '16px',
                                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                '&:hover': {
                                    transform: 'scale(1.05)',
                                    boxShadow: '0 6px 15px rgba(0, 0, 0, 0.15)',
                                },
                                position: 'relative' // To position delete button inside the card
                            }}
                        >
                            <CardActionArea 
                                onClick={() => handleCardClick(flashcard.name)} 
                                sx={{ height: '100%', width: '100%', textAlign: 'center', padding: 2 }}
                            >
                                <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <Typography variant='h6' sx={{ color: '#00796B', fontWeight: 'bold', marginBottom: '10px' }}>
                                        {flashcard.name}
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                            <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
                                <IconButton 
                                    aria-label="delete" 
                                    onClick={() => handleDelete(flashcard.name)} 
                                    sx={{ color: 'red' }}
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </Box>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    )
}
