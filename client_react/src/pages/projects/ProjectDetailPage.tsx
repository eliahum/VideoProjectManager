import { useEffect, useState } from 'react';
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
  MenuItem,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tabs,
  Tab
} from '@mui/material';
import { ArrowBack, Add, Edit, Delete, ExpandMore, DragIndicator, Star, Description } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import { fetchProjectById } from '../../store/projectsSlice';
import { MilestoneDialog } from '../../components/MilestoneDialog';

export const ProjectDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { selectedProject, loading, error } = useAppSelector((state) => state.projects);
  const [selectedTab, setSelectedTab] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingMilestone, setEditingMilestone] = useState<any>(null);
  const [editingStageName, setEditingStageName] = useState('');

  useEffect(() => {
    if (id) {
      dispatch(fetchProjectById(id));
    }
  }, [dispatch, id]);

  const getTotalSupplierAmount = (milestone: any) => {
    if (!milestone.suppliers || milestone.suppliers.length === 0) return 0;
    return milestone.suppliers.reduce((sum: number, s: any) => sum + (s.amount || 0), 0);
  };

  const getPaidAmount = (milestone: any) => {
    if (!milestone.suppliers || milestone.suppliers.length === 0) return 0;
    return milestone.suppliers.filter((s: any) => s.isPaid).reduce((sum: number, s: any) => sum + (s.amount || 0), 0);
  };

  const getUnpaidAmount = (milestone: any) => {
    return getTotalSupplierAmount(milestone) - getPaidAmount(milestone);
  };

  const handleEditMilestone = (milestone: any, stageName: string) => {
    setEditingMilestone(milestone);
    setEditingStageName(stageName);
    setDialogOpen(true);
  };

  const handleSaveMilestone = async (data: any) => {
    console.log('Saving milestone:', data);
    // TODO: Call API to update milestone
    // After save, reload project
    if (id) {
      await dispatch(fetchProjectById(id));
    }
    setDialogOpen(false);
  };

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
              {selectedProject.projectName}
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
              sx={{ bgcolor: 'rgba(96,165,250,0.2)', color: '#60a5fa', fontWeight: 600 }} 
              size="small" 
            />
            <Chip 
              label="שולם ₪0"
              sx={{ bgcolor: 'rgba(34,197,94,0.2)', color: '#22c55e', fontWeight: 600 }} 
              size="small" 
            />
            <Chip 
              label="לא שולם ₪0"
              sx={{ bgcolor: 'rgba(239,68,68,0.2)', color: '#ef4444', fontWeight: 600 }} 
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
              '& fieldset': { borderColor: 'rgba(168,85,247,0.5)' },
              '&:hover fieldset': { borderColor: 'rgba(168,85,247,0.7)' }
            },
            '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
            '& .MuiSelect-select': { color: '#ffffff' },
            '& .MuiSvgIcon-root': { color: '#ffffff' }
          }}
        >
          <InputLabel>סטטוס פרויקט</InputLabel>
          <Select value={selectedProject.statusNumber || ''} label="סטטוס פרויקט">
            <MenuItem value="">בחר סטטוס</MenuItem>
          </Select>
        </FormControl>

        <Button 
          variant="contained"
          startIcon={<Add />}
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            fontWeight: 600,
            '&:hover': { background: 'linear-gradient(135deg, #5568d3 0%, #653a8b 100%)' }
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

        {selectedProject.stages && selectedProject.stages.length > 0 ? (
          <Tabs 
            value={selectedTab} 
            onChange={(e, newValue) => setSelectedTab(newValue)}
            sx={{
              mb: 2,
              '& .MuiTab-root': {
                color: 'rgba(255,255,255,0.7)',
                fontWeight: 600,
                '&.Mui-selected': {
                  color: '#a855f7'
                }
              },
              '& .MuiTabs-indicator': {
                backgroundColor: '#a855f7'
              }
            }}
          >
            {selectedProject.stages.map((stage, index) => (
              <Tab key={stage.stageNumber} label={stage.stageName || stage.name} />
            ))}
          </Tabs>
        ) : null}

        {selectedProject.stages && selectedProject.stages.length > 0 ? (
          selectedProject.stages.map((stage, stageIndex) => (
            <Box 
              key={stage.stageNumber} 
              sx={{ display: selectedTab === stageIndex ? 'block' : 'none' }}
            >
              {stage.milestones && stage.milestones.length > 0 ? (
                stage.milestones.map((milestone) => (
                  <Accordion 
                    key={milestone.id || milestone.milestoneId}
                    sx={{
                      mb: 1,
                      bgcolor: 'rgba(45, 32, 74, 0.5)',
                      border: '1px solid rgba(168,85,247,0.3)',
                      '&:before': { display: 'none' },
                      borderRadius: '8px !important'
                    }}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMore sx={{ color: '#ffffff' }} />}
                      sx={{
                        '& .MuiAccordionSummary-content': {
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          width: '100%'
                        }
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
                        <DragIndicator sx={{ color: 'rgba(255,255,255,0.5)' }} />
                        <Typography sx={{ color: '#ffffff', fontWeight: 500 }}>
                          {milestone.name}
                        </Typography>
                        {milestone.suppliers && milestone.suppliers.length > 0 && (
                          <Box sx={{ display: 'flex', gap: 1, mr: 2 }}>
                            <Chip 
                              label={`סה"כ ₪${getTotalSupplierAmount(milestone)}`}
                              size="small"
                              sx={{ bgcolor: 'rgba(96,165,250,0.2)', color: '#60a5fa', height: '24px' }}
                            />
                            <Chip 
                              label={`שולם ₪${getPaidAmount(milestone)}`}
                              size="small"
                              sx={{ bgcolor: 'rgba(34,197,94,0.2)', color: '#22c55e', height: '24px' }}
                            />
                            <Chip 
                              label={`לא שולם ₪${getUnpaidAmount(milestone)}`}
                              size="small"
                              sx={{ bgcolor: 'rgba(239,68,68,0.2)', color: '#ef4444', height: '24px' }}
                            />
                          </Box>
                        )}
                      </Box>
                      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }} onClick={(e) => e.stopPropagation()}>
                        <IconButton size="small" sx={{ color: '#fbbf24' }}>
                          <Star fontSize="small" />
                        </IconButton>
                        <FormControl size="small" sx={{ minWidth: 150 }}>
                          <Select
                            value={milestone.statusNumber || 1}
                            sx={{
                              color: '#ffffff',
                              '& .MuiOutlinedInput-notchedOutline': {
                                borderColor: 'rgba(168,85,247,0.5)'
                              },
                              '& .MuiSvgIcon-root': {
                                color: '#ffffff'
                              },
                              height: '32px',
                              bgcolor: milestone.statusNumber === 1 ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)'
                            }}
                          >
                            <MenuItem value={1}>בוצע</MenuItem>
                            <MenuItem value={2}>ממתין</MenuItem>
                          </Select>
                        </FormControl>
                        <IconButton 
                          size="small" 
                          sx={{ color: '#60a5fa' }}
                          onClick={() => handleEditMilestone(milestone, stage.name)}
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          sx={{ color: '#fca5a5' }}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails sx={{ bgcolor: 'rgba(19, 16, 33, 0.3)', pt: 2 }}>
                      {milestone.documentReference && (
                        <Box sx={{ display: 'flex', gap: 1, mb: 2, alignItems: 'center' }}>
                          <Description sx={{ color: '#a855f7' }} />
                          <Typography sx={{ color: 'rgba(255,255,255,0.9)' }}>
                            <strong>מסמך:</strong> {milestone.documentReference}
                          </Typography>
                        </Box>
                      )}
                      {milestone.suppliers && milestone.suppliers.length > 0 && (
                        <Box>
                          <Typography variant="subtitle2" sx={{ color: '#a855f7', mb: 1, fontWeight: 600 }}>
                            ספקים:
                          </Typography>
                          {milestone.suppliers.map((supplier: any, idx: number) => (
                            <Box key={idx} sx={{ 
                              display: 'flex', 
                              justifyContent: 'space-between', 
                              alignItems: 'center',
                              p: 1.5,
                              mb: 1,
                              bgcolor: 'rgba(45, 32, 74, 0.3)',
                              borderRadius: '8px',
                              border: '1px solid rgba(168,85,247,0.2)'
                            }}>
                              <Typography sx={{ color: '#60a5fa', fontWeight: 500 }}>
                                {supplier.supplierName}
                              </Typography>
                              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                                <Typography sx={{ color: '#ffffff' }}>₪{supplier.amount}</Typography>
                                <Chip 
                                  label={supplier.isPaid ? 'שולם' : 'לא שולם'}
                                  size="small"
                                  sx={{
                                    height: '24px',
                                    bgcolor: supplier.isPaid ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)',
                                    color: supplier.isPaid ? '#22c55e' : '#ef4444',
                                    fontWeight: 600
                                  }}
                                />
                              </Box>
                            </Box>
                          ))}
                        </Box>
                      )}
                    </AccordionDetails>
                  </Accordion>
                ))
              ) : (
                <Typography sx={{ color: 'rgba(255,255,255,0.5)', textAlign: 'center', py: 4 }}>
                  אין אבני דרך בשלב זה
                </Typography>
              )}
            </Box>
          ))
        ) : (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography sx={{ color: 'rgba(255,255,255,0.5)' }}>אין אבני דרך להצגה</Typography>
          </Box>
        )}
      </Paper>

      <MilestoneDialog
        open={dialogOpen}
        milestone={editingMilestone}
        stageName={editingStageName}
        onClose={() => setDialogOpen(false)}
        onSave={handleSaveMilestone}
      />
    </Box>
  );
};
