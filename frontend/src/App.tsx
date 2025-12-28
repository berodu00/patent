import { Routes, Route } from 'react-router-dom';
import { Container, Typography, Box } from '@mui/material';

function App() {
    return (
        <Container>
            <Box sx={{ my: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    특허관리 시스템
                </Typography>
                <Routes>
                    <Route path="/" element={<Typography>Front-end Init Complete</Typography>} />
                </Routes>
            </Box>
        </Container>
    );
}

export default App;
