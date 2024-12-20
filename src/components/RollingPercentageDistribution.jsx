import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';

const RollingPercentageDistribution = ({percentageDistribution}) => {

  const [options, setOptions] = useState({});
  const [series, setSeries] = useState([]);

  useEffect(() => {
    // Extracting labels and values
    const labels = Object.keys(percentageDistribution);
    const values = Object.values(percentageDistribution);

    setOptions({
      chart: {
        type: 'pie',
        width: 350
      },
      labels: labels,
      title: {
        text: 'Returns% Percentage Distribution',
        align: 'center'
      },
      legend: {
        position: 'bottom'
      },
      dataLabels: {
        enabled: true,
        formatter: (val, { seriesIndex, w }) => {
          // Show label and percentage
          return `${w.config.labels[seriesIndex]}`;
        },
        style: {
          fontSize: '14px',
          // fontWeight: 'bold',
          // colors: ['#333'],
        },
      }
    });

    setSeries(values);
  }, [percentageDistribution]);

  return (
    <div>
      <ReactApexChart options={options} series={series} type="pie" width={350} />
    </div>
  );
};

export default RollingPercentageDistribution;
