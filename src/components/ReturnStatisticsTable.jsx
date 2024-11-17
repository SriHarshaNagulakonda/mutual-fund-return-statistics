import React from 'react';
import { Table, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const ReturnStatisticsTable = ({ results, fundNames }) => {
  // const { avgCAGR, minCAGR, maxCAGR, medianCAGR, percentageDistributionPercent } = results || {};

  return (
    <TableContainer component={Paper} style={{ marginLeft: 20, minWidth: 600 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell colSpan={5} align="center" sx={{ borderRight: '1px solid black' }}>
              <strong>Return Statistics %</strong>
            </TableCell>
            <TableCell colSpan={6} align="center">
              <strong>Return Distribution (% of times)</strong>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell><strong>Name</strong></TableCell>
            <TableCell><strong>Avg CAGR</strong></TableCell>
            <TableCell><strong>Min CAGR</strong></TableCell>
            <TableCell><strong>Max CAGR</strong></TableCell>
            <TableCell sx={{ borderRight: '1px solid black' }}><strong>Median CAGR</strong></TableCell>
            <TableCell><strong>{'<0%'}</strong></TableCell>
            <TableCell><strong>{'0-8%'}</strong></TableCell>
            <TableCell><strong>{'8-12%'}</strong></TableCell>
            <TableCell><strong>{'12-15%'}</strong></TableCell>
            <TableCell><strong>{'15-20%'}</strong></TableCell>
            <TableCell><strong>{'>20%'}</strong></TableCell>
          </TableRow>
          </TableHead>
          {results?.map((row, index) =>  (<TableRow>
            <TableCell>{fundNames[index]}</TableCell>
            <TableCell>{row.avgCAGR || '-'}</TableCell>
            <TableCell>{row.minCAGR || '-'}</TableCell>
            <TableCell>{row.maxCAGR || '-'}</TableCell>
            <TableCell sx={{ borderRight: '1px solid black' }}>{row.medianCAGR || '-'}</TableCell>
            <TableCell>{row.percentageDistributionPercent['<0%'] || '-'}</TableCell>
            <TableCell>{row.percentageDistributionPercent['0-8%'] || '-'}</TableCell>
            <TableCell>{row.percentageDistributionPercent['8-12%'] || '-'}</TableCell>
            <TableCell>{row.percentageDistributionPercent['12-15%'] || '-'}</TableCell>
            <TableCell>{row.percentageDistributionPercent['15-20%'] || '-'}</TableCell>
            <TableCell>{row.percentageDistributionPercent['>20%'] || '-'}</TableCell>
          </TableRow>))}
      </Table>
    </TableContainer>
  );
};

export default ReturnStatisticsTable;
