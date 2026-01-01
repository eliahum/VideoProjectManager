import { Typography, Grid, Card, CardContent } from '@mui/material';

export const DashboardPage = () => {
  return (
    <div>
      <Typography variant="h4" gutterBottom>
        דשבורד
      </Typography>

      <Grid container spacing={3}>
        <Grid xs={12} sm={6} md={3}>
          <Card sx={{ background: 'rgba(139, 92, 246, 0.1)' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                פרויקטים פעילים
              </Typography>
              <Typography variant="h3">0</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <Card sx={{ background: 'rgba(139, 92, 246, 0.1)' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                לקוחות
              </Typography>
              <Typography variant="h3">0</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <Card sx={{ background: 'rgba(139, 92, 246, 0.1)' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                לידים
              </Typography>
              <Typography variant="h3">0</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <Card sx={{ background: 'rgba(139, 92, 246, 0.1)' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                ספקים
              </Typography>
              <Typography variant="h3">0</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};
