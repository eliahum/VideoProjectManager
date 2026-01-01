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
    <div>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">לקוחות</Typography>
        <Button variant="contained" startIcon={<Add />}>
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
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>מספר</TableCell>
                <TableCell>שם</TableCell>
                <TableCell>חברה</TableCell>
                <TableCell>טלפון</TableCell>
                <TableCell>אימייל</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {customers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>{customer.customerId}</TableCell>
                  <TableCell>{customer.name || '-'}</TableCell>
                  <TableCell>{customer.companyName}</TableCell>
                  <TableCell>{customer.phone}</TableCell>
                  <TableCell>{customer.email || '-'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
};
