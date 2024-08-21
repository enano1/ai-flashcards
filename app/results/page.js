'use client'

import getStripe from '@/utils/get-stripe';
import {useEffect, useState} from 'react';
import {collection, doc, getDoc, getDocs} from 'firebase/firestore';
import {useRouter, useSearchParams } from 'next/navigation';
import {Box, Button, Card, CardActions,CardActionArea,  CardContent, Container, Dialog, DialogActions,DialogContent, DialogContentText, DialogTitle, Grid, Paper, TextField, Typography, CircularProgress} from '@mui/material'

const ResultPage =() => {
    const router = useRouter()
    const searchParams = useSearchParams()
    const session_id = searchParams.get('session_id')
    const [loading, setLoading] = useState(true)
    const [session, setSession] = useState(null)
    const [error, setError] = useState(null)

    useEffect (() => {
        const fetchCheckoutSession = async () => {
            if (!session_id) return

            try{
                const res = await fetch(`/api/checkout_session?session_id=${session_id}`)
                const sessionData = await res.json()
                if (res.ok){
                  setSession(sessionData)
                }else{
                    setError(sessionData.error)
                }
            }catch (err){
            setError("An error occured")
            }finally{
                setLoading(false)
            }
        }
        fetchCheckoutSession()
    }, [session_id])

    if (loading){
        return (
            <Container maxWidth="100vw" sx={{textAlign:'center', mt:4}}>
                <CircularProgress/>
                <Typography variant ='h6'> Loading...</Typography>
            </Container>
        )
    }
    
    if (error){
        return (
            <Container maxWidth="100vw" sx={{textAlign:'center', mt:4}}>
                <CircularProgress/>
                <Typography variant ='h6'>{error}</Typography>
            </Container>
        )
    }

    return (
        <Container maxWidth="100vw" sx={{textAlign:'center', mt:4}}>
            {
                session.payment_status === 'paid' ? (
                    <>
                    <Typography variant ='h4'>Thank you for purchasing</Typography>
                    <Box>
                        <Typography variant ='h6'> Session ID: {session_id}</Typography>
                        <Typography variant ='body1'> WE have received your payment. You will receive an email confirming your order</Typography>
                    </Box>
                    </>
                ) : (
                    <>
                    <Typography variant ='h4'>Payment Failed</Typography>
                    <Box  sx={{ mt:22}}>
                        <Typography variant ='body1'> Payment was not succesful. Please try again</Typography>
                    </Box>
                    </>
                )
            }
        </Container>
    )
}

export default ResultPage
