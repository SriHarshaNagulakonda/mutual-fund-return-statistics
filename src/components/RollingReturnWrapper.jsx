import { useEffect, useState } from 'react';
import { calculateRollingReturns } from '../utils';
import ReactApexChart from 'react-apexcharts';
import { Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import RollingPercentageDistribution from './RollingPercentageDistribution';
import ReturnStatisticsTable from './ReturnStatisticsTable';

// Usage in React component
const RollingReturnsWrapper = ({ navData, fundNames }) => {
  const [results, setResults] = useState(null);
  const [options, setOptions] = useState(null);
  const [series, setSeries] = useState(null);
  const [rollingPeriod, setRollingPeriod] = useState("1");

  useEffect(() => {
    let navResults = [];
    console.log(navData?.length);
    if (navData?.length > 0) {
      for (let i = 0; i < navData?.length; i++){
        const calculatedReturns = calculateRollingReturns(navData[i]?.data, rollingPeriod);
        navResults.push(calculatedReturns);
      }
      setResults(navResults);
    }
    console.log("nav results", navResults);
  }, [navData, rollingPeriod]);

  useEffect(() => {
    if(!results || results?.length==0){
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
        categories: results[0]?.dates, 
        labels: {
          show: true,
          rotate: -45,
          datetimeUTC: false,
          format: 'dd MMM yyyy', 
        },
        tickAmount: Math.min(30, results[0]?.dates?.length), 
        tooltip: {
          enabled: false,
          formatter: function(value) {
            return new Date(value).toLocaleDateString(); 
          }
        }
      },      
      // annotations: {
      //   yaxis: [
      //     {
      //       y: results?.avgCAGR,
      //       borderColor: 'green',
      //       label: {
      //         text: 'Average: '+results?.avgCAGR+'%',
      //         style: {
      //           color: '#fff',
      //           background: 'green'
      //         }
      //       }
      //     },
      //     {
      //       y: results?.minCAGR,
      //       borderColor: 'red',
      //       label: {
      //         text: 'Lowest: '+results?.minCAGR+'%',
      //         style: {
      //           color: '#fff',
      //           background: 'red'
      //         }
      //       }
      //     },
      //     {
      //       y: results?.maxCAGR,
      //       borderColor: 'red',
      //       label: {
      //         text: 'Highest: '+results?.maxCAGR+'%',
      //         style: {
      //           color: '#fff',
      //           background: 'red'
      //         }
      //       }
      //     }
      //   ]
      // }  
    });
    setSeries(results.map((result, index) => {return {
      name: `${fundNames[index]}`,
      data: result?.cagrs
    }}));
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
            {results?.length>0 && <ReturnStatisticsTable fundNames={fundNames} results={results} />}
          </div>
        </div>
      )}
    </div>
  );
};

export default RollingReturnsWrapper;
