import React, { useState, useEffect, useRef } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Alert, Box, Typography, Fade, TextField, InputAdornment, IconButton, Skeleton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

function StockTable() {
  const [stocks, setStocks] = useState([]);
  const [filteredStocks, setFilteredStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');
  const toastShown = useRef(false); // Flag to prevent duplicate toast
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:8000/api/stocks/top10')
      .then(response => {
        setStocks(response.data);
        setFilteredStocks(response.data);
        setLoading(false);
        if (!toastShown.current) {
          toast.success('Stocks loaded successfully!');
          toastShown.current = true;
        }
      })
      .catch(err => {
        setError('Failed to load stocks');
        setLoading(false);
        toast.error('Failed to load stocks. Please try again.');
      });
  }, []); // Removed toastShown from dependencies since it's a ref

  useEffect(() => {
    let filtered = stocks.filter(stock =>
      stock.ticker.toLowerCase().includes(search.toLowerCase()) ||
      stock.company.toLowerCase().includes(search.toLowerCase())
    );

    if (sortField) {
      filtered = filtered.sort((a, b) => {
        const aValue = sortField === 'change_percent' ? a.change_percent : a.volume;
        const bValue = sortField === 'change_percent' ? b.change_percent : b.volume;
        return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
      });
    }

    setFilteredStocks(filtered);
  }, [search, stocks, sortField, sortOrder]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  if (loading) return (
    <Box sx={{ mt: 3 }}>
      <Skeleton variant="text" width="40%" height={60} sx={{ mb: 3 }} />
      <Skeleton variant="rectangular" width="100%" height={56} sx={{ mb: 2 }} />
      <Skeleton variant="rectangular" width="100%" height={400} />
    </Box>
  );
  if (error) return <Alert severity="error" sx={{ mt: 3 }}>{error}</Alert>;

  return (
    <Fade in={true} timeout={1000}>
      <Box sx={{ mt: 3 }}>
        <Typography variant="h4" gutterBottom align="center" sx={{ mb: 3, color: 'primary.main', textShadow: '2px 2px 4px rgba(0,0,0,0.2)' }}>
          Top 10 Stocks
        </Typography>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search by ticker or company..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 3, borderRadius: 2, '& .MuiOutlinedInput-root': { borderRadius: 8 } }}
        />
        <TableContainer component={Paper} sx={{ borderRadius: 3, overflow: 'hidden', boxShadow: 3 }}>
          <Table>
            <TableHead sx={{ background: 'linear-gradient(135deg, #009688 0%, #4caf50 100%)' }}>
              <TableRow>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Ticker</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Company</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Price</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                  Change %
                  <IconButton onClick={() => handleSort('change_percent')} sx={{ color: 'white', ml: 1, '&:hover': { color: '#ff9800' } }}>
                    {sortField === 'change_percent' ? (sortOrder === 'asc' ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />) : <ArrowUpwardIcon sx={{ opacity: 0.5 }} />}
                  </IconButton>
                </TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                  Volume
                  <IconButton onClick={() => handleSort('volume')} sx={{ color: 'white', ml: 1, '&:hover': { color: '#ff9800' } }}>
                    {sortField === 'volume' ? (sortOrder === 'asc' ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />) : <ArrowUpwardIcon sx={{ opacity: 0.5 }} />}
                  </IconButton>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredStocks.map(stock => (
                <TableRow
                  key={stock.ticker}
                  onClick={() => navigate(`/stock/${stock.ticker}`)}
                  sx={{ cursor: 'pointer', '&:hover': { backgroundColor: 'action.hover', transform: 'scale(1.01)', boxShadow: 2 }, transition: 'all 0.3s' }}
                >
                  <TableCell sx={{ fontWeight: 'bold' }}>{stock.ticker}</TableCell>
                  <TableCell>{stock.company}</TableCell>
                  <TableCell>${stock.price}</TableCell>
                  <TableCell sx={{ color: stock.change_percent >= 0 ? 'success.main' : 'error.main', fontWeight: 'bold' }}>
                    {stock.change_percent >= 0 ? <TrendingUpIcon /> : <TrendingDownIcon />} {stock.change_percent}%
                  </TableCell>
                  <TableCell>{stock.volume.toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Fade>
  );
}

export default StockTable;