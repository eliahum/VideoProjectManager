import { useEffect } from 'react';
import { Typography, Button, Box, CircularProgress, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { Add } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import { fetchCustomers } from '../../store/customersSlice';

export const CustomersPage = () => {
  const dispatch = useAppDispatch();
  const { customers, loading, error } = useAppSelector((state) => state.customers);

  useEffect(() => {
    dispatch(fetchCustomers());
  }, [dispatch]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: '1400px', margin: '0 auto', padding: '0 16px', color: '#f4f0ff' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontSize: '2rem', margin: 0, color: '#ffffff' }}>
          לקוחות
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<Add />}
          sx={{ ml: 2 }}
        >
          לקוח חדש
        </Button>
      </Box>

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      {customers.length === 0 ? (
        <Typography>אין לקוחות</Typography>
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
                }}>אימייל</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {customers.map((customer, index) => (
                <TableRow 
                  key={customer.id}
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
                    {customer.customerId}
                  </TableCell>
                  <TableCell sx={{ 
                    padding: '8px 12px',
                    fontSize: '16px',
                    color: '#ffffff',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
                  }}>
                    {customer.name || '-'}
                  </TableCell>
                  <TableCell sx={{ 
                    padding: '8px 12px',
                    fontSize: '16px',
                    color: '#ffffff',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
                  }}>
                    {customer.companyName}
                  </TableCell>
                  <TableCell sx={{ 
                    padding: '8px 12px',
                    fontSize: '16px',
                    color: '#ffffff',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
                  }}>
                    {customer.phone}
                  </TableCell>
                  <TableCell sx={{ 
                    padding: '8px 12px',
                    fontSize: '16px',
                    color: '#ffffff',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
                  }}>
                    {customer.email || '-'}
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
