import React from 'react';
import { styles } from '../../PremiumWeatherCard.styles';

const WeatherSkeleton: React.FC = () => {
  return (
    <div className={styles.skeleton.container}>
      <div className={styles.skeleton.header}></div>
      <div className={styles.skeleton.content}>
        <div className={styles.skeleton.mainSection}></div>
        <div className={styles.skeleton.grid}>
          <div className={styles.skeleton.gridItem}></div>
          <div className={styles.skeleton.gridItem}></div>
        </div>
      </div>
    </div>
  );
};

export default WeatherSkeleton;