import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';

const PieChart = () => {
  const chartRef = useRef(null);
  const [categoryData, setCategoryData] = useState([]);

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        const res = await fetch('/api/product/getProducts');
        if (!res.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await res.json();
        setCategoryData(data.categories); // Assuming the response has categories array with counts
      } catch (error) {
        console.error(error);
      }
    };
    
    fetchCategoryData();
  }, []);

  useEffect(() => {
    if (chartRef.current && categoryData.length > 0) {
      const chartLabels = categoryData.map(category => category.category);
      const chartValues = categoryData.map(category => category.count);
      
      const chartData = {
        labels: chartLabels,
        datasets: [
          {
            label: 'Category Count',
            data: chartValues,
            backgroundColor: [
              'rgba(255, 99, 132, 0.6)',
              'rgba(54, 162, 235, 0.6)',
              'rgba(255, 206, 86, 0.6)',
              'rgba(75, 192, 192, 0.6)',
              'rgba(153, 102, 255, 0.6)',
              'rgba(255, 159, 64, 0.6)',
              'rgba(255, 99, 132, 0.6)'
              // Add more colors if you have more data
            ],
            borderWidth: 1
          }
        ]
      };

      const ctx = chartRef.current.getContext('2d');

      // Create the pie chart
      new Chart(ctx, {
        type: 'pie',
        data: chartData,
        options: {
          plugins: {
            legend: {
              position: 'bottom',
            }
          }
        }
      });
    }
  }, [categoryData]);

  return (
    <div style={{ width: '888px', height: '588px' }} className='flex justify-center items-start mt-2'>
      <canvas ref={chartRef} />
    </div>
  );
};

export default PieChart;
