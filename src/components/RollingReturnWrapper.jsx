import { useEffect, useState, useMemo } from 'react';
import { calculateRollingReturns, showToast } from '../utils';
import ReactApexChart from 'react-apexcharts';
import { Select, MenuItem, InputLabel, FormControl, CircularProgress, TextField } from '@mui/material';
import RollingPercentageDistribution from './RollingPercentageDistribution';
import ReturnStatisticsTable from './ReturnStatisticsTable';
import moment from 'moment';

const ROLLING_PERIODS = [
  { label: "1M", value: 0.083 },
  { label: "3M", value: 0.25 },
  { label: "6M", value: 0.5 },
  { label: "1Y", value: 1 },
  { label: "2Y", value: 2 },
  { label: "3Y", value: 3 },
  { label: "5Y", value: 5 },
  { label: "7Y", value: 7 },
  {label:"10Y", value: 10},
];

const RollingReturnsWrapper = ({ selectedFundName, navData }) => {
  const [results, setResults] = useState(null);
  const [options, setOptions] = useState(null);
  const [series, setSeries] = useState(null);
  const [rollingPeriod, setRollingPeriod] = useState("3");
  const [totalRange, setTotalRange] = useState(10);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!navData) return;

    setLoading(true);

    const calculatedReturns = calculateRollingReturns(navData, parseFloat(rollingPeriod), totalRange);

    if (calculatedReturns.statusCode === 403) {
      showToast(calculatedReturns.message, "error");
      setLoading(false);
      return;
    }

    setResults(calculatedReturns);
    setLoading(false);
  }, [navData, rollingPeriod, totalRange]);

  const totalRangeOptions = useMemo(() => {
    const earliest = navData?.[navData.length - 1]?.date;
    const start = earliest ? moment(earliest, 'DD-MM-YYYY') : null;
    const fromBeginningLabel = start ? `From Beginning (${start.format('DD-MMM-YYYY')})` : 'From Beginning';

    return [
      { value: 5, label: '5 Years' },
      { value: 7, label: '7 Years' },
      { value: 10, label: '10 Years' },
      { value: -1, label: fromBeginningLabel }
    ];
  }, [navData]);

  const rollingPeriodOptions = useMemo(() => {
    if (!navData?.length) return [];

    const earliest = navData[navData.length - 1].date;
    const availableYears = moment().diff(moment(earliest, 'DD-MM-YYYY'), 'months') / 12;
    const maxAllowed = totalRange === -1 ? availableYears : totalRange;

    return ROLLING_PERIODS.filter(p => p.value < maxAllowed);
  }, [totalRange, navData]);

  useEffect(() => {
    if (!results) return;

    setOptions({
      chart: {
        height: 500,
        width: 1200,
        type: 'line',
        zoom: { enabled: false }
      },
      stroke: {
        curve: 'smooth',
        width: 2
      },
      title: {
        text: `Rolling Returns - ${rollingPeriod}Y CAGR`,
        align: 'left'
      },
      description: {
        text: selectedFundName,
      },
      dataLabels: { enabled: false },
      grid: {
        row: { colors: ['#f3f3f3', 'transparent'], opacity: 0.5 }
      },
      xaxis: {
        type: 'date',
        categories: results?.dates,
        labels: {
          show: true,
          rotate: -45,
          datetimeUTC: false,
          format: 'dd MMM yyyy'
        },
        tickAmount: Math.min(30, results?.dates?.length),
        tooltip: {
          enabled: false,
          formatter: value => new Date(value).toLocaleDateString()
        }
      },
      annotations: {
        yaxis: [
          {
            y: results?.avgCAGR,
            borderColor: 'green',
            label: {
              text: `Average: ${results?.avgCAGR}%`,
              style: { color: '#fff', background: 'green' }
            }
          },
          {
            y: results?.minCAGR,
            borderColor: 'red',
            label: {
              text: `Lowest: ${results?.minCAGR}%`,
              style: { color: '#fff', background: 'red' }
            }
          },
          {
            y: results?.maxCAGR,
            borderColor: 'red',
            label: {
              text: `Highest: ${results?.maxCAGR}%`,
              style: { color: '#fff', background: 'red' }
            }
          }
        ]
      }
    });

    setSeries([
      {
        name: 'Returns %',
        data: results?.cagrs
      }
    ]);
  }, [results, rollingPeriod]);

  return (
    <div>
      <h3>Rolling Returns</h3>
      <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', marginBottom: 20 }}>
        <FormControl variant="outlined" style={{ minWidth: 160 }}>
          <InputLabel id="total-range-label">Total Range</InputLabel>
          <Select
            labelId="total-range-label"
            value={totalRange}
            onChange={(e) => setTotalRange(e.target.value)}
            label="Total Range"
          >
            {totalRangeOptions.map(option => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl variant="outlined" style={{ minWidth: 200 }}>
          <InputLabel id="rolling-period-label">Rolling Period</InputLabel>
            <Select
              labelId="rolling-period-label"
              value={rollingPeriod}
              onChange={(e) => setRollingPeriod(e.target.value)}
              label="Rolling Period"
            >
              {rollingPeriodOptions.map(p => (
                <MenuItem key={p.value} value={p.value}>
                  Rolling Returns {p.label} CAGR
                </MenuItem>
              ))}
            </Select>
        </FormControl>
      </div>

      {loading ? (
        <div style={{ marginTop: 50, display: 'flex', justifyContent: 'center' }}>
          <CircularProgress size={60} />
        </div>
      ) : series ? (
        <div>
          <ReactApexChart options={options} series={series} type="line" height={500} width={1200} />
          <div style={{ display: 'flex', alignItems: 'start' }}>
            <div style={{ marginRight: 20 }}>
              <RollingPercentageDistribution percentageDistribution={results?.percentageDistribution} />
            </div>
            <ReturnStatisticsTable results={results} />
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default RollingReturnsWrapper;
