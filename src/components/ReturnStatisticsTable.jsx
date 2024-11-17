import React from 'react';
import { Table, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const ReturnStatisticsTable = ({ results }) => {
  const { avgCAGR, minCAGR, maxCAGR, medianCAGR, percentageDistributionPercent } = results || {};


  return (
    <TableContainer component={Paper} style={{ marginLeft: 20, minWidth: 600 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell colSpan={4} align="center" sx={{ borderRight: '1px solid black' }}>
              <strong>Return Statistics %</strong>
            </TableCell>
            <TableCell colSpan={6} align="center">
              <strong>Return Distribution (% of times)</strong>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Avg CAGR</TableCell>
            <TableCell>Min CAGR</TableCell>
            <TableCell>Max CAGR</TableCell>
            <TableCell sx={{ borderRight: '1px solid black' }}>Median CAGR</TableCell>
            <TableCell>{'<0%'}</TableCell>
            <TableCell>{'0-8%'}</TableCell>
            <TableCell>{'8-12%'}</TableCell>
            <TableCell>{'12-15%'}</TableCell>
            <TableCell>{'15-20%'}</TableCell>
            <TableCell>{'>20%'}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>{}</TableCell>
            <TableCell>{avgCAGR || '-'}</TableCell>
            <TableCell>{minCAGR || '-'}</TableCell>
            <TableCell>{maxCAGR || '-'}</TableCell>
            <TableCell sx={{ borderRight: '1px solid black' }}>{medianCAGR || '-'}</TableCell>
            <TableCell>{percentageDistributionPercent['<0%'] || '-'}</TableCell>
            <TableCell>{percentageDistributionPercent['0-8%'] || '-'}</TableCell>
            <TableCell>{percentageDistributionPercent['8-12%'] || '-'}</TableCell>
            <TableCell>{percentageDistributionPercent['12-15%'] || '-'}</TableCell>
            <TableCell>{percentageDistributionPercent['15-20%'] || '-'}</TableCell>
            <TableCell>{percentageDistributionPercent['>20%'] || '-'}</TableCell>
          </TableRow>
        </TableHead>
      </Table>
    </TableContainer>
  );
};

export default ReturnStatisticsTable;
