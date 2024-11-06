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
        width: 500
      },
      labels: labels,
      title: {
        text: 'Percentage Distribution',
        align: 'center'
      },
      legend: {
        position: 'bottom'
      }
    });

    setSeries(values);
  }, [percentageDistribution]);

  return (
    <div>
      <ReactApexChart options={options} series={series} type="pie" width={380} />
    </div>
  );
};

export default RollingPercentageDistribution;
