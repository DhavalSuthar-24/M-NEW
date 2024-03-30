import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';

const Charts = () => {
  const chartRef = useRef(null);
  const [productData, setProductData] = useState([]);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const res = await fetch('/api/product/getProducts');
        if (!res.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await res.json();
        // Extract quantity and title from the fetched products
        const productChartData = data.products.map(product => ({
          title: product.title,
          quantity: product.quantity
        }));
        setProductData(productChartData);
      } catch (error) {
        console.error(error);
      }
    };
    
    fetchProductData();
  }, []);

  useEffect(() => {
    if (chartRef.current && productData.length > 0) {
      const chartLabels = productData.map(product => product.title);
      const chartValues = productData.map(product => product.quantity);
      
      const chartData = {
        labels: chartLabels,
        datasets: [
          {
            label: 'Product Quantity',
            data: chartValues,
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
    }
  }, [productData]);

  return (
    <div style={{ width: '1000px', height: '666px' }} className='flex justify-center items-start'>
      <canvas ref={chartRef} />
    </div>
  );
};

export default Charts;
