import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SlidingProductPhoto = ({ products, height }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    if (products && Array.isArray(products)) {
      // Extracting image URLs from product data
      const productImages = products.map(product => product.image);
      setPhotos(productImages);
    }
  }, [products]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prevIndex => (prevIndex + 1) % photos.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [photos]);

  return (
    <div style={{ position: 'relative', width: '100%', height: height, overflow: 'hidden' }}>
      <AnimatePresence initial={false} custom={currentIndex}>
        <motion.img
          key={currentIndex}
          src={photos[currentIndex]}
          alt="Product"
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: '100%', // Adjust width to fill container
            height: 'auto', // Let height adjust based on aspect ratio
          }}
          initial={{ opacity: 0, x: '100%' }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: '-100%' }}
          transition={{ duration: 0.5 }}
        />
      </AnimatePresence>
    </div>
  );
};

export default SlidingProductPhoto;
