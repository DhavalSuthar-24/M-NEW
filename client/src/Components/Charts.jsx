import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const Charts = () => {
  const chartRef = useRef(null);

  useEffect(() => {
    const data = [
      { year: 2010, count: 10 },
      { year: 2011, count: 20 },
      { year: 2012, count: 15 },
      { year: 2013, count: 25 },
      { year: 2014, count: 22 },
      { year: 2015, count: 30 },
      { year: 2016, count: 28 },
    ];

    const chartData = {
      labels: data.map(row => row.year),
      datasets: [
        {
          label: 'Acquisitions by year',
          data: data.map(row => row.count),
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }
      ]
    };

    const ctx = chartRef.current.getContext('2d');

    new Chart(ctx, {
      type: 'bar',
      data: chartData
    });
  }, []);

  return (
    <div style={{ width: '1000px', height: '666px' }} className='flex justify-center items-start'>
      <canvas ref={chartRef} />
    </div>
  );
};

export default Charts;
