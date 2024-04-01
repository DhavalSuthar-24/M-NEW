import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';

const Charts = () => {
  const chartRef = useRef(null);
  const [productData, setProductData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchProductData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/product/getProducts?page=${page}&limit=9`);
        if (!res.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await res.json();
        // Extract quantity and title from the fetched products
        const productChartData = data.products.map(product => ({
          title: product.title,
          quantity: product.quantity
        }));
        setProductData(prevData => [...prevData, ...productChartData]);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProductData();
  }, [page]);

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

  const handleShowMore = () => {
    setPage(prevPage => prevPage + 1);
  };

  return (
    <div>
      <div style={{ width: '1000px', height: '666px' }} className='flex justify-center items-start'>
        <canvas ref={chartRef} />
      </div>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {productData.length > 9 && (
        <div className="flex justify-center mt-4">
          <button onClick={handleShowMore} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Show More
          </button>
        </div>
      )}
    </div>
  );
};

export default Charts;
