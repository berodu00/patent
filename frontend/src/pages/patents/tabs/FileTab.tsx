import React, { useRef } from 'react';
import {
    Box,
    Button,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    IconButton,
    Typography,
    Paper,
    CircularProgress
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DownloadIcon from '@mui/icons-material/Download';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { useGetAttachmentsQuery, useUploadAttachmentMutation, useDeleteAttachmentMutation } from '../../../api/patentsApi';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../store';

interface FileTabProps {
    patentId: string;
}

const FileTab: React.FC<FileTabProps> = ({ patentId }) => {
    const { data: attachments, isLoading } = useGetAttachmentsQuery(patentId);
    const [uploadAttachment, { isLoading: isUploading }] = useUploadAttachmentMutation();
    const [deleteAttachment] = useDeleteAttachmentMutation();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const token = useSelector((state: RootState) => state.auth.token);

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            try {
                await uploadAttachment({ patentId, file }).unwrap();
            } catch (err) {
                console.error('Failed to upload file:', err);
                alert('File upload failed.');
            }
            // Reset input
            event.target.value = '';
        }
    };

    const handleDelete = async (attId: string) => {
        if (confirm('Are you sure you want to delete this file?')) {
            await deleteAttachment({ patentId, attId });
        }
    };

    const handleDownload = async (attId: string, fileName: string) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8005/api'}/patents/attachments/${attId}/download`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) throw new Error('Download failed');

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (e) {
            console.error(e);
            alert('Download failed');
        }
    };

    if (isLoading) return <Typography>Loading...</Typography>;

    return (
        <Box>
            <Box display="flex" justifyContent="flex-end" mb={2}>
                <input
                    type="file"
                    hidden
                    ref={fileInputRef}
                    onChange={handleFileChange}
                />
                <Button
                    variant="contained"
                    startIcon={isUploading ? <CircularProgress size={20} color="inherit" /> : <CloudUploadIcon />}
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                >
                    {isUploading ? 'Uploading...' : 'Upload File'}
                </Button>
            </Box>

            <Paper variant="outlined">
                <List>
                    {attachments?.map((att: any) => (
                        <ListItem key={att.id} divider>
                            <InsertDriveFileIcon sx={{ mr: 2, color: 'text.secondary' }} />
                            <ListItemText
                                primary={att.fileName}
                                secondary={`Size: ${(att.fileSize / 1024).toFixed(1)} KB | Uploaded by: ${att.uploadedBy?.name || 'Unknown'} | Date: ${new Date(att.created_at).toLocaleDateString()}`}
                            />
                            <ListItemSecondaryAction>
                                <IconButton edge="end" aria-label="download" onClick={() => handleDownload(att.id, att.fileName)} sx={{ mr: 1 }}>
                                    <DownloadIcon />
                                </IconButton>
                                <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(att.id)}>
                                    <DeleteIcon color="error" />
                                </IconButton>
                            </ListItemSecondaryAction>
                        </ListItem>
                    ))}
                    {attachments?.length === 0 && (
                        <ListItem>
                            <ListItemText primary="No files attached." />
                        </ListItem>
                    )}
                </List>
            </Paper>
        </Box>
    );
};

export default FileTab;
