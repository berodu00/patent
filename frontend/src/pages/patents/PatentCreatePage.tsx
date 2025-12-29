import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
    Box,
    Button,
    TextField,
    Typography,
    MenuItem,
    Paper
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useCreatePatentMutation } from '../../api/patentsApi';
import type { CreatePatentRequest } from '../../api/patentsApi';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

const schema = yup.object({
    applicationNumber: yup.string().required('Application Number is required'),
    title: yup.string().required('Title is required'),
    applicationDate: yup.string().required('Application Date is required'),
    status: yup.string().required('Status is required'),
    description: yup.string().optional(),
}).required();

const PatentCreatePage: React.FC = () => {
    const navigate = useNavigate();
    const [createPatent, { isLoading, error }] = useCreatePatentMutation();

    const { control, handleSubmit, formState: { errors } } = useForm<CreatePatentRequest>({
        resolver: yupResolver(schema) as any,
        defaultValues: {
            status: 'PREPARING',
            applicationDate: new Date().toISOString().split('T')[0], // Today YYYY-MM-DD
        }
    });

    const onSubmit = async (data: CreatePatentRequest) => {
        try {
            // Ensure date is ISO string if needed by backend, but backend accepts Date string usually.
            // Backend DTO allows IsDateString, so YYYY-MM-DD is valid ISO 8601 date.
            // We might need to append time if backend expects full timestamp, but IsDateString handles dates.
            // Let's ensure it's a full ISO string to be safe.
            const payload = {
                ...data,
                applicationDate: new Date(data.applicationDate).toISOString()
            };
            await createPatent(payload).unwrap();
            navigate('/patents');
        } catch (err) {
            console.error('Failed to create patent:', err);
        }
    };

    return (
        <Box p={3} maxWidth={800} mx="auto">
            <Paper elevation={3} sx={{ p: 4 }}>
                <Typography variant="h5" mb={3}>Register New Patent</Typography>

                {error && (
                    <Typography color="error" mb={2}>
                        Error creating patent.
                    </Typography>
                )}

                <form onSubmit={handleSubmit(onSubmit as any)}>
                    <Box display="flex" flexWrap="wrap" gap={3}>
                        <Box width="100%">
                            <Controller
                                name="applicationNumber"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Application Number"
                                        fullWidth
                                        error={!!errors.applicationNumber}
                                        helperText={errors.applicationNumber?.message}
                                    />
                                )}
                            />
                        </Box>
                        <Box width="100%">
                            <Controller
                                name="title"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Title"
                                        fullWidth
                                        error={!!errors.title}
                                        helperText={errors.title?.message}
                                    />
                                )}
                            />
                        </Box>
                        <Box width={{ xs: '100%', sm: '48%' }}>
                            <Controller
                                name="status"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        select
                                        label="Status"
                                        fullWidth
                                        error={!!errors.status}
                                        helperText={errors.status?.message}
                                    >
                                        <MenuItem value="PREPARING">Preparing</MenuItem>
                                        <MenuItem value="APPLIED">Applied</MenuItem>
                                        <MenuItem value="EXAMINING">Examining</MenuItem>
                                        <MenuItem value="REGISTERED">Registered</MenuItem>
                                        <MenuItem value="REJECTED">Rejected</MenuItem>
                                        <MenuItem value="WITHDRAWN">Withdrawn</MenuItem>
                                    </TextField>
                                )}
                            />
                        </Box>
                        <Box width={{ xs: '100%', sm: '48%' }}>
                            <Controller
                                name="applicationDate"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        type="date"
                                        label="Application Date"
                                        fullWidth
                                        InputLabelProps={{ shrink: true }}
                                        error={!!errors.applicationDate}
                                        helperText={errors.applicationDate?.message}
                                    />
                                )}
                            />
                        </Box>
                        <Box width="100%">
                            <Controller
                                name="description"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Description"
                                        multiline
                                        rows={4}
                                        fullWidth
                                    />
                                )}
                            />
                        </Box>
                        <Box width="100%">
                            <Box display="flex" justifyContent="flex-end" gap={2}>
                                <Button onClick={() => navigate('/patents')}>Cancel</Button>
                                <Button type="submit" variant="contained" disabled={isLoading}>
                                    {isLoading ? 'Saving...' : 'Save Patent'}
                                </Button>
                            </Box>
                        </Box>
                    </Box>
                </form>
            </Paper>
        </Box>
    );
};

export default PatentCreatePage;
