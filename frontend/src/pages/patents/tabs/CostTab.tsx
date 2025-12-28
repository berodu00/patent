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
import { useGetCostsQuery, useAddCostMutation, useDeleteCostMutation } from '../../../api/patentsApi';
import { useForm, Controller } from 'react-hook-form';

interface CostTabProps {
    patentId: string;
}

const CostTab: React.FC<CostTabProps> = ({ patentId }) => {
    const { data: costs, isLoading } = useGetCostsQuery(patentId);
    const [addCost] = useAddCostMutation();
    const [deleteCost] = useDeleteCostMutation();
    const [open, setOpen] = useState(false);

    const { control, handleSubmit, reset } = useForm({
        defaultValues: {
            type: 'APPLICATION_FEE',
            amount: '',
            status: 'UNPAID',
            dueDate: '',
            paymentDate: ''
        }
    });

    const onSubmit = async (data: any) => {
        try {
            const payload = {
                ...data,
                amount: parseFloat(data.amount),
            };
            // Remove empty dates
            if (!payload.dueDate) delete payload.dueDate;
            if (!payload.paymentDate) delete payload.paymentDate;

            await addCost({ patentId, body: payload }).unwrap();
            setOpen(false);
            reset();
        } catch (err) {
            console.error('Failed to add cost:', err);
        }
    };

    const handleDelete = async (costId: string) => {
        if (confirm('Are you sure you want to delete this cost item?')) {
            await deleteCost({ patentId, costId });
        }
    };

    if (isLoading) return <Typography>Loading...</Typography>;

    return (
        <Box>
            <Box display="flex" justifyContent="flex-end" mb={2}>
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpen(true)}>
                    Add Expense
                </Button>
            </Box>

            <TableContainer component={Paper} variant="outlined">
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Type</TableCell>
                            <TableCell>Amount</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Due Date</TableCell>
                            <TableCell>Payment Date</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {costs?.map((cost: any) => (
                            <TableRow key={cost.id}>
                                <TableCell>{cost.type}</TableCell>
                                <TableCell>{parseInt(cost.amount).toLocaleString()}</TableCell>
                                <TableCell>{cost.status}</TableCell>
                                <TableCell>{cost.dueDate || '-'}</TableCell>
                                <TableCell>{cost.paymentDate || '-'}</TableCell>
                                <TableCell>
                                    <IconButton color="error" size="small" onClick={() => handleDelete(cost.id)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                        {costs?.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} align="center">No cost items found.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>Add Cost</DialogTitle>
                <DialogContent sx={{ pt: 2, minWidth: 400 }}>
                    <form id="add-cost-form" onSubmit={handleSubmit(onSubmit)}>
                        <Box display="flex" flexDirection="column" gap={2}>
                            <Controller
                                name="type"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        select
                                        label="Expense Type"
                                        fullWidth
                                    >
                                        <MenuItem value="APPLICATION_FEE">Application Fee</MenuItem>
                                        <MenuItem value="REGISTRATION_FEE">Registration Fee</MenuItem>
                                        <MenuItem value="ANNUAL_FEE">Annual Fee</MenuItem>
                                        <MenuItem value="ATTORNEY_FEE">Attorney Fee</MenuItem>
                                    </TextField>
                                )}
                            />
                            <Controller
                                name="amount"
                                control={control}
                                rules={{ required: true }}
                                render={({ field }) => (
                                    <TextField {...field} label="Amount" type="number" fullWidth />
                                )}
                            />
                            <Controller
                                name="status"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        select
                                        label="Status"
                                        fullWidth
                                    >
                                        <MenuItem value="UNPAID">Unpaid</MenuItem>
                                        <MenuItem value="PAID">Paid</MenuItem>
                                        <MenuItem value="OVERDUE">Overdue</MenuItem>
                                    </TextField>
                                )}
                            />
                            <Controller
                                name="dueDate"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        type="date"
                                        label="Due Date"
                                        fullWidth
                                        InputLabelProps={{ shrink: true }}
                                    />
                                )}
                            />
                            <Controller
                                name="paymentDate"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        type="date"
                                        label="Payment Date"
                                        fullWidth
                                        InputLabelProps={{ shrink: true }}
                                    />
                                )}
                            />
                        </Box>
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button type="submit" form="add-cost-form" variant="contained">
                        Add
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default CostTab;
