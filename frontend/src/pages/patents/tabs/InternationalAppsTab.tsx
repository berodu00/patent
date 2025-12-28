import React, { useState } from 'react';
import {
    Box,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    MenuItem,
    IconButton,
    Typography
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useGetInternationalAppsQuery, useAddInternationalAppMutation, useDeleteInternationalAppMutation } from '../../../api/patentsApi';
import { useForm, Controller } from 'react-hook-form';

interface InternationalAppsTabProps {
    patentId: string;
}

const InternationalAppsTab: React.FC<InternationalAppsTabProps> = ({ patentId }) => {
    const { data: apps, isLoading } = useGetInternationalAppsQuery(patentId);
    const [addApp] = useAddInternationalAppMutation();
    const [deleteApp] = useDeleteInternationalAppMutation();
    const [open, setOpen] = useState(false);

    const { control, handleSubmit, reset } = useForm({
        defaultValues: {
            countryCode: '',
            countryName: '',
            status: 'PREPARING',
            applicationNumber: ''
        }
    });

    const onSubmit = async (data: any) => {
        try {
            await addApp({ patentId, body: data }).unwrap();
            setOpen(false);
            reset();
        } catch (err) {
            console.error('Failed to add international app:', err);
        }
    };

    const handleDelete = async (iaId: string) => {
        if (confirm('Are you sure you want to delete this application?')) {
            await deleteApp({ patentId, iaId });
        }
    };

    const countries = [
        { code: 'US', name: 'United States' },
        { code: 'CN', name: 'China' },
        { code: 'JP', name: 'Japan' },
        { code: 'EP', name: 'Europe' },
    ];

    if (isLoading) return <Typography>Loading...</Typography>;

    return (
        <Box>
            <Box display="flex" justifyContent="flex-end" mb={2}>
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpen(true)}>
                    Add Country
                </Button>
            </Box>

            <TableContainer component={Paper} variant="outlined">
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Country</TableCell>
                            <TableCell>App Number</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Cost</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {apps?.map((app: any) => (
                            <TableRow key={app.id}>
                                <TableCell>{app.countryName} ({app.countryCode})</TableCell>
                                <TableCell>{app.applicationNumber || '-'}</TableCell>
                                <TableCell>{app.status}</TableCell>
                                <TableCell>{app.totalCost}</TableCell>
                                <TableCell>
                                    <IconButton color="error" size="small" onClick={() => handleDelete(app.id)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                        {apps?.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} align="center">No international applications found.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>Add International Application</DialogTitle>
                <DialogContent sx={{ pt: 2, minWidth: 400 }}>
                    <form id="add-ia-form" onSubmit={handleSubmit(onSubmit)}>
                        <Box display="flex" flexDirection="column" gap={2}>
                            <Controller
                                name="countryCode"
                                control={control}
                                rules={{ required: true }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        select
                                        label="Country"
                                        fullWidth
                                        onChange={(e) => {
                                            const selected = countries.find(c => c.code === e.target.value);
                                            field.onChange(e);
                                            if (selected) {
                                                // This is a bit hacky with react-hook-form without setValue from useForm context passed correctly?
                                                // Actually let's just use the field value. We need to set countryName too.
                                                // Let's rely on backend or just send both.
                                                // Simplification: In a real app, I'd use setValue.
                                                // For now let's assume user selects code and we verify name on submission or simpler: User selects code, we auto-set name in a hidden field or logic.
                                                // Let's just create a wrapper handler or just let user type name if needed? No, dropdown is better.
                                                // Let's update the form data with countryName manually in onSubmit.
                                            }
                                        }}
                                    >
                                        {countries.map((c) => (
                                            <MenuItem key={c.code} value={c.code}>
                                                {c.name}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                )}
                            />
                            <Controller
                                name="applicationNumber"
                                control={control}
                                render={({ field }) => (
                                    <TextField {...field} label="Application Number (Optional)" fullWidth />
                                )}
                            />
                            <Controller
                                name="status"
                                control={control}
                                render={({ field }) => (
                                    <TextField {...field} select label="Status" fullWidth>
                                        <MenuItem value="PREPARING">Preparing</MenuItem>
                                        <MenuItem value="APPLIED">Applied</MenuItem>
                                    </TextField>
                                )}
                            />
                        </Box>
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button
                        type="submit"
                        form="add-ia-form"
                        variant="contained"
                        onClick={handleSubmit((data) => {
                            const country = countries.find(c => c.code === data.countryCode);
                            onSubmit({ ...data, countryName: country?.name || data.countryCode });
                        })}
                    >
                        Add
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default InternationalAppsTab;
