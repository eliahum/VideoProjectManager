import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Button, Box, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Chip } from '@mui/material';
import { Add, Delete, Visibility } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import { fetchProjects } from '../../store/projectsSlice';

export const ProjectsListPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { projects, loading, error } = useAppSelector((state) => state.projects);

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  const handleViewProject = (projectId: string) => {
    navigate(`/projects/${projectId}`);
  };

  const handleDeleteProject = (projectId: string) => {
    if (window.confirm('האם אתה בטוח שברצונך למחוק פרויקט זה?')) {
      // TODO: dispatch delete action
      console.log('Delete project:', projectId);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  const getStatusChip = (statusId: string) => {
    return (
      <Chip 
        label={statusId || 'ללא סטטוס'} 
        sx={{
          bgcolor: 'rgba(34, 197, 94, 0.2)',
          color: '#22c55e',
          fontWeight: 700,
          borderRadius: '12px',
          fontSize: '14px',
          '& .MuiChip-label': {
            padding: '4px 12px'
          }
        }}
        size="small"
      />
    );
  };

  const getStageChip = (stage: string) => {
    return (
      <Chip 
        label={stage || '-'} 
        sx={{
          bgcolor: 'rgba(168,85,247,0.2)',
          color: '#a855f7',
          fontWeight: 700,
          borderRadius: '12px',
          fontSize: '14px',
          '& .MuiChip-label': {
            padding: '4px 12px'
          }
        }}
        size="small"
      />
    );
  };

  return (
    <Box sx={{ maxWidth: '1400px', margin: '0 auto', padding: '0 16px', color: '#f4f0ff' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontSize: '2rem', margin: 0, color: '#ffffff' }}>
          פרויקטים
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<Add />}
          sx={{ ml: 2 }}
        >
          הוסף פרויקט
        </Button>
      </Box>

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      {projects.length === 0 ? (
        <Typography>אין פרויקטים</Typography>
      ) : (
        <TableContainer 
          component={Paper}
          sx={{
            background: 'rgba(19, 16, 33, 0.95)',
            border: '1px solid rgba(209, 196, 255, 0.3)',
            borderRadius: '18px',
            overflow: 'hidden',
            boxShadow: '0 15px 40px rgba(0, 0, 0, 0.5)',
          }}
        >
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: 'rgba(74, 46, 122, 0.95)' }}>
                <TableCell sx={{ color: '#fefbff !important', fontWeight: 600, fontSize: '16px', padding: '8px 12px', borderBottom: '1px solid rgba(209, 196, 255, 0.45)' }}>שם לקוח</TableCell>
                <TableCell sx={{ color: '#fefbff !important', fontWeight: 600, fontSize: '16px', padding: '8px 12px', borderBottom: '1px solid rgba(209, 196, 255, 0.45)' }}>שם פרויקט</TableCell>
                <TableCell sx={{ color: '#fefbff !important', fontWeight: 600, fontSize: '16px', padding: '8px 12px', borderBottom: '1px solid rgba(209, 196, 255, 0.45)' }}>סטטוס</TableCell>
                <TableCell sx={{ color: '#fefbff !important', fontWeight: 600, fontSize: '16px', padding: '8px 12px', borderBottom: '1px solid rgba(209, 196, 255, 0.45)' }}>שלב נוכחי</TableCell>
                <TableCell sx={{ color: '#fefbff !important', fontWeight: 600, fontSize: '16px', padding: '8px 12px', borderBottom: '1px solid rgba(209, 196, 255, 0.45)' }}>סכום ששלמו</TableCell>
                <TableCell sx={{ color: '#fefbff !important', fontWeight: 600, fontSize: '16px', padding: '8px 12px', borderBottom: '1px solid rgba(209, 196, 255, 0.45)' }}>פעולות</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {projects.map((project, index) => (
                <TableRow 
                  key={project.id || project._id}
                  sx={{ 
                    bgcolor: index % 2 === 0 ? 'rgba(32, 24, 58, 0.92)' : 'rgba(45, 32, 74, 0.94)',
                    '&:hover': { bgcolor: 'rgba(186, 161, 255, 0.35)' }
                  }}
                >
                  <TableCell sx={{ padding: '8px 12px', fontSize: '16px', color: '#60a5fa !important', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    {project.customerId || '-'}
                  </TableCell>
                  <TableCell sx={{ padding: '8px 12px', fontSize: '16px', color: '#ffffff', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    {project.projectName}
                  </TableCell>
                  <TableCell sx={{ padding: '8px 12px', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    {getStatusChip(project.statusId)}
                  </TableCell>
                  <TableCell sx={{ padding: '8px 12px', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    {getStageChip(project.currentStage)}
                  </TableCell>
                  <TableCell sx={{ padding: '8px 12px', fontSize: '16px', color: '#ffffff', fontWeight: 100, borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    {project.paidAmount ? `₪${project.paidAmount}` : '-'}
                  </TableCell>
                  <TableCell sx={{ padding: '8px 12px', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
                      <Button variant="contained" size="small" startIcon={<Visibility />} onClick={() => handleViewProject(project.id || project._id)} sx={{ fontSize: '14px', textTransform: 'none' }}>
                        צפה בפרויקט
                      </Button>
                      <IconButton size="small" onClick={() => handleDeleteProject(project.id || project._id)} sx={{ bgcolor: 'rgba(255,255,255,0.05)', borderRadius: '8px', padding: '4px 8px', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}>
                        <Delete sx={{ color: '#fca5a5', fontSize: 18 }} />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};
