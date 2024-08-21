"use client";

import { Container, Box, Typography, Paper, TextField, Button, Card, CardActionArea, CardContent, DialogTitle, DialogContent, DialogContentText, DialogActions, Dialog, Grid } from "@mui/material";
import { doc, getDoc, collection, writeBatch } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { db } from "@/firebase";

export default function Generate() {
    const { isLoaded, isSignedIn, user } = useUser();
    const [flashcards, setFlashcards] = useState([]);
    const [flipped, setFlipped] = useState([]);
    const [text, setText] = useState('');
    const [name, setName] = useState('');
    const [open, setOpen] = useState(false);
    const router = useRouter();

    const handleSubmit = async () => {
        fetch('/api/generate', 
            {
            method: 'POST',
            body: text,
        })
            .then((res) => res.json())
            .then((data) => setFlashcards(data));
    };

    const handleCardClick = (id) => {
        setFlipped((prev) => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const saveFlashcards = async () => {
        if (!name) {
            alert('Please enter a name');
            return;
        }

        const batch = writeBatch(db);
        const userDocRef = doc(db, 'users', user.id);
        const docSnap = await getDoc(userDocRef);

        if (docSnap.exists()) {
            const collections = docSnap.data()?.flashcards || [];
            if (collections.find(c => c.name === name)) {
                alert('Flashcard collection already exists');
                return;
            } else {
                collections.push({ name });
                batch.set(userDocRef, { flashcards: collections }, { merge: true });
            }
        } else {
            batch.set(userDocRef, { flashcards: [{ name }] });
        }

        const colRef = collection(userDocRef, name);
        flashcards.forEach((flashcard) => {
            const cardDocRef = doc(colRef);
            batch.set(cardDocRef, flashcard);
        });

        await batch.commit();
        handleClose();
        router.push('/flashcards');
    };

    return (
        <Container maxWidth="md">
            <Box sx={{
                mt: 4,
                mb: 6,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}>
                <Typography variant='h4' gutterBottom>Generate Flashcards</Typography>
                <Paper sx={{ p: 4, width: '100%' }}>
                    <TextField value={text} onChange={(e) => setText(e.target.value)} label="Enter text" fullWidth multiline rows={4} variant="outlined" sx={{ mb: 2 }} />
                    <Button variant="contained" color="primary" onClick={handleSubmit} fullWidth>Submit</Button>
                </Paper>
            </Box>

            {flashcards.length > 0 && (
                <Box sx={{ mt: 4 }}>
                    <Typography variant="h5" align="center">Flashcards Preview</Typography>
                    <Grid container spacing={3} sx={{ justifyContent: 'center' }}>
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
                    <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                        <Button variant='contained' color='secondary' onClick={handleOpen}>Save Flashcards</Button>
                    </Box>
                </Box>
            )}
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Save Flashcards</DialogTitle>
                <DialogContent>
                    <DialogContentText>Enter a name for your flashcard collection</DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        label='Collection Name'
                        type='text'
                        fullWidth
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        variant="outlined"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={saveFlashcards}>Save</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}
