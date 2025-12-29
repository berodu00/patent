import React from 'react';
import { Box, Paper, Typography, Card, CardContent } from '@mui/material';
import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { useGetDashboardStatsQuery, useGetDashboardTrendsQuery } from '../../api/patentsApi';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const DashboardPage = () => {
    const { data: stats, isLoading: statsLoading } = useGetDashboardStatsQuery();
    const { data: trends, isLoading: trendsLoading } = useGetDashboardTrendsQuery();

    if (statsLoading || trendsLoading) return <Typography>Loading Dashboard...</Typography>;
    // Safeguard agaist malformed data
    const safeStats = stats || { totalPatents: 0, statusDistribution: {} };
    const safeTrends = trends || [];

    const pieData = safeStats.statusDistribution ? Object.keys(safeStats.statusDistribution).map(key => ({
        name: key,
        value: safeStats.statusDistribution[key] || 0
    })) : [];

    return (
        <Box p={3}>
            <Typography variant="h4" gutterBottom>Dashboard</Typography>

            <Box display="flex" flexWrap="wrap" gap={3}>
                {/* Summary Cards */}
                <Box width={{ xs: '100%', md: '30%' }} flexGrow={1}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>Total Patents</Typography>
                            <Typography variant="h3">{safeStats.totalPatents || 0}</Typography>
                        </CardContent>
                    </Card>
                </Box>
                <Box width={{ xs: '100%', md: '30%' }} flexGrow={1}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>Active Applications</Typography>
                            <Typography variant="h3">{pieData.find(d => d.name === 'APPLIED')?.value || 0}</Typography>
                        </CardContent>
                    </Card>
                </Box>
                <Box width={{ xs: '100%', md: '30%' }} flexGrow={1}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>Registered</Typography>
                            <Typography variant="h3">{pieData.find(d => d.name === 'REGISTERED')?.value || 0}</Typography>
                        </CardContent>
                    </Card>
                </Box>

                {/* Charts */}
                <Box width={{ xs: '100%', md: '48%' }} flexGrow={1}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>Status Distribution</Typography>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </Paper>
                </Box>

                <Box width={{ xs: '100%', md: '48%' }} flexGrow={1}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>Application Trends (Last 6 Months)</Typography>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={safeTrends}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="applications" fill="#8884d8" name="Applications" />
                                <Bar dataKey="registrations" fill="#82ca9d" name="Registrations" />
                            </BarChart>
                        </ResponsiveContainer>
                    </Paper>
                </Box>
            </Box>
        </Box >
    );
};

export default DashboardPage;
