import React from 'react';
import { Table, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const ReturnStatisticsTable = ({ results }) => {
  const { avgCAGR, minCAGR, maxCAGR, medianCAGR, percentageDistributionPercent } = results || {};


  return (
    <TableContainer component={Paper} style={{ marginLeft: 20, minWidth: 600 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell colSpan={2} align="center">
              <strong>Return Statistics %</strong>
            </TableCell>
            <TableCell colSpan={2} align="center">
              <strong>Return Distribution (% of times)</strong>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Avg CAGR</TableCell>
            <TableCell>{avgCAGR || '-'}</TableCell>
            <TableCell>{'<0%'}</TableCell>
            <TableCell>{percentageDistributionPercent['<0%'] || '-'}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Min CAGR</TableCell>
            <TableCell>{minCAGR || '-'}</TableCell>
            <TableCell>{'0-8%'}</TableCell>
            <TableCell>{percentageDistributionPercent['0-8%'] || '-'}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Max CAGR</TableCell>
            <TableCell>{maxCAGR || '-'}</TableCell>
            <TableCell>{'8-12%'}</TableCell>
            <TableCell>{percentageDistributionPercent['8-12%'] || '-'}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Median CAGR</TableCell>
            <TableCell>{medianCAGR || '-'}</TableCell>
            <TableCell>{'12-15%'}</TableCell>
            <TableCell>{percentageDistributionPercent['12-15%'] || '-'}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell>{'15-20%'}</TableCell>
            <TableCell>{percentageDistributionPercent['15-20%'] || '-'}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell>{'>20%'}</TableCell>
            <TableCell>{percentageDistributionPercent['>20%'] || '-'}</TableCell>
          </TableRow>
        </TableHead>
      </Table>
    </TableContainer>
  );
};

export default ReturnStatisticsTable;
