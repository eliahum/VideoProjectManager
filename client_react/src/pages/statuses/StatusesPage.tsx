import { useEffect } from 'react';
import { Typography, Box, CircularProgress, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tabs, Tab, Chip } from '@mui/material';
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import { fetchProjectStatuses, fetchMilestoneStatuses, fetchLeadStatuses } from '../../store/statusesSlice';

export const StatusesPage = () => {
  const dispatch = useAppDispatch();
  const { projectStatuses, milestoneStatuses, leadStatuses, loading, error } = useAppSelector((state) => state.statuses);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    dispatch(fetchProjectStatuses());
    dispatch(fetchMilestoneStatuses());
    dispatch(fetchLeadStatuses());
  }, [dispatch]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  const getIsFinalChip = (isFinal: boolean) => {
    return (
      <Chip 
        label={isFinal ? 'כן' : 'לא'} 
        sx={{
          bgcolor: isFinal ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)',
          color: isFinal ? '#22c55e' : '#ef4444',
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
      {/* Header */}
      <Typography variant="h4" sx={{ fontSize: '2rem', margin: 0, color: '#ffffff', mb: 4 }}>
        סטטוסים
      </Typography>

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      <Box sx={{ 
        borderBottom: 1, 
        borderColor: 'rgba(209, 196, 255, 0.3)', 
        mb: 3 
      }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange}
          sx={{
            '& .MuiTab-root': {
              color: 'rgba(244, 240, 255, 0.7)',
              fontSize: '16px',
              fontWeight: 500,
              '&.Mui-selected': {
                color: '#ffffff',
              }
            },
            '& .MuiTabs-indicator': {
              backgroundColor: '#a855f7',
              height: '3px',
            }
          }}
        >
          <Tab label="סטטוסי פרויקט" />
          <Tab label="סטטוסי Milestone" />
          <Tab label="סטטוסי ליד" />
        </Tabs>
      </Box>

      {/* Project Statuses */}
      {tabValue === 0 && (
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
                <TableCell sx={{ 
                  color: '#fefbff !important', 
                  fontWeight: 600,
                  fontSize: '16px',
                  padding: '8px 12px',
                  borderBottom: '1px solid rgba(209, 196, 255, 0.45)'
                }}>מספר סטטוס</TableCell>
                <TableCell sx={{ 
                  color: '#fefbff !important', 
                  fontWeight: 600,
                  fontSize: '16px',
                  padding: '8px 12px',
                  borderBottom: '1px solid rgba(209, 196, 255, 0.45)'
                }}>שם</TableCell>
                <TableCell sx={{ 
                  color: '#fefbff !important', 
                  fontWeight: 600,
                  fontSize: '16px',
                  padding: '8px 12px',
                  borderBottom: '1px solid rgba(209, 196, 255, 0.45)'
                }}>מספר פרויקטים</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {projectStatuses.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} align="center" sx={{ 
                    color: '#ffffff',
                    padding: '24px',
                    borderBottom: 'none'
                  }}>
                    אין סטטוסי פרויקט
                  </TableCell>
                </TableRow>
              ) : (
                projectStatuses.map((status, index) => (
                  <TableRow 
                    key={status.id}
                    sx={{ 
                      bgcolor: index % 2 === 0 ? 'rgba(32, 24, 58, 0.92)' : 'rgba(45, 32, 74, 0.94)',
                      '&:hover': { 
                        bgcolor: 'rgba(186, 161, 255, 0.35)',
                      }
                    }}
                  >
                    <TableCell sx={{ 
                      padding: '8px 12px',
                      fontSize: '16px',
                      color: '#60a5fa !important',
                      borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
                    }}>
                      {status.statusNumber}
                    </TableCell>
                    <TableCell sx={{ 
                      padding: '8px 12px',
                      fontSize: '16px',
                      color: '#ffffff',
                      borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
                    }}>
                      {status.name}
                    </TableCell>
                    <TableCell sx={{ 
                      padding: '8px 12px',
                      fontSize: '16px',
                      color: '#ffffff',
                      borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
                    }}>
                      {status.projectCount || 0}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Milestone Statuses */}
      {tabValue === 1 && (
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
                <TableCell sx={{ 
                  color: '#fefbff !important', 
                  fontWeight: 600,
                  fontSize: '16px',
                  padding: '8px 12px',
                  borderBottom: '1px solid rgba(209, 196, 255, 0.45)'
                }}>מספר סטטוס</TableCell>
                <TableCell sx={{ 
                  color: '#fefbff !important', 
                  fontWeight: 600,
                  fontSize: '16px',
                  padding: '8px 12px',
                  borderBottom: '1px solid rgba(209, 196, 255, 0.45)'
                }}>שם</TableCell>
                <TableCell sx={{ 
                  color: '#fefbff !important', 
                  fontWeight: 600,
                  fontSize: '16px',
                  padding: '8px 12px',
                  borderBottom: '1px solid rgba(209, 196, 255, 0.45)'
                }}>מספר Milestones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {milestoneStatuses.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} align="center" sx={{ 
                    color: '#ffffff',
                    padding: '24px',
                    borderBottom: 'none'
                  }}>
                    אין סטטוסי milestone
                  </TableCell>
                </TableRow>
              ) : (
                milestoneStatuses.map((status, index) => (
                  <TableRow 
                    key={status.id}
                    sx={{ 
                      bgcolor: index % 2 === 0 ? 'rgba(32, 24, 58, 0.92)' : 'rgba(45, 32, 74, 0.94)',
                      '&:hover': { 
                        bgcolor: 'rgba(186, 161, 255, 0.35)',
                      }
                    }}
                  >
                    <TableCell sx={{ 
                      padding: '8px 12px',
                      fontSize: '16px',
                      color: '#60a5fa !important',
                      borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
                    }}>
                      {status.statusNumber}
                    </TableCell>
                    <TableCell sx={{ 
                      padding: '8px 12px',
                      fontSize: '16px',
                      color: '#ffffff',
                      borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
                    }}>
                      {status.name}
                    </TableCell>
                    <TableCell sx={{ 
                      padding: '8px 12px',
                      fontSize: '16px',
                      color: '#ffffff',
                      borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
                    }}>
                      {status.milestoneCount || 0}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Lead Statuses */}
      {tabValue === 2 && (
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
                <TableCell sx={{ 
                  color: '#fefbff !important', 
                  fontWeight: 600,
                  fontSize: '16px',
                  padding: '8px 12px',
                  borderBottom: '1px solid rgba(209, 196, 255, 0.45)'
                }}>מספר סטטוס</TableCell>
                <TableCell sx={{ 
                  color: '#fefbff !important', 
                  fontWeight: 600,
                  fontSize: '16px',
                  padding: '8px 12px',
                  borderBottom: '1px solid rgba(209, 196, 255, 0.45)'
                }}>שם</TableCell>
                <TableCell sx={{ 
                  color: '#fefbff !important', 
                  fontWeight: 600,
                  fontSize: '16px',
                  padding: '8px 12px',
                  borderBottom: '1px solid rgba(209, 196, 255, 0.45)'
                }}>סטטוס סופי?</TableCell>
                <TableCell sx={{ 
                  color: '#fefbff !important', 
                  fontWeight: 600,
                  fontSize: '16px',
                  padding: '8px 12px',
                  borderBottom: '1px solid rgba(209, 196, 255, 0.45)'
                }}>מספר לידים</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {leadStatuses.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ 
                    color: '#ffffff',
                    padding: '24px',
                    borderBottom: 'none'
                  }}>
                    אין סטטוסי ליד
                  </TableCell>
                </TableRow>
              ) : (
                leadStatuses.map((status, index) => (
                  <TableRow 
                    key={status.id}
                    sx={{ 
                      bgcolor: index % 2 === 0 ? 'rgba(32, 24, 58, 0.92)' : 'rgba(45, 32, 74, 0.94)',
                      '&:hover': { 
                        bgcolor: 'rgba(186, 161, 255, 0.35)',
                      }
                    }}
                  >
                    <TableCell sx={{ 
                      padding: '8px 12px',
                      fontSize: '16px',
                      color: '#60a5fa !important',
                      borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
                    }}>
                      {status.statusNumber}
                    </TableCell>
                    <TableCell sx={{ 
                      padding: '8px 12px',
                      fontSize: '16px',
                      color: '#ffffff',
                      borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
                    }}>
                      {status.name}
                    </TableCell>
                    <TableCell sx={{ 
                      padding: '8px 12px',
                      borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
                    }}>
                      {getIsFinalChip(status.isFinal)}
                    </TableCell>
                    <TableCell sx={{ 
                      padding: '8px 12px',
                      fontSize: '16px',
                      color: '#ffffff',
                      borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
                    }}>
                      {status.leadCount || 0}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};
