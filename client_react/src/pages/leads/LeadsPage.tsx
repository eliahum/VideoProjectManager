import { useEffect } from 'react';
import { Typography, Button, Box, CircularProgress, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip } from '@mui/material';
import { Add } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import { fetchLeads } from '../../store/leadsSlice';

export const LeadsPage = () => {
  const dispatch = useAppDispatch();
  const { leads, loading, error } = useAppSelector((state) => state.leads);

  useEffect(() => {
    dispatch(fetchLeads());
  }, [dispatch]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  const getStatusChip = (statusNumber: number) => {
    return (
      <Chip 
        label={statusNumber || '-'} 
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

  return (
    <Box sx={{ maxWidth: '1400px', margin: '0 auto', padding: '0 16px', color: '#f4f0ff' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontSize: '2rem', margin: 0, color: '#ffffff' }}>
          לידים
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<Add />}
          sx={{ ml: 2 }}
        >
          ליד חדש
        </Button>
      </Box>

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      {leads.length === 0 ? (
        <Typography>אין לידים</Typography>
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
                <TableCell sx={{ 
                  color: '#fefbff !important', 
                  fontWeight: 600,
                  fontSize: '16px',
                  padding: '8px 12px',
                  borderBottom: '1px solid rgba(209, 196, 255, 0.45)'
                }}>מספר</TableCell>
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
                }}>חברה</TableCell>
                <TableCell sx={{ 
                  color: '#fefbff !important', 
                  fontWeight: 600,
                  fontSize: '16px',
                  padding: '8px 12px',
                  borderBottom: '1px solid rgba(209, 196, 255, 0.45)'
                }}>טלפון</TableCell>
                <TableCell sx={{ 
                  color: '#fefbff !important', 
                  fontWeight: 600,
                  fontSize: '16px',
                  padding: '8px 12px',
                  borderBottom: '1px solid rgba(209, 196, 255, 0.45)'
                }}>מקור</TableCell>
                <TableCell sx={{ 
                  color: '#fefbff !important', 
                  fontWeight: 600,
                  fontSize: '16px',
                  padding: '8px 12px',
                  borderBottom: '1px solid rgba(209, 196, 255, 0.45)'
                }}>סטטוס</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {leads.map((lead, index) => (
                <TableRow 
                  key={lead.id}
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
                    {lead.leadId}
                  </TableCell>
                  <TableCell sx={{ 
                    padding: '8px 12px',
                    fontSize: '16px',
                    color: '#ffffff',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
                  }}>
                    {lead.name}
                  </TableCell>
                  <TableCell sx={{ 
                    padding: '8px 12px',
                    fontSize: '16px',
                    color: '#ffffff',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
                  }}>
                    {lead.companyName}
                  </TableCell>
                  <TableCell sx={{ 
                    padding: '8px 12px',
                    fontSize: '16px',
                    color: '#ffffff',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
                  }}>
                    {lead.phone}
                  </TableCell>
                  <TableCell sx={{ 
                    padding: '8px 12px',
                    fontSize: '16px',
                    color: '#ffffff',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
                  }}>
                    {lead.source || '-'}
                  </TableCell>
                  <TableCell sx={{ 
                    padding: '8px 12px',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
                  }}>
                    {getStatusChip(lead.statusNumber)}
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
