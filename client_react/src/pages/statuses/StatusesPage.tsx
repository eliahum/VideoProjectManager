import { useEffect } from 'react';
import { Typography, Box, CircularProgress, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tabs, Tab } from '@mui/material';
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

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        סטטוסים
      </Typography>

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="סטטוסי פרויקט" />
          <Tab label="סטטוסי Milestone" />
          <Tab label="סטטוסי ליד" />
        </Tabs>
      </Box>

      {/* Project Statuses */}
      {tabValue === 0 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>מספר סטטוס</TableCell>
                <TableCell>שם</TableCell>
                <TableCell>מספר פרויקטים</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {projectStatuses.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    אין סטטוסי פרויקט
                  </TableCell>
                </TableRow>
              ) : (
                projectStatuses.map((status) => (
                  <TableRow key={status.id}>
                    <TableCell>{status.statusNumber}</TableCell>
                    <TableCell>{status.name}</TableCell>
                    <TableCell>{status.projectCount || 0}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Milestone Statuses */}
      {tabValue === 1 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>מספר סטטוס</TableCell>
                <TableCell>שם</TableCell>
                <TableCell>מספר Milestones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {milestoneStatuses.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    אין סטטוסי milestone
                  </TableCell>
                </TableRow>
              ) : (
                milestoneStatuses.map((status) => (
                  <TableRow key={status.id}>
                    <TableCell>{status.statusNumber}</TableCell>
                    <TableCell>{status.name}</TableCell>
                    <TableCell>{status.milestoneCount || 0}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Lead Statuses */}
      {tabValue === 2 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>מספר סטטוס</TableCell>
                <TableCell>שם</TableCell>
                <TableCell>סטטוס סופי?</TableCell>
                <TableCell>מספר לידים</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {leadStatuses.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    אין סטטוסי ליד
                  </TableCell>
                </TableRow>
              ) : (
                leadStatuses.map((status) => (
                  <TableRow key={status.id}>
                    <TableCell>{status.statusNumber}</TableCell>
                    <TableCell>{status.name}</TableCell>
                    <TableCell>{status.isFinal ? 'כן' : 'לא'}</TableCell>
                    <TableCell>{status.leadCount || 0}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
};
