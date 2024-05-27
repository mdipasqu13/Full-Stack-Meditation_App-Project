import React from 'react';
import Box from '@mui/material/Box';

const About = () => {
    return (
        <Box 
            sx={{
                border: '1px solid grey',
                padding: 2,
                margin: 2,
                borderRadius: 1,
                boxShadow: 3,
                backgroundColor: 'lightblue',
                color: 'black',
                width: '50%', 
                margin: 'auto' 
            }}
        >
            <h1>About Us</h1>
            <p>
                Welcome to our meditation website, your go-to resource for cultivating mindfulness and inner peace in your life. 
                Meditation offers numerous benefits, including reduced stress, improved focus, better sleep, and enhanced emotional 
                well-being. Our website provides a diverse collection of guided meditations, ranging from brief sessions 
                perfect for beginners to longer practices for seasoned meditators. Whether you are just starting your 
                meditation journey or looking to deepen your practice, we have something for everyone to support you on your journey.
            </p>
        </Box>
    );
};

export default About;