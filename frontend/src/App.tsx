import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProtectedRoute from './components/ProtectedRoute';
import PatentListPage from './pages/patents/PatentListPage';
import PatentCreatePage from './pages/patents/PatentCreatePage';
import PatentDetailPage from './pages/patents/PatentDetailPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import Layout from './components/Layout';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const theme = createTheme({
    palette: {
        primary: {
            main: '#1976d2',
        },
        secondary: {
            main: '#dc004e',
        },
    },
});

function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/patents" element={<PatentListPage />} />
                    <Route path="/patents/create" element={<PatentCreatePage />} />
                    <Route path="/patents/:id" element={<PatentDetailPage />} />
                </Route>
            </Routes>
        </ThemeProvider>
    );
}

export default App;
