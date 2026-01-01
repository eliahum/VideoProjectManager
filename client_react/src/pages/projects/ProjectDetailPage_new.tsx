import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Typography, 
  Button, 
  Box, 
  CircularProgress, 
  Paper,
  Grid,
  IconButton,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { ArrowBack, Add } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import { fetchProjectById } from '../../store/projectsSlice';

export const ProjectDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { selectedProject, loading, error } = useAppSelector((state) => state.projects);

  useEffect(() => {
    if (id) {
      dispatch(fetchProjectById(id));
    }
  }, [dispatch, id]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box>
        <Typography color="error">{error}</Typography>
        <Button onClick={() => navigate('/projects')}>חזרה לרשימת פרויקטים</Button>
      </Box>
    );
  }

  if (!selectedProject) {
    return <Typography>פרויקט לא נמצא</Typography>;
  }

  return (
    <Box sx={{ 
      padding: '24px', 
      maxWidth: '1400px', 
      margin: '0 auto',
      background: 'linear-gradient(135deg, rgba(19,16,33,0.97) 0%, rgba(36,26,62,0.95) 100%)',
      minHeight: 'calc(100vh - 64px)'
    }}>
      {/* Header Section */}
      <Box sx={{ 
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 2,
        mb: 4,
        p: 3,
        background: 'rgba(74,46,122,0.3)',
        borderRadius: '16px',
        border: '1px solid rgba(168,85,247,0.2)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
      }}>
        <IconButton onClick={() => navigate('/projects')} sx={{ order: -2 }}>
          <ArrowBack sx={{ color: '#a855f7', fontSize: 28 }} />
        </IconButton>

        <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 1.5, alignItems: 'center' }}>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
            <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '16px' }}>פרויקט:</Typography>
            <Typography sx={{ color: '#ffffff', fontSize: '18px', fontWeight: 600 }}>
              {selected Project.projectName}
            </Typography>

            <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '16px', ml: 2 }}>לקוח:</Typography>
            <Typography sx={{ color: '#ffffff', fontSize: '18px', fontWeight: 600 }}>
              {selectedProject.customerId || 'ללא לקוח'}
            </Typography>

            <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '16px', ml: 2 }}>שלב הנוכחי:</Typography>
            <Typography sx={{ color: '#ffffff', fontSize: '18px', fontWeight: 600 }}>
              {selectedProject.currentStage || '-'}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'flex-start', width: '100%' }}>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px' }}>סכום ששלמו:</Typography>
              <Typography sx={{ color: '#ffffff', fontSize: '16px' }}>
                {selectedProject.paidAmount ? `₪${selectedProject.paidAmount}` : 'לא שולם'}
              </Typography>

              <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px', ml: 2 }}>תאריך תשלום:</Typography>
              <Typography sx={{ color: '#ffffff', fontSize: '16px' }}>
                {selectedProject.createdAt 
                  ? new Date(selectedProject.createdAt).toLocaleDateString('he-IL')
                  : '-'}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mt: 1 }}>
            <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px' }}>תשלום לספקים:</Typography>
            <Chip 
              label="סה״כ ₪0"
              sx={{ 
                bgcolor: 'rgba(96,165,250,0.2)', 
                color: '#60a5fa',
                fontWeight: 600 
              }} 
              size="small" 
            />
            <Chip 
              label="שולם ₪0"
              sx={{ 
                bgcolor: 'rgba(34,197,94,0.2)', 
                color: '#22c55e',
                fontWeight: 600 
              }} 
              size="small" 
            />
            <Chip 
              label="לא שולם ₪0"
              sx={{ 
                bgcolor: 'rgba(239,68,68,0.2)', 
                color: '#ef4444',
                fontWeight: 600 
              }} 
              size="small" 
            />
          </Box>
        </Box>

        <FormControl 
          variant="outlined" 
          size="small"
          sx={{ 
            minWidth: 200,
            '& .MuiOutlinedInput-root': {
              bgcolor: 'rgba(168,85,247,0.1)',
              '& fieldset': {
                borderColor: 'rgba(168,85,247,0.5)'
              },
              '&:hover fieldset': {
                borderColor: 'rgba(168,85,247,0.7)'
              }
            },
            '& .MuiInputLabel-root': {
              color: 'rgba(255,255,255,0.7)'
            },
            '& .MuiSelect-select': {
              color: '#ffffff'
            },
            '& .MuiSvgIcon-root': {
              color: '#ffffff'
            }
          }}
        >
          <InputLabel>סטטוס פרויקט</InputLabel>
          <Select
            value={selectedProject.statusId || ''}
            label="סטטוס פרויקט"
          >
            <MenuItem value="">בחר סטטוס</MenuItem>
            <MenuItem value="1">פעיל</MenuItem>
            <MenuItem value="2">בהמתנה</MenuItem>
          </Select>
        </FormControl>

        <Button 
          variant="contained"
          startIcon={<Add />}
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            fontWeight: 600,
            '&:hover': {
              background: 'linear-gradient(135deg, #5568d3 0%, #653a8b 100%)',
            }
          }}
        >
          הוסף אבן דרך
        </Button>
      </Box>

      {/* Milestones Section */}
      <Paper sx={{ 
        p: 3,
        background: 'rgba(19, 16, 33, 0.95)',
        border: '1px solid rgba(209, 196, 255, 0.3)',
        borderRadius: '16px',
        boxShadow: '0 8px 24px rgba(0,0,0,0.3)'
      }}>
        <Typography variant="h6" sx={{ color: '#ffffff', mb: 2, fontWeight: 600 }}>
          אבני דרך ושלבים
        </Typography>
        
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={3}>
            <Typography variant="subtitle2" sx={{ color: '#a855f7', fontWeight: 700 }}>פרה</Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography variant="subtitle2" sx={{ color: '#eab308', fontWeight: 700 }}>פרודוקשן</Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography variant="subtitle2" sx={{ color: '#22c55e', fontWeight: 700 }}>פוסט</Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography variant="subtitle2" sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 700 }}>סטטוס</Typography>
          </Grid>
        </Grid>

        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography sx={{ color: 'rgba(255,255,255,0.5)' }}>אין אבני דרך להצגה</Typography>
        </Box>
      </Paper>
    </Box>
  );
};
