import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetPatentQuery, useDeletePatentMutation, useSyncPatentMutation } from '../../api/patentsApi';
import {
    Box,
    Button,
    Typography,
    Paper,
    Chip,
    Divider,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Tabs,
    Tab
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import InternationalAppsTab from './tabs/InternationalAppsTab';
import CostTab from './tabs/CostTab';
import FileTab from './tabs/FileTab';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

const PatentDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { data: patent, isLoading, error } = useGetPatentQuery(id!);
    const [deletePatent, { isLoading: isDeleting }] = useDeletePatentMutation();
    const [syncPatent, { isLoading: isSyncing }] = useSyncPatentMutation();
    const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
    const [tabValue, setTabValue] = useState(0);

    const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const handleDelete = async () => {
        if (id) {
            try {
                await deletePatent(id).unwrap();
                navigate('/patents');
            } catch (e) {
                console.error(e);
            }
        }
    };

    const handleSync = async () => {
        try {
            await syncPatent(id!).unwrap();
            alert('Synced with KIPRIS successfully!');
        } catch (err) {
            console.error(err);
            alert('Sync failed.');
        }
    };

    if (isLoading) return <Typography>Loading...</Typography>;
    if (error || !patent) return <Typography color="error">Patent not found</Typography>;

    return (
        <Box p={3}>
            <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/patents')} sx={{ mb: 2 }}>
                Back to List
            </Button>

            <Paper elevation={3}>
                <Box p={4} pb={2}>
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                        <Box>
                            <Typography variant="h4" gutterBottom>{patent.title}</Typography>
                            <Typography variant="subtitle1" color="textSecondary">
                                {patent.applicationNumber}
                            </Typography>
                        </Box>
                        <Box>
                            <Button
                                variant="outlined"
                                color="primary"
                                onClick={handleSync}
                                disabled={isSyncing}
                                sx={{ mr: 1 }}
                            >
                                {isSyncing ? 'Syncing...' : 'Sync (KIPRIS)'}
                            </Button>
                            <Button
                                variant="outlined"
                                startIcon={<EditIcon />}
                                disabled
                                sx={{ mr: 1 }}
                            >
                                Edit
                            </Button>
                            <Button
                                variant="outlined"
                                color="error"
                                startIcon={<DeleteIcon />}
                                onClick={() => setOpenDeleteConfirm(true)}
                            >
                                Delete
                            </Button>
                        </Box>
                    </Box>
                    <Chip label={patent.status} color="primary" />
                </Box>

                <Divider />

                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={tabValue} onChange={handleTabChange} aria-label="patent tabs">
                        <Tab label="Overview" />
                        <Tab label="International Apps" />
                        <Tab label="Costs" />
                        <Tab label="Files" />
                    </Tabs>
                </Box>

                <TabPanel value={tabValue} index={0}>
                    <Box display="flex" flexWrap="wrap" gap={3}>
                        <Box width={{ xs: '100%', sm: '48%' }}>
                            <Typography variant="subtitle2" color="textSecondary">Application Date</Typography>
                            <Typography variant="body1">
                                {new Date(patent.applicationDate).toLocaleDateString()}
                            </Typography>
                        </Box>
                        <Box width={{ xs: '100%', sm: '48%' }}>
                            <Typography variant="subtitle2" color="textSecondary">Applicant</Typography>
                            <Typography variant="body1">
                                {patent.applicant?.name || patent.applicant?.email}
                            </Typography>
                        </Box>
                        <Box width="100%">
                            <Typography variant="subtitle2" color="textSecondary">Description</Typography>
                            <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                                {patent.description || 'No description provided.'}
                            </Typography>
                        </Box>
                    </Box>
                </TabPanel>

                <TabPanel value={tabValue} index={1}>
                    <InternationalAppsTab patentId={id!} />
                </TabPanel>

                <TabPanel value={tabValue} index={2}>
                    <CostTab patentId={id!} />
                </TabPanel>

                <TabPanel value={tabValue} index={3}>
                    <FileTab patentId={id!} />
                </TabPanel>
            </Paper>

            <Dialog open={openDeleteConfirm} onClose={() => setOpenDeleteConfirm(false)}>
                <DialogTitle>Delete Patent?</DialogTitle>
                <DialogContent>
                    Are you sure you want to delete this patent? This action cannot be undone.
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDeleteConfirm(false)}>Cancel</Button>
                    <Button onClick={handleDelete} color="error" autoFocus disabled={isDeleting}>
                        {isDeleting ? 'Deleting...' : 'Delete'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default PatentDetailPage;
