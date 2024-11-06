import { useEffect, useState } from 'react';
import moment from 'moment';
import { findNavByDate, findCAGRByNAV, minMaxMeanMedian } from '../utils';
import Chart from 'react-apexcharts'
import ReactApexChart from 'react-apexcharts';
import { Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import RollingPercentageDistribution from './RollingPercentageDistribution';
import ReturnStatisticsTable from './ReturnStatisticsTable';

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
  let [startDateNav, startDateIndex] = findNavByDate(navData, startDate.format('DD-MM-YYYY'));

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
  const startDates = [];
  for (let endIndex = rollingEndIndex; endIndex >= 0; endIndex--) {
    const startNav = navData[startDateIndex]?.nav;
    startDates.push(navData[startDateIndex]?.date);
    startDateIndex -= 1;
    const endNav = navData[endIndex]?.nav;
    const cagr = findCAGRByNAV(startNav, endNav, rollingPeriod);
    rollingCAGRs.push(cagr);
  }

  const [minCagr, maxCagr, meanCagr, medianCagr] = minMaxMeanMedian(rollingCAGRs);
  const percentageDistribution = {
    "<0%": 0, "0-8%": 0, "8-12%": 0, "12-15%": 0, "15-20%": 0, ">20%": 0
  };

  rollingCAGRs.forEach(cagr => {
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
    percentageDistribution: percentageDistribution,
    percentageDistributionPercent: Object.fromEntries(
      Object.entries(percentageDistribution).map(([key, value]) => [key, parseFloat((value * 100 / rollingCAGRs.length).toFixed(2))])
    ),
    dates: startDates,
    cagrs: rollingCAGRs
  };
};

// Usage in React component
const RollingReturnsWrapper = ({ navData }) => {
  const [results, setResults] = useState(null);
  const [options, setOptions] = useState(null);
  const [series, setSeries] = useState(null);
  const [rollingPeriod, setRollingPeriod] = useState("3");

  useEffect(() => {
    if (navData) {
      const calculatedReturns = calculateRollingReturns(navData, rollingPeriod);
      setResults(calculatedReturns);
    }
  }, [navData, rollingPeriod]);

  useEffect(() => {
    if(results?.length==0){
      return;
    }
    setOptions({
      chart: {
        height: 500,
        width: 1200,
        type: 'line',
        zoom: {
          enabled: false
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'smooth'
      },
      title: {
        text: `Rolling Returns - ${rollingPeriod}Y CAGR`,
        align: 'left'
      },
      grid: {
        row: {
          colors: ['#f3f3f3', 'transparent'], 
          opacity: 0.5
        },
      },
      xaxis: {
        type: 'date',
        categories: results?.dates // || ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
      },
      annotations: {
        yaxis: [
          {
            y: results?.avgCAGR,
            borderColor: 'green',
            label: {
              text: 'Average: '+results?.avgCAGR+'%',
              style: {
                color: '#fff',
                background: 'green'
              }
            }
          },
          {
            y: results?.minCAGR,
            borderColor: 'red',
            label: {
              text: 'Lowest: '+results?.minCAGR+'%',
              style: {
                color: '#fff',
                background: 'red'
              }
            }
          },
          {
            y: results?.maxCAGR,
            borderColor: 'red',
            label: {
              text: 'Highest: '+results?.maxCAGR+'%',
              style: {
                color: '#fff',
                background: 'red'
              }
            }
          }
        ]
      }  
    });
    setSeries([{
      name: "Returns %",
      data: results?.cagrs 
    }])
  }, [results, rollingPeriod]);

  const handlePeriodChange = (event) => {
    setRollingPeriod(event.target.value);
  };

  return (
    <div>
      {series && (
        <div>
          <h3>Rolling Returns</h3>
          <FormControl variant="outlined" style={{ marginBottom: 20, minWidth: 200 }}>
            <InputLabel id="rolling-period-label">Rolling Period</InputLabel>
            <Select
              labelId="rolling-period-label"
              id="rolling-period"
              value={rollingPeriod}
              onChange={handlePeriodChange}
              label="Rolling Period"
            >
              <MenuItem value="1">Rolling Returns 1Y CAGR</MenuItem>
              <MenuItem value="2">Rolling Returns 2Y CAGR</MenuItem>
              <MenuItem value="3">Rolling Returns 3Y CAGR</MenuItem>
              <MenuItem value="5">Rolling Returns 5Y CAGR</MenuItem>
              <MenuItem value="7">Rolling Returns 7Y CAGR</MenuItem>
            </Select>
          </FormControl>
          <ReactApexChart options={options} series={series} type="line" height={500} width={1200} />
          <div style={{ display: 'flex', alignItems: 'start' }}>
            <div style={{ marginRight: 20 }}>
              {results?.cagrs?.length>0 && <RollingPercentageDistribution percentageDistribution={results?.percentageDistribution} />}
            </div>
            {results?.cagrs?.length>0 && <ReturnStatisticsTable results={results} />}
          </div>

        </div>
      )}
    </div>
  );
};

export default RollingReturnsWrapper;
