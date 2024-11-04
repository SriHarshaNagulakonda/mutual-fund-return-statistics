import { useEffect, useState } from 'react';
import moment from 'moment';
import { findNavByDate, findCAGRByNAV, minMaxMeanMedian } from '../utils';

const calculateRollingReturns = (navData, rollingPeriod = 3, totalRange = 10) => {
  if (rollingPeriod > totalRange) {
    return {
      message: 'Rolling Period exceeded',
      statusCode: 403,
      data: {}
    };
  }

  const today = moment();
  const startDate = today.clone().subtract(12 * totalRange, 'months');
  const [startDateNav, startDateIndex] = findNavByDate(navData, startDate.format('DD-MM-YYYY'));

  if (!startDateNav) {
    return {
      message: `Scheme is started on ${navData[navData.length - 1]?.date}`,
      statusCode: 403,
      data: {}
    };
  }

  const rollingEndDate = today.clone().subtract(12 * (totalRange - rollingPeriod), 'months');
  const [rollingEndDateNav, rollingEndIndex] = findNavByDate(navData, rollingEndDate.format('DD-MM-YYYY'));

  const rollingCAGRs = [];
  for (let endIndex = rollingEndIndex; endIndex >= 0; endIndex--) {
    const startNav = navData[startDateIndex]?.nav;
    const endNav = navData[endIndex]?.nav;
    const cagr = findCAGRByNAV(startNav, endNav, rollingPeriod);
    rollingCAGRs.push(cagr);
  }

  const [minCagr, maxCagr, meanCagr, medianCagr] = minMaxMeanMedian(rollingCAGRs);
  const percentageDistribution = {
    "<0%": 0, "0-8%": 0, "8-12%": 0, "12-15%": 0, "15-20%": 0, ">20%": 0, "above_avg": 0
  };

  rollingCAGRs.forEach(cagr => {
    if (cagr > meanCagr) percentageDistribution['above_avg']++;
    if (cagr < 0) percentageDistribution['<0%']++;
    else if (cagr <= 8) percentageDistribution['0-8%']++;
    else if (cagr <= 12) percentageDistribution['8-12%']++;
    else if (cagr <= 15) percentageDistribution['12-15%']++;
    else if (cagr <= 20) percentageDistribution['15-20%']++;
    else percentageDistribution['>20%']++;
  });

  const todayNav = navData[0]?.nav;
  return {
    [`${totalRange}Y CAGR`]: findCAGRByNAV(startDateNav, todayNav, totalRange),
    avgCAGR: meanCagr,
    minCAGR: minCagr,
    maxCAGR: maxCagr,
    medianCAGR: medianCagr,
    percentageDistribution: Object.fromEntries(
      Object.entries(percentageDistribution).map(([key, value]) => [key, parseFloat((value * 100 / rollingCAGRs.length).toFixed(2))])
    )
  };
};

// Usage in React component
const RollingReturnsWrapper = ({ navData }) => {
  const [results, setResults] = useState(null);

  useEffect(() => {
    if (navData) {
      const calculatedReturns = calculateRollingReturns(navData);
      setResults(calculatedReturns);
    }
  }, [navData]);

  return (
    <div>
      {results && (
        <div>
          <h3>Rolling Returns</h3>
          <pre>{JSON.stringify(results, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default RollingReturnsWrapper;
