import React, { useState } from 'react';

const CouponGenerator = () => {
  const [couponLength, setCouponLength] = useState(8); // Default coupon length
  const [discountType, setDiscountType] = useState('percentage'); // Default discount type
  const [discountValue, setDiscountValue] = useState(0); // Default discount value
  const [generatedCoupon, setGeneratedCoupon] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleCouponLengthChange = (e) => {
    const value = parseInt(e.target.value);
    if (value >= 1) {
      setCouponLength(value);
      setErrorMessage('');
    } else {
      setErrorMessage('Coupon length must be greater than or equal to 1.');
    }
  };

  const handleDiscountTypeChange = (e) => {
    const selectedDiscountType = e.target.value;
    setDiscountType(selectedDiscountType);
    // Reset discount value if changing from rupees to percentage
    if (selectedDiscountType === 'percentage' && discountValue > 100) {
      setDiscountValue(100);
    }
  };

  const handleDiscountValueChange = (e) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value)) {
      if (discountType === 'percentage' && value > 100) {
        setErrorMessage('Percentage discount value cannot exceed 100%');
      } else {
        setErrorMessage('');
        setDiscountValue(value);
      }
    }
  };

  const generateCoupon = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let coupon = '';

    // Generate random characters for the coupon
    for (let i = 0; i < couponLength; i++) {
      coupon += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    // Apply the discount based on the selected discount type
    let discountAmount = 0;
    if (discountType === 'percentage') {
      discountAmount = Math.floor((discountValue / 100) * coupon.length);
    } else {
      discountAmount = discountValue;
    }

    // Apply discount by removing characters from the end
    coupon = coupon.slice(0, -discountAmount);

    // Set the generated coupon and clear errors
    setGeneratedCoupon(coupon);
  };

  const handleCouponSave = async () => {
    try {
      const response = await fetch('/api/coupon/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          couponCode: generatedCoupon,
          discountType,
          discountValue
        })
      });
      if (!response.ok) {
        throw new Error('Failed to save coupon');
      }
      console.log('Coupon saved successfully');
      // You can add any further logic here after the coupon is successfully saved
    } catch (error) {
      console.error(error);
      // Handle error scenarios here
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-8 p-4">
      <h2 className="text-3xl font-bold mb-4">Coupon Generator</h2>
      <div className="mb-4">
        <label htmlFor="couponLength" className="block font-medium text-gray-700 mb-2">Coupon Length:</label>
        <input
          type="number"
          id="couponLength"
          value={couponLength}
          onChange={handleCouponLengthChange}
          min={1}
          className="border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        {errorMessage && (
          <p className="text-red-500 mt-2">{errorMessage}</p>
        )}
      </div>
      <div className="mb-4">
        <label className="block font-medium text-gray-700 mb-2">Discount Type:</label>
        <div className="flex items-center">
          <input
            type="radio"
            id="percentage"
            value="percentage"
            checked={discountType === 'percentage'}
            onChange={handleDiscountTypeChange}
            className="mr-2"
          />
          <label htmlFor="percentage" className="mr-4">Percentage</label>
          <input
            type="radio"
            id="rupees"
            value="rupees"
            checked={discountType === 'rupees'}
            onChange={handleDiscountTypeChange}
            className="mr-2"
          />
          <label htmlFor="rupees">Rupees</label>
        </div>
      </div>
      {discountType === 'percentage' && (
        <div className="mb-4">
          <label htmlFor="discountValue" className="block font-medium text-gray-700 mb-2">Discount Value (%):</label>
          <input
            type="number"
            id="discountValue"
            value={discountValue}
            onChange={handleDiscountValueChange}
            min={0}
            max={100}
            className="border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      )}
      {discountType === 'rupees' && (
        <div className="mb-4">
          <label htmlFor="discountValue" className="block font-medium text-gray-700 mb-2">Discount Value (Rupees):</label>
          <input
            type="number"
            id="discountValue"
            value={discountValue}
            onChange={handleDiscountValueChange}
            min={0}
            className="border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      )}
      <button onClick={generateCoupon} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Generate Coupon</button>
      {generatedCoupon && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold">Generated Coupon:</h3>
          <p className="text-gray-700">{generatedCoupon}</p>
          <button onClick={handleCouponSave} className="bg-indigo-500 text-white px-4 py-2 rounded-md mt-2 hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Save Coupon</button>
        </div>
      )}
    </div>
  );
};

export default CouponGenerator;
