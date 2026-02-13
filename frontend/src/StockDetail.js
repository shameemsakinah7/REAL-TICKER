import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, Typography, CircularProgress, Alert, Button, Box, Grid, Chip, Fade, Modal, Backdrop, Skeleton } from '@mui/material';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import BarChartIcon from '@mui/icons-material/BarChart';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import toast from 'react-hot-toast';

function StockDetail() {
  const { ticker } = useParams();
  const [history, setHistory] = useState([]);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    axios.get(`http://localhost:8000/api/stocks/${ticker}/history`)
      .then(response => {
        setHistory(response.data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load history');
        setLoading(false);
        toast.error('Failed to load stock history.');
      });
  }, [ticker]);

  const handleAnalyze = () => {
    setAnalyzing(true);
    axios.post(`http://localhost:8000/api/stocks/${ticker}/analyze`, { history })
      .then(response => {
        setAnalysis(response.data);
        setAnalyzing(false);
        setOpenModal(true);
        toast.success('AI analysis completed!');
      })
      .catch(err => {
        setError('Failed to analyze');
        setAnalyzing(false);
        toast.error('AI analysis failed. Please try again.');
      });
  };

  const currentStock = history.length > 0 ? history[history.length - 1] : null;

  if (loading) return (
    <Box sx={{ mt: 3 }}>
      <Skeleton variant="text" width="50%" height={60} sx={{ mb: 3 }} />
      <Grid container spacing={4}>
        <Grid item xs={12}><Skeleton variant="rectangular" height={400} /></Grid>
        <Grid item xs={12}><Skeleton variant="rectangular" height={200} /></Grid>
      </Grid>
    </Box>
  );
  if (error) return <Alert severity="error" sx={{ mt: 3 }}>{error}</Alert>;

  return (
    <Fade in={true} timeout={1000}>
      <Box sx={{ mt: 3 }}>
        <Typography variant="h4" gutterBottom align="center" sx={{ mb: 3, textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>
          {ticker} Details
        </Typography>
        {/* Metrics Dashboard - Uniform Sizes, Centered Cards */}
        <Grid container spacing={3} sx={{ mb: 4, justifyContent: 'center' }}>
          <Grid item xs={12} md={4} sx={{ display: 'flex', justifyContent: 'center' }}>
            <Card sx={{ textAlign: 'center', background: 'linear-gradient(135deg, #009688 0%, #4caf50 100%)', color: 'white', minHeight: 150, width: '100%', maxWidth: 300 }}>
              <CardContent>
                <AttachMoneyIcon sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h6">Current Price</Typography>
                <Typography variant="h4">${currentStock ? currentStock.price : 'N/A'}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4} sx={{ display: 'flex', justifyContent: 'center' }}>
            <Card sx={{ textAlign: 'center', background: 'linear-gradient(135deg, #ff9800 0%, #f44336 100%)', color: 'white', minHeight: 150, width: '100%', maxWidth: 300 }}>
              <CardContent>
                <TrendingUpIcon sx={{ fontSize: 40, mb: 1, color: currentStock && currentStock.price - history[0].price >= 0 ? 'success.main' : 'error.main' }} />
                <Typography variant="h6">Change %</Typography>
                <Typography variant="h4">{currentStock ? `${currentStock.price - history[0].price > 0 ? '+' : ''}${(currentStock.price - history[0].price).toFixed(2)}` : 'N/A'}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4} sx={{ display: 'flex', justifyContent: 'center' }}>
            <Card sx={{ textAlign: 'center', background: 'linear-gradient(135deg, #2196f3 0%, #009688 100%)', color: 'white', minHeight: 150, width: '100%', maxWidth: 300 }}>
              <CardContent>
                <BarChartIcon sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h6">Volume</Typography>
                <Typography variant="h4">{currentStock ? 'High' : 'N/A'}</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        <Grid container spacing={4} direction="column">
          {/* Smaller Price History Chart */}
          <Grid item xs={12}>
            <Card sx={{ boxShadow: 5 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ color: 'secondary.main' }}>Price History (6 Months)</Typography>
                <ResponsiveContainer width="100%" height={450}>
                  <AreaChart data={history}>
                    <defs>
                      <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#009688" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#009688" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip contentStyle={{ backgroundColor: '#161b22', border: 'none', borderRadius: 8 }} />
                    <Area type="monotone" dataKey="price" stroke="#009688" fillOpacity={1} fill="url(#colorPrice)" strokeWidth={3} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
          {/* AI Analysis */}
          <Grid item xs={12}>
            <Card sx={{ textAlign: 'center', boxShadow: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>AI Analysis</Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>Click to generate insights powered by AI.</Typography>
                <Button
                  variant="contained"
                  startIcon={<AnalyticsIcon />}
                  onClick={handleAnalyze}
                  disabled={analyzing}
                  sx={{
                    background: 'linear-gradient(135deg, #009688 0%, #4caf50 100%)',
                    '&:hover': { background: 'linear-gradient(135deg, #4caf50 0%, #009688 100%)', transform: 'scale(1.05)' },
                    transition: 'all 0.3s',
                  }}
                >
                  {analyzing ? <CircularProgress size={20} /> : 'Analyze with AI'}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        <Modal
          open={openModal}
          onClose={() => setOpenModal(false)}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{ timeout: 500 }}
        >
          <Fade in={openModal}>
            <Box sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 400,
              bgcolor: 'background.paper',
              borderRadius: 3,
              boxShadow: 24,
              p: 4,
            }}>
              <Typography variant="h6" gutterBottom>AI Insights for {ticker}</Typography>
              {analysis && (
                <>
                  <Box sx={{ mb: 2 }}>
                    <Chip label={`Trend: ${analysis.analysis.trend}`} color="primary" sx={{ mr: 1 }} />
                    <Chip label={`Risk: ${analysis.analysis.risk_level}`} color="secondary" />
                  </Box>
                  <Typography><strong>Suggested Action:</strong> {analysis.analysis.suggested_action}</Typography>
                  <Typography variant="caption" sx={{ mt: 2, display: 'block', color: 'text.secondary' }}>
                    {analysis.disclaimer}
                  </Typography>
                </>
              )}
              <Button onClick={() => setOpenModal(false)} sx={{ mt: 2 }}>Close</Button>
            </Box>
          </Fade>
        </Modal>
      </Box>
    </Fade>
  );
}

export default StockDetail;