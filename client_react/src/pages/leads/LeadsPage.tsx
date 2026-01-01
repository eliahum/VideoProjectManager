import { useEffect } from 'react';
import { Typography, Button, Box, CircularProgress, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
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

  return (
    <div>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">לידים</Typography>
        <Button variant="contained" startIcon={<Add />}>
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
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>מספר</TableCell>
                <TableCell>שם</TableCell>
                <TableCell>חברה</TableCell>
                <TableCell>טלפון</TableCell>
                <TableCell>מקור</TableCell>
                <TableCell>סטטוס</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {leads.map((lead) => (
                <TableRow key={lead.id}>
                  <TableCell>{lead.leadId}</TableCell>
                  <TableCell>{lead.name}</TableCell>
                  <TableCell>{lead.companyName}</TableCell>
                  <TableCell>{lead.phone}</TableCell>
                  <TableCell>{lead.source}</TableCell>
                  <TableCell>{lead.statusNumber}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
};
