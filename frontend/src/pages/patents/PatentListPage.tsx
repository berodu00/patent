import React, { useState } from 'react';
import {
    Box,
    Button,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Chip,
    TextField,
    Pagination
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useGetPatentsQuery } from '../../api/patentsApi';
import AddIcon from '@mui/icons-material/Add';

const PatentListPage: React.FC = () => {
    const navigate = useNavigate();
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');

    const { data, isLoading, error } = useGetPatentsQuery({
        page,
        limit: 10,
        search: search || undefined
    });

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(event.target.value);
        setPage(1); // Reset to first page on search
    };

    const statusColors: Record<string, "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning"> = {
        PREPARING: 'default',
        APPLIED: 'info',
        REGISTERED: 'success',
        REJECTED: 'error',
        WITHDRAWN: 'warning',
    };

    if (isLoading) return <Typography>Loading patents...</Typography>;
    if (error) return <Typography color="error">Error loading patents</Typography>;

    return (
        <Box p={3}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4">Patents</Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => navigate('/patents/new')}
                >
                    New Patent
                </Button>
            </Box>

            <Box mb={3}>
                <TextField
                    label="Search by Title or Application Number"
                    variant="outlined"
                    fullWidth
                    value={search}
                    onChange={handleSearchChange}
                />
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Application Number</TableCell>
                            <TableCell>Title</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Application Date</TableCell>
                            <TableCell>Applicant</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data?.data.map((patent) => (
                            <TableRow
                                key={patent.id}
                                hover
                                onClick={() => navigate(`/patents/${patent.id}`)}
                                style={{ cursor: 'pointer' }}
                            >
                                <TableCell>{patent.applicationNumber}</TableCell>
                                <TableCell>{patent.title}</TableCell>
                                <TableCell>
                                    <Chip
                                        label={patent.status}
                                        color={statusColors[patent.status] || 'default'}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell>
                                    {new Date(patent.applicationDate).toLocaleDateString()}
                                </TableCell>
                                <TableCell>{patent.applicant?.name || patent.applicant?.email}</TableCell>
                            </TableRow>
                        ))}
                        {data?.data.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} align="center">No patents found.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {data && (
                <Box mt={2} display="flex" justifyContent="center">
                    <Pagination
                        count={Math.ceil(data.total / 10)}
                        page={page}
                        onChange={(_, p) => setPage(p)}
                        color="primary"
                    />
                </Box>
            )}
        </Box>
    );
};

export default PatentListPage;
