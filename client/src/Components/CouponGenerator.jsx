import React, { useState } from 'react';

const CouponGenerator = () => {
  const [couponLength, setCouponLength] = useState(8); // Default coupon length
  const [textPattern, setTextPattern] = useState('');
  const [discountType, setDiscountType] = useState('percentage'); // Default discount type
  const [discountValue, setDiscountValue] = useState(0); // Default discount value
  const [generatedCoupon, setGeneratedCoupon] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

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

  const handleCouponLengthChange = (e) => {
    const value = parseInt(e.target.value);
    if (value >= 8) {
      setCouponLength(value);
      setErrorMessage('');
    } else {
      setErrorMessage('Coupon length must be greater than or equal to 8.');
    }
  };

  const handleTextPatternChange = (e) => {
    setTextPattern(e.target.value);
  };

  const handleDiscountTypeChange = (e) => {
    setDiscountType(e.target.value);
  };

  const handleDiscountValueChange = (e) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value)) {
      setDiscountValue(value);
    }
  };

  const generateCoupon = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let coupon = '';

    // Adjust the effective coupon length considering the text pattern
    const effectiveCouponLength = couponLength + textPattern.length;

    // Generate random characters for the coupon
    for (let i = 0; i < effectiveCouponLength; i++) {
      coupon += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    // Insert the text pattern at a random position in the coupon
    if (textPattern) {
      const randomPosition = Math.floor(Math.random() * (coupon.length + 1));
      coupon = coupon.slice(0, randomPosition) + textPattern + coupon.slice(randomPosition);
    }

    // Apply the discount based on the selected discount type
    if (discountType === 'percentage') {
      const discountAmount = Math.floor((discountValue / 100) * coupon.length);
      coupon = coupon.slice(0, -discountAmount);
    } else {
      coupon = coupon.slice(0, -discountValue);
    }

    // Set the generated coupon
    setGeneratedCoupon(coupon);
    setErrorMessage('');
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
          min={8}
          className="border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        {errorMessage && (
          <p className="text-red-500 mt-2">{errorMessage}</p>
        )}
      </div>
      <div className="mb-4">
        <label htmlFor="textPattern" className="block font-medium text-gray-700 mb-2">Text Pattern:</label>
        <input
          type="text"
          id="textPattern"
          value={textPattern}
          onChange={handleTextPatternChange}
          placeholder="Enter text pattern (optional)"
          className="border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
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
      <div className="mb-4">
        <label htmlFor="discountValue" className="block font-medium text-gray-700 mb-2">Discount Value:</label>
        <input
          type="number"
          id="discountValue"
          value={discountValue}
          onChange={handleDiscountValueChange}
          min={0}
          className="border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
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
