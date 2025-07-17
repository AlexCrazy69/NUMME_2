import React, { useState, useEffect } from 'react';
import styles from './ImageCarousel.module.css';

const ImageCarousel: React.FC = () => {
  const [images, setImages] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const imageFiles = [
      'template_01.jpg',
      'template_02.jpg',
      'template_03.jpg',
      'template_04.jpg',
      'template_05.jpg',
      'template_06.jpg',
      'template_07.jpg',
      'template_08.jpg',
      'template_09.jpg',
    ];
    setImages(imageFiles.map(file => `/IMAH/${file}`));
  }, []);

  useEffect(() => {
    if (images.length > 0) {
      const timer = setTimeout(() => {
        const isLastImage = currentIndex === images.length - 1;
        const newIndex = isLastImage ? 0 : currentIndex + 1;
        setCurrentIndex(newIndex);
      }, 20000); // Change image every 20 seconds

      return () => clearTimeout(timer);
    }
  }, [currentIndex, images]);

  if (images.length === 0) {
    return null; // Don't render anything if there are no images
  }

  return (
    <div className={styles.carouselContainer}>
      {images.map((image, index) => (
        <div
          key={index}
          className={`${styles.slide} ${index === currentIndex ? styles.active : ''}`}
          style={{ backgroundImage: `url(${image})` }}
        />
      ))}
    </div>
  );
};

export default ImageCarousel;
